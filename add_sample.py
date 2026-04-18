import os, django, requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digital_marketing.settings')
django.setup()

from api.models import GalleryItem

urls = [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800',
    'https://images.unsplash.com/photo-1584982751601-97d883f510fb?w=800'
]
titles = ['Modern Clinic Shoot', 'Healthcare Strategy', 'Doctor Consultation PR']

for url, title in zip(urls, titles):
    resp = requests.get(url)
    if resp.status_code == 200:
        item = GalleryItem(title=title, description='Premium sample photo representing professional clinical marketing standards.')
        # no quotes escaping needed
        filename = title.replace(" ", "_") + ".jpg"
        item.image.save(filename, ContentFile(resp.content), save=True)
        print(f'Saved {title}')
