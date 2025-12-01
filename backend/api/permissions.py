from rest_framework import permissions

class IsAdminOrDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        # 1. User must be logged in
        if not request.user.is_authenticated:
            return False
            
        # 2. If they are trying to DELETE, they MUST be an ADMIN
        if request.method == 'DELETE':
            return request.user.role == 'ADMIN'
            
        # 3. Otherwise (GET, POST, PUT), allow both Doctors and Admins
        return True