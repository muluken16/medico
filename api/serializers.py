from rest_framework import serializers
from .models import (
    Client, ContactMessage, Review, Service, BlogPost, VideoPost, 
    SocialPlatformConnection, SocialFeedPost, SyncConfiguration,
    GalleryItem, TeamMember, NewsletterSubscription, EmailCampaign, CampaignLog,
    EmailTemplate, AdminNotification,
    TelegramTag, TelegramUser, TelegramAppointment, TelegramMessageLog, TelegramCampaign,
    Patient, Product, InventoryItem, Employee, Schedule
)

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = '__all__'

    def get_image_url(self, obj):
        if obj.image:
            return BASE_URL + obj.image.url
        return None

class ScheduleSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.name')
    class Meta:
        model = Schedule
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class InventoryItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    class Meta:
        model = InventoryItem
        fields = '__all__'

import os
# Detect environment
HOSTNAME = os.environ.get('COMPUTERNAME', '')
IS_LOCAL = HOSTNAME == 'MULE'
BASE_URL = "http://127.0.0.1:8000" if IS_LOCAL else "https://fullday.medicodigitals.com"

class SocialPlatformConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialPlatformConnection
        fields = '__all__'

class SocialFeedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialFeedPost
        fields = '__all__'

class SyncConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncConfiguration
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "title", "description", "icon"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "message", "reply_text", "replied_at", "created_at"]
        read_only_fields = ["id", "created_at", "replied_at"]


class ReviewSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ["id", "name", "photo", "photo_url", "message", "rating", "created_at"]

    def get_photo_url(self, obj):
        request = self.context.get("request")
        if obj.photo:
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return BASE_URL + obj.photo.url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {k: v for k, v in data.items() if v not in [None, ""]}

class BlogPostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ["id", "title", "excerpt", "content", "image", "image_url", "published"]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return BASE_URL + obj.image.url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {k: v for k, v in data.items() if v not in [None, ""]}
    
class ClientSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = ['id', 'name', 'logo', 'logo_url']

    def get_logo_url(self, obj):
        request = self.context.get('request')
        if obj.logo:
            if request:
                return request.build_absolute_uri(obj.logo.url)
            return BASE_URL + obj.logo.url
        return None

class VideoPostSerializer(serializers.ModelSerializer):
    video_full_url = serializers.SerializerMethodField()

    class Meta:
        model = VideoPost
        fields = ["id", "title", "video", "video_url", "video_full_url", "description", "is_ai_generated", "created_at"]

    def get_video_full_url(self, obj):
        request = self.context.get("request")
        if obj.video:
            if request:
                return request.build_absolute_uri(obj.video.url)
            return BASE_URL + obj.video.url
        return obj.video_url

class GalleryItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryItem
        fields = ['id', 'title', 'image', 'image_url', 'description', 'created_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return BASE_URL + obj.image.url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {k: v for k, v in data.items() if v not in [None, ""]}

class TeamMemberSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'description', 'image', 'image_url', 'linkedin_url', 'twitter_url', 'email', 'order']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return BASE_URL + obj.image.url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {k: v for k, v in data.items() if v not in [None, ""]}

class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = ['id', 'email', 'name', 'is_active', 'created_at']

class CampaignLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignLog
        fields = ['id', 'subscriber_email', 'status', 'timestamp']

class EmailCampaignSerializer(serializers.ModelSerializer):
    logs = CampaignLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = EmailCampaign
        fields = ['id', 'title', 'template', 'subject', 'message', 'status', 'scheduled_for', 'total_recipients', 'sent_at', 'created_at', 'logs']

class EmailTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailTemplate
        fields = '__all__'

class AdminNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminNotification
        fields = '__all__'

# ===== SMART TELEGRAM CRM SERIALIZERS =====

class TelegramTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelegramTag
        fields = '__all__'

class TelegramUserSerializer(serializers.ModelSerializer):
    tags = TelegramTagSerializer(many=True, read_only=True)
    tags_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=TelegramTag.objects.all(), source='tags', required=False
    )
    class Meta:
        model = TelegramUser
        fields = '__all__'

class TelegramAppointmentSerializer(serializers.ModelSerializer):
    user_info = TelegramUserSerializer(source='user', read_only=True)
    class Meta:
        model = TelegramAppointment
        fields = '__all__'

class TelegramMessageLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelegramMessageLog
        fields = '__all__'

class TelegramCampaignSerializer(serializers.ModelSerializer):
    target_tags = TelegramTagSerializer(many=True, read_only=True)
    target_tags_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=TelegramTag.objects.all(), source='target_tags', required=False
    )
    class Meta:
        model = TelegramCampaign
        fields = '__all__'