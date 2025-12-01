from rest_framework import serializers
from .models import User, Patient, Appointment, MedicalRecord

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role']

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    class Meta:
        model = Appointment
        fields = '__all__'
        
class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True) # <--- ADD THIS
    class Meta:
        model = MedicalRecord
        fields = '__all__'