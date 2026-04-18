import os
import django
from django.utils import timezone

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digital_marketing.settings') 
django.setup()

from api.models import Service, Employee, Patient, Product, InventoryItem, TeamMember, Schedule

def seed():
    print("--- Seeding Clinical Data ---")

    # 1. Services
    services = [
        {'title': 'General Consultation', 'description': 'Primary health checkup and diagnostics.', 'department': 'General Medicine', 'price': 500, 'duration': 30},
        {'title': 'Dental Cleaning', 'description': 'Professional scaling and polishing.', 'department': 'Dental', 'price': 1200, 'duration': 45},
        {'title': 'Cardiology Specialist', 'description': 'Heart health assessment and ECG.', 'department': 'Cardiology', 'price': 2500, 'duration': 60},
    ]
    for s in services:
        Service.objects.get_or_create(title=s['title'], defaults=s)

    # 2. Employees (Internal)
    employees = [
        {'name': 'Dr. Abel Tesfaye', 'employee_id': 'MED-001', 'position': 'Chief Cardiologist', 'department': 'Cardiology', 'specialization': 'Heart Surgery', 'joining_date': '2023-01-15', 'salary': 45000, 'status': 'Active'},
        {'name': 'Dr. Sara Solomon', 'employee_id': 'MED-002', 'position': 'Senior Dentist', 'department': 'Dental', 'specialization': 'Orthodontics', 'joining_date': '2023-05-10', 'salary': 38000, 'status': 'Active'},
        {'name': 'Nurse Hanna Bekele', 'employee_id': 'MED-003', 'position': 'Head Nurse', 'department': 'Nursing', 'specialization': 'General Care', 'joining_date': '2024-02-01', 'salary': 15000, 'status': 'Active'},
    ]
    created_emps = []
    for e in employees:
        emp, _ = Employee.objects.get_or_create(employee_id=e['employee_id'], defaults=e)
        created_emps.append(emp)

    # 3. Schedules
    for emp in created_emps:
        Schedule.objects.get_or_create(
            employee=emp, day_of_week='Monday', 
            defaults={'start_time': '08:00:00', 'end_time': '17:00:00', 'notes': 'Regular Shift'}
        )

    # 4. Patients
    patients = [
        {'full_name': 'Abebe Bikila', 'phone': '0911223344', 'age': 32, 'gender': 'Male', 'blood_type': 'O+', 'medical_history': 'No major issues.'},
        {'full_name': 'Marta Hagos', 'phone': '0922334455', 'age': 28, 'gender': 'Female', 'blood_type': 'A-', 'medical_history': 'Slight allergic to penicillin.'},
    ]
    for p in patients:
        Patient.objects.get_or_create(phone=p['phone'], defaults=p)

    # 5. Products & Inventory
    prod, _ = Product.objects.get_or_create(name='Dental Home Kit', defaults={'category': 'Dental', 'price': 450, 'description': 'Complete kit for home hygiene.'})
    InventoryItem.objects.get_or_create(sku='SKU-GAUZE-01', defaults={'product': prod, 'quantity': 500, 'location': 'Shelf A-4'})

    # 6. Team Members (Public Website)
    TeamMember.objects.get_or_create(name='Dr. Abel Tesfaye', defaults={'role': 'Chief Specialist', 'description': 'Expert in heart diagnostics.'})

    print("--- Seeding Completed Successfully! ---")

if __name__ == "__main__":
    seed()
