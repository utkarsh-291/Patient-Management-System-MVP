from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from .serializers import *
# Import the custom permission
from .permissions import IsAdminOrDoctor 

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    # Apply the new rule
    permission_classes = [IsAdminOrDoctor]

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAdminOrDoctor]

class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAdminOrDoctor]

class DashboardView(viewsets.ViewSet):
    permission_classes = [IsAdminOrDoctor] # Apply here too
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        return Response({
            "total_patients": Patient.objects.count(),
            "pending_appointments": Appointment.objects.filter(status='PENDING').count()
        })