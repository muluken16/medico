from django.core.mail import send_mail
from django.conf import settings
from .models import AdminNotification, EmailTemplate

def notify_admin(title, message):
    """Creates an internal notification for the admin panel."""
    AdminNotification.objects.create(title=title, message=message)

def send_templated_email(recipient_email, template_name, context=None):
    """Generic helper to send emails using a database-stored template."""
    try:
        template = EmailTemplate.objects.filter(name=template_name).first()
        if not template:
            return False
            
        subject = template.subject
        body = template.body
        
        # Simple placeholder replacement
        if context:
            for key, val in context.items():
                body = body.replace(f"{{{{{key}}}}}", str(val))
        
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False,
            html_message=body
        )
        return True
    except Exception as e:
        print(f"Email Service Error: {e}")
        return False
