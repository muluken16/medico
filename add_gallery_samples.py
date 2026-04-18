import os, django, requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digital_marketing.settings')
django.setup()

from api.models import GalleryItem

gallery_data = [
    {
        'title': 'Clinical Center Shoot',
        'desc': 'Professional clinical photography for branding.',
        'url': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80'
    },
    {
        'title': 'Medical Branding',
        'desc': 'Elite identity design for specialists.',
        'url': 'https://images.unsplash.com/photo-1505751172107-5739a00723a5?w=500&q=80' # Portrait
    },
    {
        'title': 'Modern Hospital UI',
        'desc': 'Patient-centered interface design.',
        'url': 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1000&q=80' # Wide
    },
    {
        'title': 'Health Strategy Session',
        'desc': 'Workshop for clinical growth.',
        'url': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
    },
    {
        'title': 'Doctor Specialist PR',
        'desc': 'Building authority for medical experts.',
        'url': 'https://images.unsplash.com/photo-1559839734-2b71f1e59816?w=500&q=80' # Portrait
    },
    {
        'title': 'Digital Health Platform',
        'desc': 'Scaling telehealth solutions.',
        'url': 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?w=1200&q=80' # Landscape
    }
]

for data in gallery_data:
    resp = requests.get(data['url'])
    if resp.status_code == 200:
        item = GalleryItem(title=data['title'], description=data['desc'])
        filename = data['title'].replace(" ", "_") + ".jpg"
        item.image.save(filename, ContentFile(resp.content), save=True)
        print(f'Saved {data["title"]}')
