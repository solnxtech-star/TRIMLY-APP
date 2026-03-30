from django.db import models
from django.conf import settings
import uuid

class Wallet(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    # One wallet per User (Individual Vendor or Salon Owner)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    
    # Money currently held in escrow (Customer has paid, but service isn't done)
    pending_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Money the vendor can actually withdraw to their bank
    available_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    updated_at = models.DateTimeField(auto_now=True)



    def __str__(self):
        return f"{self.user.email} - Avail: {self.available_balance}"



class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    TRANSACTION_TYPES = (
        ('deposit', 'Deposit'),      # Customer paying into Escrow
        ('payout', 'Payout'),        # Vendor withdrawing to Bank
        ('refund', 'Refund'),        # Money going back to Customer
    )
    STATUS = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'failed')
    )
    
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    tx_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    
    # Link to the specific booking
    booking_id = models.CharField(max_length=100, null=True, blank=True)
    
    # Flutterwave's reference IDs
    tx_ref = models.CharField(max_length=200, unique=True)
    flw_ref = models.CharField(max_length=100, unique=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS, default=STATUS[0]) # pending, completed, failed
    created_at = models.DateTimeField(auto_now_add=True)

    
class WithdrawalRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
    )
    wallet = models.ForeignKey('Wallet', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reference = models.CharField(max_length=100, unique=True) # Our internal ID
    flw_transfer_id = models.IntegerField(null=True, blank=True) # From Flutterwave
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.wallet.user.email} - {self.amount} - {self.status}"
    