from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (('ADMIN', 'Admin'), ('DOCTOR', 'Doctor'))
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='DOCTOR')

class Patient(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    contact = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, related_name='appointments', on_delete=models.CASCADE)
    date = models.DateTimeField()
    reason = models.TextField()
    status = models.CharField(max_length=20, default='PENDING')

class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, related_name='records', on_delete=models.CASCADE)
    diagnosis = models.TextField()
    treatment = models.TextField()
    date = models.DateField(auto_now_add=True)