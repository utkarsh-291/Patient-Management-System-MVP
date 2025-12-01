from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Patient, Appointment, MedicalRecord

class CustomUserAdmin(UserAdmin):
    # This adds the 'role' field to the edit form
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role',)}),
    )
    # This adds the 'role' field to the "add user" form
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role',)}),
    )

# Register the User model with the new settings
admin.site.register(User, CustomUserAdmin)

# Register other models
admin.site.register(Patient)
admin.site.register(Appointment)
admin.site.register(MedicalRecord)