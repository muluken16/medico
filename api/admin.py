from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Client, ContactMessage, Review, Service, BlogPost, VideoPost, TeamMember, GalleryItem, NewsletterSubscription

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title']

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'published']
    ordering = ['-published']
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at")
    search_fields = ("name", "email", "subject", "message")
    list_filter = ("created_at",)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("name", "rating", "created_at")
    search_fields = ("name", "message")
    list_filter = ("rating", "created_at")
    ordering = ("-created_at",)

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'logo')  # Display name and logo in the list view
    search_fields = ('name',)  # Allow searching by name
    list_filter = ('name',)  # Filter by name

@admin.register(VideoPost)
class VideoPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_ai_generated', 'created_at')
    list_filter = ('is_ai_generated', 'created_at')
    search_fields = ('title', 'description')

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'order', 'email', 'created_at')
    list_editable = ('order',)
    search_fields = ('name', 'role', 'description', 'email')

@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')

@admin.register(NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'created_at')
    search_fields = ('email',)
    search_fields = ('title', 'description')