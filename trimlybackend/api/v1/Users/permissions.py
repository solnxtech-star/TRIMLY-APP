from rest_framework import permissions

from api.v1.Salons.models import SalonProfile
from api.v1.Vendor.models import IndividualVendorProfile
from api.v1.Category.models import GalleryImage, GalleryPost

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

        if obj.vendor_service and obj.vendor_service.vendor.worker == request.user:
            return True

        return False
    
class BookingActionPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # 1. Admin override
        if request.user.role == "admin":
            return True

        # 2. Let standard viewing actions pass (Ownership is handled by the other class)
        if view.action in ["retrieve", "list", "metadata"]:
            return True

        # COMPLETE / CONFIRM → provider only
        if view.action in ["complete", "get_status"]:
            return  obj.customer == request.user

        # 4. CANCEL → customer or provider
        if view.action == "cancel":
            return (
                obj.customer == request.user or
                (obj.salon_service and obj.salon_service.salon.owner == request.user) or
                (obj.vendor_service and obj.vendor_service.vendor.worker == request.user)
            )

        # Default to False for any other actions you haven't explicitly allowed
        return False

class IsSalonAvailabilityOwnerObj(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "admin":
            return True
        if request.method in permissions.SAFE_METHODS:
            return True
    
        return obj.salon.owner == request.user
    
class IsVendorAvailabilityOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
    
        return obj.vendor == request.user


class IsOwnerOfTargetProvider(permissions.BasePermission):
    """
    Ensures user owns the salon/vendor in the URL.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

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

class IsNINVerified(permissions.BasePermission):

    """
    Allows access only to vendors/salon owners who have verified their NIN.
    """
    def has_permission(self, request, view):
        user = request.user
        
        # 1. Safety Check: Is the user even logged in?
        if not user or not user.is_authenticated:
            return False

        # 2. Check Role and NIN status based on the specific profile
        if user.role == "individual_vendor":
            # Use getattr to avoid crashing if the profile is missing
            profile = getattr(user, 'individual_vendor_profile', None)
            return profile.is_nin_verified if profile else False
            
        elif user.role == "salon_owner":
            profile = getattr(user, 'salon_owner_profile', None)
            return profile.is_nin_verified if profile else False

        # 3. If they are just a 'customer' or other role, deny access
        return False
class IsWalletOrTransactionObjOwner(permissions.BasePermission):
    '''allow wallet owners or transaction'''
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not request.user.is_authenticated:
            return False
        if not request.user.role in ["salon_owner", "individual_vendor"]:
            return False
        if hasattr(obj, user):
            return obj.user == request.user
        return obj.wallet.user == request.user

    
from rest_framework import permissions

class IsTransactionOwner(permissions.BasePermission):
    """
    Handles both List access and Detail access for Transactions
    """
    def has_permission(self, request, view):
        # 1. Basic Auth check
        if not request.user or not request.user.is_authenticated:
            return False
        
        # 2. Role check (Make sure these match your User model choices)
        # Note: If you want to be lean, just check is_authenticated
        allowed_roles = ["salon_owner", "individual_vendor"] 
        if request.user.role not in allowed_roles:
            return False
            
        return True # CRITICAL: You must return True here!

    def has_object_permission(self, request, view, obj):
        # Logic to check if the transaction belongs to the user's wallet
        # Since Transaction usually has a FK to Wallet, and Wallet to User:
        return obj.wallet.user == request.user
    
    from rest_framework import permissions

# api/v1/Users/permissions.py
 # or wherever your models are imported

class IsGalleryOwner(permissions.BasePermission):
    """
    Allows access only to the vendor who owns the gallery post or image asset.
    """
    def has_permission(self, request, view):
        # Ensure the user is logged in
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # 1. If it's a direct GalleryPost instance
        if isinstance(obj, GalleryPost):
            return obj.vendor.worker == request.user  # Adjust 'vendor' if your field is named 'user'

        # 2. If it's a single GalleryImage asset, check through its parent post relationship
        if isinstance(obj, GalleryImage):
            return obj.post.vendor.worker == request.user  # Traverses the foreign key relation

        return False