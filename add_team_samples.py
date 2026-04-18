import os, django, requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digital_marketing.settings')
django.setup()

from api.models import TeamMember

team_data = [
    {
        'name': 'Dr. Muluken',
        'role': 'Founder & Medical Strategist',
        'description': 'Bridging the gap between clinical excellence and digital patient engagement.',
        'image_url': 'https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?w=400&h=400&fit=crop'
    },
    {
        'name': 'Sarah Johnson',
        'role': 'Head of Growth',
        'description': 'Expert in healthcare SEO and ethical patient acquisition strategies.',
        'image_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
    },
    {
        'name': 'David Chen',
        'role': 'Lead Designer',
        'description': 'Creating user-centric medical interfaces that build patient trust.',
        'image_url': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop'
    }
]

for data in team_data:
    resp = requests.get(data['image_url'])
    if resp.status_code == 200:
        member = TeamMember(
            name=data['name'], 
            role=data['role'], 
            description=data['description']
        )
        filename = data['name'].replace(" ", "_") + ".jpg"
        member.image.save(filename, ContentFile(resp.content), save=True)
        print(f'Saved {data["name"]}')
    else:
        # Fallback if image fails
        TeamMember.objects.create(
            name=data['name'], 
            role=data['role'], 
            description=data['description']
        )
        print(f'Saved {data["name"]} (no image)')
