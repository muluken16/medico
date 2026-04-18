import csv
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from django.http import HttpResponse
from django.contrib.auth import authenticate
from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view, action
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import (
    Client, ContactMessage, Review, Service, BlogPost, VideoPost, 
    SocialPlatformConnection, SocialFeedPost, SyncConfiguration, GalleryItem, TeamMember, 
    NewsletterSubscription, EmailCampaign, CampaignLog, EmailTemplate, AdminNotification,
    TelegramTag, TelegramUser, TelegramAppointment, TelegramMessageLog, TelegramCampaign, 
    Patient, Product, InventoryItem, Employee, Schedule
)
from .serializers import (
    ClientSerializer, ContactMessageSerializer, ReviewSerializer, ServiceSerializer, 
    BlogPostSerializer, VideoPostSerializer, SocialPlatformConnectionSerializer, 
    SocialFeedPostSerializer, SyncConfigurationSerializer, GalleryItemSerializer, 
    TeamMemberSerializer, NewsletterSubscriptionSerializer, EmailCampaignSerializer, 
    CampaignLogSerializer, EmailTemplateSerializer, AdminNotificationSerializer,
    TelegramTagSerializer, TelegramUserSerializer, TelegramAppointmentSerializer,
    TelegramMessageLogSerializer, TelegramCampaignSerializer,
    PatientSerializer, ProductSerializer, InventoryItemSerializer, EmployeeSerializer, ScheduleSerializer
)

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [AllowAny]
from .email_service import notify_admin, send_templated_email

# 📌 Auth & Chat Logic
class SocialPlatformConnectionViewSet(viewsets.ModelViewSet):
    queryset = SocialPlatformConnection.objects.all()
    serializer_class = SocialPlatformConnectionSerializer
    permission_classes = [AllowAny]

class SocialFeedPostViewSet(viewsets.ModelViewSet):
    queryset = SocialFeedPost.objects.all()
    serializer_class = SocialFeedPostSerializer
    permission_classes = [AllowAny]

class SyncConfigurationViewSet(viewsets.ModelViewSet):
    queryset = SyncConfiguration.objects.all()
    serializer_class = SyncConfigurationSerializer
    permission_classes = [AllowAny]

@api_view(["POST"])
def admin_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    
    if user and user.is_superuser:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "username": user.username,
            "is_superuser": user.is_superuser
        }, status=status.HTTP_200_OK)
    return Response({"error": "Invalid credentials or not authorized"}, status=status.HTTP_401_UNAUTHORIZED)

CHAT_RESPONSES = {
    "hello": "👋 Hello! Welcome to Medico Digital Marketing...",
    "default": "That's a great question! Would you like me to send your inquire as a detailed email?"
}

@api_view(["POST"])
def chat_with_ai(request):
    try:
        messages = request.data.get("messages", [])
        last_message_content = messages[-1].get("content", "").lower()
        response_text = CHAT_RESPONSES.get(last_message_content, CHAT_RESPONSES["default"])
        
        notify_admin("New Chat Inquiry", f"Patient asked: {last_message_content}")
        
        return Response({"choices": [{"message": {"content": response_text}}]})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 📌 Generic ViewSets
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

class GalleryItemViewSet(viewsets.ModelViewSet):
    queryset = GalleryItem.objects.all().order_by('-created_at')
    serializer_class = GalleryItemSerializer
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all().order_by('order', 'created_at')
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.order_by("-published")
    serializer_class = BlogPostSerializer
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

class VideoPostViewSet(viewsets.ModelViewSet):
    queryset = VideoPost.objects.all().order_by("-created_at")
    serializer_class = VideoPostSerializer
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by("-created_at")
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

# 📌 Advanced Automated ViewSets
class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by("-created_at")
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        instance = serializer.save()
        notify_admin("New Inquiry Received", f"Patient {instance.name} sent a message regarding {instance.subject}")
        # Auto-reply using Template
        send_templated_email(instance.email, "Auto-Reply", {"name": instance.name})

    @action(detail=True, methods=['post'])
    def add_to_subscribers(self, request, pk=None):
        message = self.get_object()
        sub, created = NewsletterSubscription.objects.get_or_create(
            email=message.email,
            defaults={'name': message.name}
        )
        if created:
            notify_admin("New Subscriber (Converted)", f"{message.email} was added from Inbox.")
            send_templated_email(sub.email, "Welcome Email", {"name": sub.name})
            return Response({"status": "Converted to subscriber"}, status=status.HTTP_201_CREATED)
        return Response({"status": "User already subscribed"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        message = self.get_object()
        reply_text = request.data.get("reply_text")
        # ... logic for custom reply ...
        message.reply_text = reply_text
        message.replied_at = timezone.now()
        message.save()
        send_mail(f"Re: {message.subject}", reply_text, settings.DEFAULT_FROM_EMAIL, [message.email])
        return Response({"status": "Reply sent"})

class NewsletterSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscription.objects.all().order_by('-created_at')
    serializer_class = NewsletterSubscriptionSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        instance = serializer.save()
        notify_admin("New Subscriber Joined", f"{instance.email} just joined the mailing list.")
        send_templated_email(instance.email, "Welcome Email", {"name": instance.name or "Subscriber"})

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="subscribers.csv"'
        writer = csv.writer(response)
        writer.writerow(['Email', 'Name', 'Active', 'Subscribed At'])
        for sub in self.queryset:
            writer.writerow([sub.email, sub.name, sub.is_active, sub.created_at])
        return response

class EmailCampaignViewSet(viewsets.ModelViewSet):
    queryset = EmailCampaign.objects.all().order_by('-created_at')
    serializer_class = EmailCampaignSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['post'])
    def send_campaign(self, request, pk=None):
        campaign = self.get_object()
        subscribers = NewsletterSubscription.objects.filter(is_active=True)
        
        recipient_list = [sub.email for sub in subscribers]
        
        if recipient_list:
            send_mail(
                campaign.subject,
                campaign.message,
                settings.DEFAULT_FROM_EMAIL,
                recipient_list,
                fail_silently=False,
            )
            
            campaign.status = 'Sent'
            campaign.sent_at = timezone.now()
            campaign.total_recipients = len(recipient_list)
            campaign.save()
            
            notify_admin("Campaign Sent Successfully", f"Marketing campaign '{campaign.title}' was delivered to {len(recipient_list)} recipients.")
            return Response({"status": "Campaign sent", "count": len(recipient_list)})
        
        return Response({"error": "No active subscribers found"}, status=status.HTTP_400_BAD_REQUEST)

class EmailTemplateViewSet(viewsets.ModelViewSet):
    queryset = EmailTemplate.objects.all().order_by('-created_at')
    serializer_class = EmailTemplateSerializer
    permission_classes = [AllowAny]

class AdminNotificationViewSet(viewsets.ModelViewSet):
    queryset = AdminNotification.objects.all()
    serializer_class = AdminNotificationSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        AdminNotification.objects.all().update(is_read=True)
        return Response({"status": "All marked as read"})

class SocialPlatformConnectionViewSet(viewsets.ModelViewSet):
    queryset = SocialPlatformConnection.objects.all()
    serializer_class = SocialPlatformConnectionSerializer
    permission_classes = [AllowAny]

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

# ===== SMART TELEGRAM CRM VIEWSETS =====

class TelegramTagViewSet(viewsets.ModelViewSet):
    queryset = TelegramTag.objects.all()
    serializer_class = TelegramTagSerializer
    permission_classes = [AllowAny]

class TelegramUserViewSet(viewsets.ModelViewSet):
    queryset = TelegramUser.objects.all().order_by('-last_interaction')
    serializer_class = TelegramUserSerializer
    permission_classes = [AllowAny]

class TelegramAppointmentViewSet(viewsets.ModelViewSet):
    queryset = TelegramAppointment.objects.all().order_by('-appointment_date')
    serializer_class = TelegramAppointmentSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        appointment = self.get_object()
        appointment.payment_status = 'paid'
        appointment.status = 'confirmed'
        appointment.save()

        # Notify User on Telegram
        from .telegram_service import send_telegram_message
        send_telegram_message(
            appointment.user.chat_id,
            f"✅ <b>Appointment Confirmed!</b>\n\nYour payment for <b>{appointment.appointment_date.strftime('%Y-%m-%d %H:%M')}</b> has been verified.\n\nWe look forward to seeing you at the clinic! 🩺",
            user_instance=appointment.user,
            message_type='confirmation'
        )
        return Response({"status": "Payment confirmed and user notified"})

    @action(detail=True, methods=['post'])
    def send_confirmation(self, request, pk=None):
        appointment = self.get_object()
        from .telegram_service import send_telegram_message
        msg = (
            f"✅ <b>Appointment Confirmed!</b>\n\n"
            f"• 🏥 <b>Service:</b> {appointment.service_name}\n"
            f"• 📅 <b>Date:</b> {appointment.appointment_date.strftime('%Y-%m-%d')}\n"
            f"• 🕒 <b>Time:</b> {appointment.appointment_date.strftime('%H:%M')}\n"
            f"• 🩺 <b>Doctor:</b> {appointment.doctor_assigned or 'Clinic Staff'}\n\n"
            "We look forward to seeing you! 🩺"
        )
        send_telegram_message(appointment.user.chat_id, msg, user_instance=appointment.user)
        return Response({"status": "Confirmation sent"})

    @action(detail=True, methods=['post'])
    def send_reminder(self, request, pk=None):
        appointment = self.get_object()
        from .telegram_service import send_telegram_message
        msg = (
            f"🔔 <b>Appointment Reminder</b>\n\n"
            f"Hi {appointment.user.name}, this is a reminder for your upcoming appointment:\n\n"
            f"• 🏥 {appointment.service_name}\n"
            f"• 📅 <b>Today at {appointment.appointment_date.strftime('%H:%M')}</b>\n\n"
            "Please arrive 15 minutes early. See you soon!"
        )
        send_telegram_message(appointment.user.chat_id, msg, user_instance=appointment.user)
        return Response({"status": "Reminder sent"})

class TelegramMessageLogViewSet(viewsets.ModelViewSet):
    queryset = TelegramMessageLog.objects.all()
    serializer_class = TelegramMessageLogSerializer
    permission_classes = [AllowAny]



class TelegramCampaignViewSet(viewsets.ModelViewSet):
    queryset = TelegramCampaign.objects.all().order_by('-created_at')
    serializer_class = TelegramCampaignSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        campaign = serializer.save()
        if not campaign.scheduled_for:
            campaign.status = 'Sending'
            campaign.save()
            # Send the campaign!
            from .telegram_service import run_targeted_campaign
            sent_count = run_targeted_campaign(campaign)
            campaign.total_recipients = sent_count
            campaign.save()

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
def telegram_webhook(request):
    """
    Endpoint for Telegram to send updates (New messages, users clicking START)
    """
    try:
        from .telegram_service import process_telegram_update
        data = request.data
        process_telegram_update(data)
        return Response({"status": "ok"})
    except Exception as e:
        print(f"Webhook error: {e}")
        return Response({"status": "error"}, status=200) # Always return 200 so Telegram stops retrying

@csrf_exempt
@api_view(['POST'])
def telegram_send_direct(request):
    """
    Send a rich direct message (text + optional media attachments) to specific chat_ids.
    Accepts multipart/form-data:
      - chat_ids: JSON array string e.g. '["123","456"]'
      - message:  text (optional if media present)
      - files[]:  one or more uploaded files (images, audio, video, documents)
    """
    import json
    from .telegram_service import send_telegram_rich_message

    # Parse chat_ids (sent as JSON string in multipart)
    raw_ids = request.data.get('chat_ids', '[]')
    try:
        chat_ids = json.loads(raw_ids) if isinstance(raw_ids, str) else raw_ids
    except Exception:
        chat_ids = []

    message = request.data.get('message', '').strip()
    uploaded_files = request.FILES.getlist('files')

    if not chat_ids:
        return Response({"error": "chat_ids are required."}, status=400)
    if not message and not uploaded_files:
        return Response({"error": "Provide a message or at least one file."}, status=400)

    # Detect file types
    def detect_type(f):
        ct = f.content_type or ''
        if ct.startswith('image'):   return 'photo'
        if ct.startswith('video'):   return 'video'
        if ct.startswith('audio') or 'ogg' in ct: return 'audio'
        return 'document'

    results = {"sent": 0, "failed": 0, "details": []}

    for chat_id in chat_ids:
        chat_id_str = str(chat_id)
        try:
            user = TelegramUser.objects.filter(chat_id=chat_id_str).first()
            name = (user.name or user.username or 'Friend') if user else 'Friend'

            # Personalize text
            personalized = message.replace('{{name}}', name) if message else ''

            # Build attachments list — reset file pointers
            attachments = []
            for f in uploaded_files:
                f.seek(0)
                attachments.append({
                    'file': f.read(),  # read bytes
                    'type': detect_type(f),
                    'caption': personalized if not personalized else ''
                })
                f.seek(0)

            # If we have attachments, send text separately first (or as caption on first attachment)
            if attachments:
                # Put caption on first attachment, send rest without caption
                for i, att in enumerate(attachments):
                    att_file = uploaded_files[i]
                    att_file.seek(0)
                    cap = personalized if (i == 0 and personalized) else ''
                    
                    from .telegram_service import send_telegram_media
                    ok = send_telegram_media(
                        chat_id_str,
                        media_file=att_file,
                        media_type=att['type'],
                        caption=cap,
                        user_instance=user,
                        message_type='direct'
                    )
                    att_file.seek(0)
                    
                    # If text not used as caption, send separately after
                    if i == 0 and personalized and not cap:
                        send_telegram_message(chat_id_str, personalized, user_instance=user, message_type='direct')
                    
                    if ok:
                        results["sent"] += 1
                    else:
                        results["failed"] += 1
                    results["details"].append({"chat_id": chat_id_str, "file": uploaded_files[i].name, "status": "sent" if ok else "failed"})
            else:
                # Text only
                from .telegram_service import send_telegram_message
                ok = send_telegram_message(chat_id_str, personalized, user_instance=user, message_type='direct')
                if ok:
                    results["sent"] += 1
                else:
                    results["failed"] += 1
                results["details"].append({"chat_id": chat_id_str, "status": "sent" if ok else "failed"})

        except Exception as e:
            results["failed"] += 1
            results["details"].append({"chat_id": chat_id_str, "status": f"error: {e}"})

    return Response(results)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer