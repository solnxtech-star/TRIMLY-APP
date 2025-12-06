from rest_framework import permissions

class IsApplicationAdmin(permissions.BasePermission):
    """
    Custom permission to only allow users with role='ADMIN' to access.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated first
        if not request.user.is_authenticated:
            return False
            
        # Check if the user's custom role matches 'ADMIN'
        return request.user.role == 'admin'