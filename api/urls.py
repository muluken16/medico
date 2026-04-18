from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceViewSet,
    ContactMessageViewSet,
    ReviewViewSet,
    BlogPostViewSet,
    VideoPostViewSet,
    ClientViewSet,
    SocialPlatformConnectionViewSet,
    SocialFeedPostViewSet,
    SyncConfigurationViewSet,
    GalleryItemViewSet,
    TeamMemberViewSet,
    NewsletterSubscriptionViewSet,
    EmailCampaignViewSet,
    EmailTemplateViewSet,
    AdminNotificationViewSet,
    TelegramTagViewSet,
    TelegramUserViewSet,
    TelegramAppointmentViewSet,
    TelegramMessageLogViewSet,
    TelegramCampaignViewSet,
    PatientViewSet,
    ProductViewSet,
    InventoryItemViewSet,
    chat_with_ai,
    admin_login,
    telegram_webhook,
    telegram_send_direct,
    EmployeeViewSet,
    ScheduleViewSet
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'contact', ContactMessageViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'posts', BlogPostViewSet)
router.register(r'vposts', VideoPostViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'social-connections', SocialPlatformConnectionViewSet)
router.register(r'social-feed', SocialFeedPostViewSet)
router.register(r'sync-config', SyncConfigurationViewSet)
router.register(r'gallery', GalleryItemViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'newsletter', NewsletterSubscriptionViewSet)
router.register(r'campaigns', EmailCampaignViewSet)
router.register(r'templates', EmailTemplateViewSet)
router.register(r'notifications', AdminNotificationViewSet)
router.register(r'telegram/tags', TelegramTagViewSet)
router.register(r'telegram/users', TelegramUserViewSet)
router.register(r'telegram/appointments', TelegramAppointmentViewSet)
router.register(r'telegram/logs', TelegramMessageLogViewSet)
router.register(r'telegram/campaigns', TelegramCampaignViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'products', ProductViewSet)
router.register(r'inventory', InventoryItemViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'schedules', ScheduleViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("chat/", chat_with_ai, name="chat_with_ai"),
    path("login/", admin_login, name="admin_login"),
    path("telegram/webhook/", telegram_webhook, name="telegram_webhook"),
    path("telegram/send-direct/", telegram_send_direct, name="telegram_send_direct"),
]
