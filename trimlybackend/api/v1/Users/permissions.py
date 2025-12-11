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

            

class IsAdminOrSalonOwner(permissions.BasePermission):
    def has_permission(self, request, view):   
        if not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return request.user.role in ["salon_owner", "admin"]
            # Check if the user's custom role matches 'ADMIN'
        
class IsAdminOrSalonOwnerObject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        elif request.user.role == "admin":
            return True
        return obj.owner == request.user

class IsAdminOrSalonServiceOwnerObject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        elif request.user.role == "admin":
            return True
        return obj.salon.owner == request.user
    
class IsAdminVendorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):   
        if not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return request.user.role in ["individual_vendor", "admin"]

class IsAdminOrVendorServiceObject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        elif request.user.role == "admin":
            return True
        return obj.vendor == request.user