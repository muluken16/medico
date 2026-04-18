# Create your models here.
from django.db import models

class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    duration = models.PositiveIntegerField(default=30, help_text="Duration in minutes")
    department = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
    
class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    reply_text = models.TextField(blank=True, null=True)
    replied_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.subject} ({self.created_at:%Y-%m-%d})"
    
class Review(models.Model):
    name = models.CharField(max_length=100)
    photo = models.ImageField(upload_to="reviews/photos/", blank=True, null=True)  # uploaded file
    message = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)  # 1–5
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.rating}⭐️)"

class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    excerpt = models.TextField()
    content = models.TextField()
    image = models.ImageField(upload_to="blog/images/", blank=True, null=True)
    published = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Client(models.Model):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='clients/logos/', max_length=500, blank=True, null=True)

    def __str__(self):
        return self.name

class VideoPost(models.Model):
    title = models.CharField(max_length=255)
    video = models.FileField(upload_to="videos/vposts/", blank=True, null=True)
    video_url = models.URLField(blank=True, null=True, help_text="Alternatively, provide a video link (e.g. TikTok, YouTube, etc.)")
    description = models.TextField(blank=True)
    is_ai_generated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# ===== NEW SOCIAL MEDIA HUB MODELS =====

class SocialPlatformConnection(models.Model):
    PLATFORM_CHOICES = [
        ('Instagram', 'Instagram'),
        ('Facebook', 'Facebook'),
        ('TikTok', 'TikTok'),
        ('LinkedIn', 'LinkedIn'),
    ]
    STATUS_CHOICES = [
        ('Connected', 'Connected'),
        ('Disconnected', 'Disconnected'),
    ]
    
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    client_id = models.CharField(max_length=255, blank=True, null=True)
    client_secret = models.CharField(max_length=255, blank=True, null=True)
    access_token = models.TextField(blank=True, null=True)
    refresh_token = models.TextField(blank=True, null=True)
    token_expiry = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Disconnected')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.platform} ({self.status})"

class SocialFeedPost(models.Model):
    platform = models.CharField(max_length=50)
    post_id = models.CharField(max_length=255, unique=True)
    author_name = models.CharField(max_length=255, blank=True)
    caption = models.TextField(blank=True)
    media_url = models.URLField(max_length=1000, blank=True)
    post_url = models.URLField(max_length=1000, blank=True)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)

class Patient(models.Model):
    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')]
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    address = models.TextField(blank=True)
    medical_history = models.TextField(blank=True)
    blood_type = models.CharField(max_length=5, blank=True, null=True, help_text="e.g. O+, A-")
    emergency_contact = models.CharField(max_length=255, blank=True, null=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="products/images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class InventoryItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="items")
    sku = models.CharField(max_length=100, unique=True)
    quantity = models.IntegerField(default=0)
    location = models.CharField(max_length=100, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} ({self.sku})"
    visibility = models.BooleanField(default=True)
    synced_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.product.name} ({self.sku})"

class SyncConfiguration(models.Model):
    FREQUENCY_CHOICES = [
        ('Hourly', 'Hourly'),
        ('6-Hours', '6-Hours'),
        ('Daily', 'Daily'),
    ]
    platform = models.CharField(max_length=50, unique=True)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='6-Hours')
    webhooks_enabled = models.BooleanField(default=False)
    last_synced = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.platform} Sync ({self.frequency})"

class GalleryItem(models.Model):
    title = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="gallery/images/")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Gallery Image {self.id}"

class TeamMember(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="team/images/", blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "created_at"]

    def __str__(self):
        return f"{self.name} - {self.role}"

class NewsletterSubscription(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class EmailTemplate(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=255)
    body = models.TextField(help_text="HTML or Plain Text content")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class EmailCampaign(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Scheduled', 'Scheduled'),
        ('Sending', 'Sending'),
        ('Sent', 'Sent'),
        ('Failed', 'Failed'),
    ]
    title = models.CharField(max_length=255)
    template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField(help_text="HTML or Plain Text content")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    scheduled_for = models.DateTimeField(null=True, blank=True)
    total_recipients = models.IntegerField(default=0)
    sent_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.status}"

class CampaignLog(models.Model):
    campaign = models.ForeignKey(EmailCampaign, on_delete=models.CASCADE, related_name='logs')
    subscriber_email = models.EmailField()
    status = models.CharField(max_length=50) # e.g. "Sent", "Failed: SMTP Error"
    timestamp = models.DateTimeField(auto_now_add=True)

class AdminNotification(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Employee(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('On Leave', 'On Leave'),
        ('Resigned', 'Resigned'),
        ('Suspended', 'Suspended'),
    ]
    name = models.CharField(max_length=255)
    employee_id = models.CharField(max_length=50, unique=True, help_text="Badge or System ID")
    position = models.CharField(max_length=150)
    department = models.CharField(max_length=100, blank=True)
    specialization = models.CharField(max_length=200, blank=True, help_text="Expertise (e.g. Cardiology)")
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField(blank=True)
    joining_date = models.DateField()
    salary = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    emergency_contact = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.employee_id})"

class Schedule(models.Model):
    DAY_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="schedules")
    day_of_week = models.CharField(max_length=15, choices=DAY_CHOICES)
    category = models.CharField(max_length=100, blank=True, help_text="e.g. Cardiology, Dental")
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    notes = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.employee.name} - {self.day_of_week} ({self.start_time}-{self.end_time})"

# ===== SMART TELEGRAM CRM MODELS =====

class TelegramTag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class TelegramUser(models.Model):
    chat_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    gender = models.CharField(max_length=20, blank=True, null=True, help_text="Requested for Patient registration")
    address = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=100, blank=True, null=True)
    tags = models.ManyToManyField(TelegramTag, blank=True, related_name="users")
    join_date = models.DateTimeField(auto_now_add=True)
    last_interaction = models.DateTimeField(auto_now=True)
    current_state = models.CharField(max_length=100, default='idle')
    state_data = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.name or self.username or self.chat_id

class TelegramAppointment(models.Model):
    STATUS_CHOICES = [
        ('pending_payment', 'Pending Payment'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    PAYMENT_STATUS_CHOICES = [
        ('unpaid', 'Unpaid'),
        ('pending_verification', 'Pending Verification'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    user = models.ForeignKey(TelegramUser, on_delete=models.CASCADE, related_name="appointments")
    service_name = models.CharField(max_length=100, blank=True, null=True)
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_payment')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='unpaid')
    payment_screenshot = models.ImageField(upload_to="telegram/payments/", blank=True, null=True)
    notes = models.TextField(blank=True, null=True, help_text="Patient notes from Telegram")
    internal_notes = models.TextField(blank=True, null=True, help_text="Clinic notes for staff")
    doctor_assigned = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.appointment_date.strftime('%Y-%m-%d %H:%M')} ({self.status})"

class TelegramMessageLog(models.Model):
    user = models.ForeignKey(TelegramUser, on_delete=models.CASCADE, related_name="messages")
    message_content = models.TextField()
    message_type = models.CharField(max_length=50) # welcome, reminder, campaign, follow-up
    status = models.CharField(max_length=20, default='sent') # sent, failed
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-sent_at']

    def __str__(self):
        return f"To {self.user.name}: {self.message_type}"

class TelegramCampaign(models.Model):
    title = models.CharField(max_length=255)
    target_tags = models.ManyToManyField(TelegramTag, blank=True)
    message = models.TextField(help_text="Message body. Use {{name}} for personalization.")
    status = models.CharField(max_length=20, default='Draft') # Draft, Scheduled, Sent
    scheduled_for = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    total_recipients = models.IntegerField(default=0)

    def __str__(self):
        return self.title