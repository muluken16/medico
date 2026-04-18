import requests
from django.conf import settings
from .models import TelegramUser, TelegramTag, TelegramMessageLog
from django.utils import timezone

def _get_token():
    token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
    if not token:
        raise ValueError("Telegram Bot Token is not configured in settings.")
    return token

def _log_message(user_instance, content, message_type, status):
    if user_instance:
        TelegramMessageLog.objects.create(
            user=user_instance,
            message_content=content,
            message_type=message_type,
            status=status
        )

def send_telegram_message(chat_id, text, user_instance=None, message_type='system', reply_markup=None):
    """Send a plain text message via Telegram Bot API with optional keyboard."""
    try:
        token = _get_token()
        url = f"https://api.telegram.org/bot{token}/sendMessage"
        payload = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'HTML'
        }
        if reply_markup:
            payload['reply_markup'] = reply_markup
            
        response = requests.post(url, json=payload)
        status_text = 'sent' if response.ok else f"failed: {response.text}"
        _log_message(user_instance, text, message_type, status_text)
        return response.ok
    except Exception as e:
        print(f"send_telegram_message error: {e}")
        _log_message(user_instance, text, message_type, 'failed: exception')
        return False

def send_telegram_media(chat_id, media_file, media_type, caption='', user_instance=None, message_type='direct'):
    """
    Send a rich media message (image, video, audio, document) via Telegram Bot API.
    media_type: 'photo' | 'video' | 'audio' | 'document' | 'voice'
    media_file: an open file-like object or file path string
    """
    TYPE_ENDPOINTS = {
        'photo':    'sendPhoto',
        'video':    'sendVideo',
        'audio':    'sendAudio',
        'document': 'sendDocument',
        'voice':    'sendVoice',
    }
    endpoint = TYPE_ENDPOINTS.get(media_type, 'sendDocument')
    
    # Field key for the file in multipart form
    FIELD_NAMES = {
        'photo':    'photo',
        'video':    'video',
        'audio':    'audio',
        'document': 'document',
        'voice':    'voice',
    }
    field_name = FIELD_NAMES.get(media_type, 'document')

    try:
        token = _get_token()
        url = f"https://api.telegram.org/bot{token}/{endpoint}"
        
        data = {'chat_id': chat_id}
        if caption:
            data['caption'] = caption
            data['parse_mode'] = 'HTML'
        
        if isinstance(media_file, str):
            # It's a URL or a file_id — send as JSON
            data[field_name] = media_file
            response = requests.post(url, json=data)
        else:
            # It's a real file object — send as multipart
            response = requests.post(url, data=data, files={field_name: media_file})
        
        status_text = 'sent' if response.ok else f"failed: {response.text}"
        log_content = f"[{media_type.upper()} ATTACHMENT] {caption[:80]}"
        _log_message(user_instance, log_content, message_type, status_text)
        return response.ok
    except Exception as e:
        print(f"send_telegram_media error: {e}")
        _log_message(user_instance, f"[{media_type.upper()} ATTACHMENT]", message_type, f"failed: {e}")
        return False

def send_telegram_rich_message(chat_id, text='', attachments=None, user_instance=None, message_type='direct'):
    """
    High-level function: send a text message AND/OR one or more media attachments to a chat_id.
    attachments: list of dicts { 'type': 'photo'|'video'|'audio'|'document', 'file': file_obj, 'caption': '' }
    """
    success = True
    # 1. Send text first (if provided)
    if text:
        ok = send_telegram_message(chat_id, text, user_instance=user_instance, message_type=message_type)
        if not ok:
            success = False

    # 2. Send each attachment
    if attachments:
        for att in attachments:
            ok = send_telegram_media(
                chat_id,
                media_file=att.get('file'),
                media_type=att.get('type', 'document'),
                caption=att.get('caption', ''),
                user_instance=user_instance,
                message_type=message_type
            )
            if not ok:
                success = False
    return success

def process_telegram_update(update_data):
    """
    Processes incoming webhooks (messages and callback queries) from Telegram.
    Modern UI with State Machine.
    """
    callback_query = update_data.get('callback_query')
    message = update_data.get('message')
    
    if not message and not callback_query:
        return
        
    chat_id = None
    text = ''
    photo = []
    
    if callback_query:
        chat_id = str(callback_query['message']['chat']['id'])
        text = callback_query.get('data', '') # Using callback data as text for state logic
        message = callback_query['message']
    else:
        chat_id = str(message['chat']['id'])
        text = message.get('text', '')
        photo = message.get('photo', [])

    chat = message.get('chat', {})
    first_name = chat.get('first_name', '')
    username = chat.get('username', '')
    
    # helper for keyboards
    def get_main_keyboard():
        """Returns the persistent ReplyKeyboardMarkup (Action Menu)."""
        return {
            'keyboard': [
                [{'text': '📅 Book Appointment'}, {'text': '📜 My Bookings'}],
                [{'text': '🏥 About Clinic'}, {'text': '📍 Clinic Location'}],
                [{'text': '💬 Live Support'}, {'text': '🏠 Home'}]
            ],
            'resize_keyboard': True,
            'one_time_keyboard': False
        }

    def get_back_keyboard():
        """Keyboard for sub-menus with back option."""
        return {
            'inline_keyboard': [
                [{'text': '⬅️ Back', 'callback_data': 'back'}, {'text': '❌ Cancel', 'callback_data': 'home'}]
            ]
        }

    # 1. Register or Fetch User
    user, _ = TelegramUser.objects.get_or_create(
        chat_id=chat_id,
        defaults={'name': first_name, 'username': username}
    )
    user.last_interaction = timezone.now()
    
    # 2. Assign Default Tags (new_user)
    if 'new_user' not in [tag.name for tag in user.tags.all()]:
        new_user_tag, _ = TelegramTag.objects.get_or_create(name='new_user')
        user.tags.add(new_user_tag)

    # 3. Handle Commands & Navigation (Global)
    lower_text = text.lower().strip()
    
    # "Back" button logic
    if lower_text == 'back' or lower_text == '⬅️ back':
        prev_state = user.state_data.get('prev_state', 'idle')
        user.current_state = prev_state
        user.save()
        # Trigger re-processing with the previous state (simulated)
        if prev_state == 'idle': text = '/start'
        elif prev_state == 'awaiting_service': text = 'book'
        elif prev_state == 'awaiting_date': text = user.state_data.get('service', 'General')
        lower_text = text.lower().strip()

    if lower_text == '/start' or lower_text == 'home' or lower_text == '🏠 home':
        user.current_state = 'idle'
        user.state_data = {}
        user.save()
        send_telegram_message(
            chat_id,
            f"Hi {first_name} 👋\n\nWelcome back to <b>Medico Digital</b>. I am your advanced clinical assistant.\n\n"
            "Use the <b>Menu Button</b> below to navigate our services at any time.",
            user_instance=user,
            message_type='welcome',
            reply_markup=get_main_keyboard()
        )
        return

    # 4. State Machine Logic
    state = user.current_state

    # -- IDLE / MAIN MENU --
    if state == 'idle':
        if 'book' in lower_text:
            user.state_data['prev_state'] = 'idle'
            user.current_state = 'awaiting_phone' if not user.phone else 'awaiting_service'
            user.save()
            
            if user.current_state == 'awaiting_phone':
                send_telegram_message(
                    chat_id,
                    "📱 <b>Contact Information</b>\n\nTo continue your booking, please type your <b>phone number</b> (e.g., 0912345678):",
                    user_instance=user,
                    reply_markup={'inline_keyboard': [[{'text': '⬅️ Cancel', 'callback_data': 'home'}]]}
                )
            else:
                from .models import Service
                services = Service.objects.all()[:8] # Limit to 8 for keyboard space
                
                if services.exists():
                    keyboard = {
                        'inline_keyboard': [
                            [{'text': f"🩺 {s.title}", 'callback_data': s.title}] for s in services
                        ] + [[{'text': '⬅️ Back to Menu', 'callback_data': 'home'}]]
                    }
                else:
                    keyboard = {
                        'inline_keyboard': [
                            [{'text': '🩺 General Consultation', 'callback_data': 'General Consultation'}],
                            [{'text': '⬅️ Back to Menu', 'callback_data': 'home'}]
                        ]
                    }
                
                send_telegram_message(
                    chat_id,
                    "🛡️ <b>Appointment Booking</b>\n\n<b>Step 1:</b> Select the clinical service you wish to book:",
                    user_instance=user,
                    reply_markup=keyboard
                )
        elif 'about' in lower_text:
            send_telegram_message(
                chat_id,
                "🏥 <b>Medico Digital Clinic</b>\n\nQuality healthcare powered by digital precision. We specialize in Dentistry, Pediatrics, and General Medicine.\n\n📍 Bole, Addis Ababa\n📞 +251 911 223 344",
                user_instance=user,
                reply_markup=get_main_keyboard()
            )
        elif 'bookings' in lower_text:
            from .models import TelegramAppointment
            appts = TelegramAppointment.objects.filter(user=user).order_by('-created_at')[:10]
            if appts:
                msg = "📜 <b>Your Appointment Dashboard:</b>\n\n"
                for a in appts:
                    status_icon = "✅" if a.status == 'confirmed' else "⏳" if a.status == 'pending_payment' else "❌"
                    svc = a.service_name or "General"
                    msg += f"{status_icon} <b>{svc}</b>\n"
                    msg += f"   📅 <b>{a.appointment_date.strftime('%b %d, %H:%M')}</b>\n"
                    msg += f"   Status: {a.get_status_display()}\n"
                    msg += f"   Payment: {a.get_payment_status_display()}\n\n"
            else:
                msg = "🧐 You don't have any bookings yet. Click <b>Book Appointment</b> to start!"
            send_telegram_message(chat_id, msg, user_instance=user, reply_markup=get_main_keyboard())
        elif 'location' in lower_text:
            # Send Real Location Object
            token = _get_token()
            requests.post(f"https://api.telegram.org/bot{token}/sendLocation", json={
                'chat_id': chat_id,
                'latitude': 9.0068, 
                'longitude': 38.7833
            })
            send_telegram_message(
                chat_id, 
                "📍 <b>We are located in Bole!</b>\n\nSee the map above for directions.\nOpen: Mon-Sat (8 AM - 8 PM)", 
                user_instance=user,
                reply_markup=get_main_keyboard()
            )
        elif 'support' in lower_text:
            support_tag, _ = TelegramTag.objects.get_or_create(name='support_needed')
            user.tags.add(support_tag)
            send_telegram_message(
                chat_id,
                "👩‍💻 <b>Reception Notified</b>\n\nA live support agent at the front desk has been alerted. Please type your question here and we will reply directly.",
                user_instance=user,
                reply_markup=get_main_keyboard()
            )

    # -- BOOKING FLOW: PHONE --
        user.phone = text
        user.save()
        
        if not user.gender:
            user.current_state = 'awaiting_gender'
            user.save()
            keyboard = {
                'inline_keyboard': [
                    [{'text': '👨 Male', 'callback_data': 'Male'}, {'text': '👩 Female', 'callback_data': 'Female'}],
                    [{'text': '⬅️ Back', 'callback_data': 'home'}]
                ]
            }
            send_telegram_message(
                chat_id,
                "👤 <b>Step 1.5: Gender (Sex)</b>\n\nPlease select your gender for clinical registration:",
                user_instance=user,
                reply_markup=keyboard
            )
        else:
            # Skip if already have gender
            user.current_state = 'awaiting_service'
            user.save()
            from .models import Service
            services = Service.objects.all()[:8]
            # ... (rest of service logic) ...
            # Actually I should just call the next step's logic or repeat it here.
            # I'll just copy the service keyboard logic for simplicity.
            if services.exists():
                keyboard = {'inline_keyboard': [[{'text': f"🩺 {s.title}", 'callback_data': s.title}] for s in services] + [[{'text': '⬅️ Back', 'callback_data': 'home'}]]}
            else:
                keyboard = {'inline_keyboard': [[{'text': '🩺 General Consultation', 'callback_data': 'General Consultation'}], [{'text': '⬅️ Back', 'callback_data': 'home'}]]}
                
            send_telegram_message(
                chat_id,
                f"✅ Info saved. Let's book your visit.\n\n<b>Step 2:</b> Select the service:",
                user_instance=user,
                reply_markup=keyboard
            )

    # -- BOOKING FLOW: GENDER --
    elif state == 'awaiting_gender':
        user.gender = text
        user.current_state = 'awaiting_service'
        user.save()
        
        from .models import Service
        services = Service.objects.all()[:8]
        if services.exists():
            keyboard = {'inline_keyboard': [[{'text': f"🩺 {s.title}", 'callback_data': s.title}] for s in services] + [[{'text': '⬅️ Back to Menu', 'callback_data': 'home'}]]}
        else:
            keyboard = {'inline_keyboard': [[{'text': '🩺 General Consultation', 'callback_data': 'General Consultation'}], [{'text': '⬅️ Back to Menu', 'callback_data': 'home'}]]}
        
        send_telegram_message(
            chat_id,
            f"✅ Thanks <b>{user.name}</b>. Profiles updated.\n\n<b>Step 2:</b> Select the clinical service you wish to visit:",
            user_instance=user,
            reply_markup=keyboard
        )

    # -- BOOKING FLOW: SERVICE --
    elif state == 'awaiting_service':
        user.state_data['service'] = text
        user.state_data['prev_state'] = 'awaiting_service'
        user.current_state = 'awaiting_date'
        user.save()
        
        # Advanced Date Picker (Next 10 Days, Skipping Sundays)
        keyboard = {'inline_keyboard': []}
        count = 0
        days_ahead = 0
        while count < 7: # Show 7 valid days
            d = timezone.now() + timezone.timedelta(days=days_ahead)
            if d.weekday() != 6: # 6 is Sunday
                day_name = "Today" if days_ahead == 0 else "Tomorrow" if days_ahead == 1 else d.strftime('%A')
                keyboard['inline_keyboard'].append([{'text': f"📅 {day_name} ({d.strftime('%b %d')})", 'callback_data': d.strftime('%Y-%m-%d')}])
                count += 1
            days_ahead += 1
        
        keyboard['inline_keyboard'].append([{'text': '⬅️ Back', 'callback_data': 'book'}])
        
        send_telegram_message(
            chat_id,
            f"Selected: <b>{text}</b>\n\n📅 <b>Step 2: Select Date</b>\n\nChoose an available day from the next week:",
            user_instance=user,
            reply_markup=keyboard
        )

    # -- BOOKING FLOW: DATE --
    elif state == 'awaiting_date':
        user.state_data['selected_date'] = text
        user.state_data['prev_state'] = 'awaiting_date'
        user.current_state = 'awaiting_slot'
        user.save()
        
        slots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']
        keyboard = {'inline_keyboard': []}
        for i in range(0, len(slots), 2):
            keyboard['inline_keyboard'].append([
                {'text': f"🕒 {slots[i]}", 'callback_data': slots[i]},
                {'text': f"🕒 {slots[i+1]}", 'callback_data': slots[i+1]}
            ])
        keyboard['inline_keyboard'].append([{'text': '⬅️ Back', 'callback_data': user.state_data.get('service', 'book')}])
            
        send_telegram_message(
            chat_id,
            f"Date: <b>{text}</b>\n\n🕒 <b>Step 3: Available Slots</b>\n\nEvery slot is 1-hour. Pick your time:",
            user_instance=user,
            reply_markup=keyboard
        )

    # -- BOOKING FLOW: SLOT --
    elif state == 'awaiting_slot':
        user.state_data['selected_slot'] = text
        user.current_state = 'awaiting_notes'
        user.save()
        
        send_telegram_message(
            chat_id,
            "📝 <b>Clinical Notes (Optional)</b>\n\nType any specific symptoms or reasons for your visit, or click <b>Skip</b>.",
            user_instance=user,
            reply_markup={'inline_keyboard': [[{'text': '⏭️ Skip', 'callback_data': 'No notes provided'}]]}
        )

    # -- BOOKING FLOW: NOTES --
    elif state == 'awaiting_notes':
        user.state_data['notes'] = text
        user.current_state = 'awaiting_payment_method'
        user.save()
        
        keyboard = {
            'inline_keyboard': [
                [{'text': '📱 Telebirr / Mobile Money', 'callback_data': 'Telebirr'}],
                [{'text': '🏦 Bank Transfer (CBE/Awash)', 'callback_data': 'Bank'}],
                [{'text': '💵 Cash at Clinic (Pay on Arrival)', 'callback_data': 'Cash'}],
                [{'text': '⬅️ Back', 'callback_data': 'back_to_slot'}]
            ]
        }
        send_telegram_message(
            chat_id,
            "💳 <b>Final Step: Payment Method</b>\n\nHow would you like to secure your booking?",
            user_instance=user,
            reply_markup=keyboard
        )

    # -- BOOKING FLOW: PAYMENT METHOD --
    elif state == 'awaiting_payment_method':
        method = text
        user.state_data['payment_method'] = method
        
        service = user.state_data.get('service', 'General')
        date_str = user.state_data.get('selected_date', 'Today')
        slot = user.state_data.get('selected_slot', 'Morning')
        
        from .models import TelegramAppointment
        try:
            from datetime import datetime
            appt_date = timezone.make_aware(datetime.strptime(f"{date_str} {slot}", '%Y-%m-%d %I:%M %p'))
        except:
            appt_date = timezone.now() + timezone.timedelta(days=1)

        if method == 'Cash':
            # Cash bookings are confirmed immediately but marked as unpaid
            appointment = TelegramAppointment.objects.create(
                user=user,
                service_name=service,
                appointment_date=appt_date,
                status='confirmed',
                payment_status='unpaid',
                notes=user.state_data.get('notes', '')
            )
            
            # Auto-Sync to Patient Master Data
            from .models import Patient
            Patient.objects.update_or_create(
                phone=user.phone,
                defaults={
                    'full_name': user.name,
                    'gender': user.gender
                }
            )
            user.current_state = 'idle'
            user.state_data = {}
            user.save()
            send_telegram_message(
                chat_id,
                f"✅ <b>Appointment Confirmed!</b>\n\n• 🏥 {service}\n• 📅 {date_str}\n• 🕒 {slot}\n\n"
                "You have chosen to <b>Pay in Cash</b> at the reception. Please arrive 15 minutes early. See you soon! 🩺",
                user_instance=user,
                reply_markup=get_main_keyboard()
            )
        else:
            # Electronic payments need verification
            user.current_state = 'awaiting_payment'
            user.save()
            
            instructions = (
                "<b>Instructions:</b>\n"
                "• 📱 Telebirr: 0912345678\n"
                "• 🏦 CBE: 100012345678\n\n"
                "📸 <b>Please upload your receipt photo below to finalize.</b>"
            )
            send_telegram_message(
                chat_id,
                f"🛡️ <b>Securing Slot via {method}</b>\n\n{instructions}",
                user_instance=user,
                reply_markup={'inline_keyboard': [[{'text': '⬅️ Change Method', 'callback_data': 'awaiting_slot'}]]}
            )

    # -- BOOKING FLOW: PAYMENT VERIFICATION --
    elif state == 'awaiting_payment':
        if photo:
            service = user.state_data.get('service', 'General')
            date_str = user.state_data.get('selected_date', 'Today')
            slot = user.state_data.get('selected_slot', 'Morning')
            
            from .models import TelegramAppointment
            try:
                from datetime import datetime
                appt_date = timezone.make_aware(datetime.strptime(f"{date_str} {slot}", '%Y-%m-%d %I:%M %p'))
            except:
                appt_date = timezone.now() + timezone.timedelta(days=1)

            appointment = TelegramAppointment.objects.create(
                user=user,
                service_name=service,
                appointment_date=appt_date,
                status='pending_payment',
                payment_status='pending_verification',
                notes=user.state_data.get('notes', '')
            )
            
            user.current_state = 'idle'
            user.state_data = {}
            user.save()
            send_telegram_message(
                chat_id,
                "🚀 <b>Receipt Received!</b>\n\nOur team is verifying your payment. Your slot is now reserved. You can track this in <b>My Bookings</b>.",
                user_instance=user,
                reply_markup=get_main_keyboard()
            )
        else:
            send_telegram_message(
                chat_id, "⚠️ Please upload the <b>photo/screenshot</b> of your receipt.", user_instance=user
            )

    user.save()

def run_targeted_campaign(campaign):
    """Filters users for a specific campaign and batches messages out."""
    target_tags = campaign.target_tags.all()
    users = TelegramUser.objects.filter(tags__in=target_tags).distinct() if target_tags.exists() else TelegramUser.objects.all()
    
    sent_count = 0
    for user in users:
        personalized_message = campaign.message.replace('{{name}}', user.name or user.username or 'Friend')
        success = send_telegram_message(
            user.chat_id, personalized_message,
            user_instance=user, message_type=f"campaign:{campaign.id}"
        )
        if success:
            sent_count += 1
            
    campaign.status = 'Sent'
    campaign.sent_at = timezone.now()
    campaign.save()
    return sent_count
