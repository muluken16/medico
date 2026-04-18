import os
import django
import sys

# Set up Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digital_marketing.settings')
django.setup()

from api.models import EmailTemplate, EmailCampaign, AdminNotification, NewsletterSubscription

def seed_data():
    print("Seed: Seeding Sample Automation Data...")

    # 1. Create Email Templates
    welcome_tmpl, _ = EmailTemplate.objects.get_or_create(
        name="Welcome Email",
        defaults={
            "subject": "Welcome to Medico Digital!",
            "body": "<h1>Hello {{name}},</h1><p>Thank you for subscribing to our clinical newsletter. We are excited to have you with us!</p><p>Regards,<br>Medico Team</p>"
        }
    )
    
    reply_tmpl, _ = EmailTemplate.objects.get_or_create(
        name="Auto-Reply",
        defaults={
            "subject": "We received your inquiry",
            "body": "Hi {{name}},\n\nThank you for contacting Medico Digital. Our team has received your message and will get back to you within 24 hours.\n\nBest,\nMedico Support"
        }
    )
    print("Seed: Created Email Templates")

    # 2. Create Sample Subscribers (if they don't exist)
    sub1, _ = NewsletterSubscription.objects.get_or_create(
        email="patient1@example.com",
        defaults={"name": "John Doe", "is_active": True}
    )
    sub2, _ = NewsletterSubscription.objects.get_or_create(
        email="patient2@example.com",
        defaults={"name": "Jane Smith", "is_active": True}
    )
    print("Seed: Created Sample Subscribers")

    # 3. Create a Marketing Campaign
    camp, _ = EmailCampaign.objects.get_or_create(
        title="Summer Wellness 2024",
        defaults={
            "subject": "Time for your Summer Health Checkup!",
            "message": "Beat the heat with a comprehensive full-body checkup. Book your slot today and get 20% off!",
            "status": "Draft",
            "total_recipients": 2
        }
    )
    print("Seed: Created Marketing Campaign")

    # 4. Create Admin Notifications
    AdminNotification.objects.get_or_create(
        title="New Subscriber Joined",
        message="John Doe (patient1@example.com) just joined the mailing list.",
        is_read=False
    )
    AdminNotification.objects.get_or_create(
        title="Campaign Analysis Ready",
        message="The 'Summer Wellness' campaign draft is ready for review.",
        is_read=False
    )
    print("Seed: Created Admin Notifications")

    print("\nSeed: All sample data is ready! Refresh your Admin Panel to see it.")

if __name__ == "__main__":
    seed_data()
