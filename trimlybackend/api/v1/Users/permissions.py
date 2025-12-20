from rest_framework import permissions

from api.v1.Salons.models import SalonProfile
from api.v1.Vendor.models import IndividualVendorProfile

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


class IsAdminVendorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):   
        if not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return request.user.role in ["individual_vendor", "admin"]
        
  
        
class IsAdminOrSalonServiceOwnerObject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        elif request.user.role == "admin":
            return True
        return obj.salon.owner == request.user
    
class IsAdminOrVendorServiceObject(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        elif request.user.role == "admin":
            return True
        return obj.vendor == request.user
    


class IsBookingOwnerOrProvider(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):

        if request.user.role == "admin":
            return True

        if obj.customer == request.user:
            return True

        if obj.salon_service and obj.salon_service.salon.owner == request.user:
            return True

        if obj.vendor_service and obj.vendor_service.vendor == request.user:
            return True

        return False
    
class BookingActionPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):

        # Admin override
        if request.user.role == "admin":
            return True

        # COMPLETE / CONFIRM → provider only
        if view.action in ["confirm", "complete"]:
            return (
                (obj.salon and obj.salon.owner == request.user) or
                (obj.vendor and obj.vendor == request.user)
            )

        # CANCEL → customer or provider
        if view.action == "cancel":
            return (
                obj.customer == request.user or
                (obj.salon and obj.salon.owner == request.user) or
                (obj.vendor and obj.vendor == request.user)
            )

        return False

class IsSalonAvailabilityOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "admin":
            return True
    
        return obj.salon.owner == request.user
    
class IsVendorAvailabilityOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "admin":
            return True
    
        return obj.vendor == request.user


class IsOwnerOfTargetProvider(permissions.BasePermission):
    """
    Ensures user owns the salon/vendor in the URL.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.role == "admin":
            return True

        # SALON availability
        salon_id = view.kwargs.get("salon_id")
        if salon_id:
            return SalonProfile.objects.filter(
                id=salon_id,
                owner=request.user
            ).exists()

        # VENDOR availability
        vendor_id = view.kwargs.get("vendor_id")
        if vendor_id:
            return IndividualVendorProfile.objects.filter(
                id=vendor_id,
                user=request.user
            ).exists()

        return False
