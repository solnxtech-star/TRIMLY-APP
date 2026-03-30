import json
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
from api.v1.Payments.serializers import SubAccountSerializer
from api.v1.Payments.services.subaccounts import FlutterwaveService
from .models import Wallet, Transaction, WithdrawalRequest
from django.db import transaction
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework import status
from django.shortcuts import get_object_or_404
import uuid
from .serializers import PaymentInitSerializer, PaymentLinkResponseSerializer, WithdrawalRequestSerializer, VerifyPaymentSerializer
from api.v1.Bookings.models import Booking
from django.db import IntegrityError
from api.v1.Users.permissions import IsNINVerified,IsWalletOrTransactionObjOwner, IsTransactionOwner
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from .models import Wallet, Transaction
from .serializers import WalletSerializer, TransactionSerializer

from decimal import Decimal

class PaymentWebhookView(APIView):
    authentication_classes = [] 
    permission_classes = []

    def post(self, request): 
        # 1. Verify Secret Hash (Security Layer 1)
        flw_signature = request.headers.get('verif-hash')
        if not flw_signature or flw_signature != settings.FLW_SECRET_HASH:
            return Response({"status": "unauthorized"}, status=401)

        payload = request.data
        flw_id = payload.get('id') 

        if not flw_id:
            return Response({"status": "error", "message": "No transaction ID"}, status=400)

        # 2. THE CONFIRMATION STEP (Security Layer 2 - THE TRUTH)
        # We call FLW to confirm this payload is real and get verified data
        verification = FlutterwaveService.verify_transaction(flw_id)
        
        if verification.get('status') != 'success':
            return Response({"status": "error", "message": "Verification failed"}, status=400)

        # 'data' comes from the Flutterwave API, not the untrusted webhook payload
        data = verification.get('data')

        if data.get('status') == 'successful':
            # Use 'data' variable for everything below
            tx_ref = data.get('tx_ref')
            flw_ref = data.get('flw_ref')
            amount = data.get('amount')
            
            try:
                # Split the tx_ref to get your UUID (e.g., TRM-uuid)
                booking_id = tx_ref.split('-', 1)[1]
                booking = Booking.objects.get(id=booking_id)
            except (Booking.DoesNotExist, IndexError):
                # Return 200 so FLW stops retrying, even if we can't find the booking
                return Response({"status": "error", "message": "Booking not found"}, status=200)

            total_amount = Decimal(str(amount))
            vendor_share = total_amount * Decimal('0.85')
        
            with transaction.atomic():
                # 3. GET OR CREATE TRANSACTION (Prevent double-crediting)
                # We use flw_ref here because it's unique to every payment\
                vendor_user = booking.get_vendor_user 
                wallet, _ = Wallet.objects.get_or_create(user=vendor_user)
                txn, created = Transaction.objects.get_or_create(
                    flw_ref=flw_ref,
                    defaults={
                        'wallet': wallet, # Or your wallet logic
                        'amount': vendor_share,
                        'tx_type': 'deposit',
                        'status': 'pending',
                        'tx_ref' : tx_ref,
                        'booking_id': str(booking.id)
                    }
                )

                # ONLY update balance and status if this is the FIRST time we see this txn
                if created:
                    # Update Wallet
                   
                    wallet.pending_balance = Decimal(str(wallet.pending_balance)) + vendor_share
                    wallet.save()

                    # Update Booking Status
                    booking.status = "confirmed"
                    booking.vendor_payout_amount = vendor_share
                    booking.save()

            return Response({"status": "success"}, status=200)
        
        return Response({"status": "failed"}, status=200)


class RegisterBankDetailsView(GenericAPIView):
    serializer_class = SubAccountSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            
            # Check roles: Individual Vendor or Salon Owner only
            if user.role not in ['individual_vendor', 'salon_owner']:
                return Response({"error": "Only vendors and salons can register bank details."}, status=403)

            
            # Call Flutterwave
            flw_response = FlutterwaveService.create_subaccount(serializer.validated_data)

            if flw_response.get('status') == 'success':
                with transaction.atomic():
                    # Save the ID to the correct profile
                    sub_id = flw_response['data']['subaccount_id']
                    bank_code = flw_response['data']['account_bank']
                    account_number = flw_response['data']['account_number']
                    
                    if user.role == 'individual_vendor':
                        profile = user.individual_vendor_profile
                    elif user.role == 'salon_owner':
                        profile = user.salon_owner_Profile
                        
                    profile.flw_subaccount_id = sub_id
                    profile.bank_code = bank_code
                    profile.account_number = account_number
                    profile.save()

                    wallet, created = Wallet.objects.get_or_create(user=user)
                    if created:
                        wallet.save()



                return Response({
                    "message": "Bank details registered successfully",
                    "subaccount_id": sub_id
                }, status=status.HTTP_201_CREATED)
    
            return Response(flw_response, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InitializePaymentView(GenericAPIView):
    serializer_class = PaymentInitSerializer

    def post(self, request):
        # 1. Validate the incoming Booking ID
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking_id = serializer.validated_data['booking_id']
        
        # 2. Look up the Booking and Service details (Security)
        booking = get_object_or_404(Booking, id=booking_id, customer=request.user)
        service = booking.vendor_service or booking.salon_service
        
        # 3. Determine Vendor and Price
        amount = service.price
        vendor_user_id = service.vendor.worker.id if booking.vendor_service else service.salon.owner.id

        # 4. Call Flutterwave Service
        flw_data = FlutterwaveService.initialize_payment(
            booking, vendor_user_id, amount
        )
        print(flw_data)

        # 5. Handle the Response using the Response Serializer
        if flw_data.get('status') == 'success':
            booking.payment_reference = flw_data.get("tx_ref")
            booking.save()
            
            # Prepare data for the response serializer
            response_data = {
                "status": "success",
                "message": "Redirect to this link to pay",
                "link": flw_data['data']['link']
            }
            return Response(PaymentLinkResponseSerializer(response_data).data)

        return Response(flw_data, status=status.HTTP_400_BAD_REQUEST)
    


class RequestWithdrawalView(GenericAPIView):
    
    '''Check NIN
    Check available_balance
    Call Flutterwave transfer
    available_balance -= amount
    Create withdrawal record
    '''
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [IsNINVerified,]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        amount = serializer.validated_data['amount']
        client_id = serializer.validated_data['request_id']
        
        user = request.user
        wallet = get_object_or_404(Wallet, user=user)

        if wallet.available_balance < amount:
            return Response({"error": "Insufficient funds"}, status=400)

        # 1. Create the command reference
        my_reference = f"WD-{client_id}_PMCKDU_1"

        try:
            with transaction.atomic():
                #verify nin
                # 2. Call Flutterwave FIRST
                profile = user.individual_vendor_profile or user.salon_owner_profile
                flw_resp = FlutterwaveService.initiate_transfer(
                    account_bank=profile.bank_code,
                    account_number=profile.account_number,
                    amount=amount,
                    reference=my_reference 
                )

                # 3. Check if Flutterwave accepted it
                if flw_resp.get('status') != 'success':
                    error_msg = flw_resp.get('message', 'API Error')
                    raise ValueError(f"Flutterwave Error: {error_msg}")

                # 4. NOW extract the ID and create records
                # Since we are inside 'with transaction.atomic()', if anything 
                # below fails, the money won't be deducted.
                flw_id = flw_resp.get('data', {}).get('id')

                # A. Deduct money
                wallet.available_balance -= amount
                wallet.save()

                # B. Create Withdrawal Record with the ID
                WithdrawalRequest.objects.create(
                    wallet=wallet,
                    amount=amount,
                    reference=my_reference,
                    status='pending',
                    flw_transfer_id=flw_id  # Use the ID we just got
                )

                # C. Create Transaction Record
                Transaction.objects.create(
                    wallet=wallet,
                    amount=amount,
                    tx_type='payout',
                    tx_ref=my_reference,
                    status='pending'
                )

            return Response({
                "message": "Transfer initiated. Webhook will trigger in 60s.", 
                "ref": my_reference,
                "flw_id": flw_id
            })

        except IntegrityError:
            return Response({"error": "Duplicate reference. Try a new request ID."}, status=400)
        except ValueError as e:
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            return Response({"error": f"Something went wrong: {str(e)}"}, status=400)
        
   
class TransferWebhookView(APIView):
    permission_classes = [AllowAny] # Flutterwave calls this, not a user

    def post(self, request):
        # 1. Verify Secret Hash (Security)
        secret_hash = settings.FLW_SECRET_HASH
        if request.headers.get('verif-hash') != secret_hash:
            return Response(status=401)

        data = request.data
        # 2. Look for the reference WE generated (e.g., WD-abc-123)
        reference = data["transfer"].get("reference")
        
        # 3. Find the matching records in your DB
        withdrawal = WithdrawalRequest.objects.filter(reference=reference).first()
        transaction_record = Transaction.objects.filter(tx_ref=reference).first()

        if not withdrawal:
            return Response(status=200) # Stop here if not our transaction

        # 4. Handle Success
        if data["transfer"].get("status") == 'SUCCESSFUL':
            withdrawal.status = 'successful'
            transaction_record.status = 'completed'
            withdrawal.save()
            transaction_record.save()
            # The Barber now sees "Completed" in the app

        # 5. Handle Failure (CRITICAL)
        elif data["transfer"].get("status") == 'FAILED':
            with transaction.atomic():
                withdrawal.status = 'failed'
                transaction_record.status = 'failed'
                withdrawal.save()
                transaction_record.save()

                # REFUND: Since the bank transfer failed, 
                # give the money back to the vendor's wallet
                wallet = withdrawal.wallet
                wallet.available_balance += withdrawal.amount
                wallet.save()

        return Response(status=200)



class WalletAPIView(RetrieveAPIView):
    """
    Shows Balance and History for logged-in user
    """
    permission_classes = [IsWalletOrTransactionObjOwner]
    serializer_class = WalletSerializer

    def get_object(self): 
        get_object_or_404(Wallet, user=self.request.user)
  
    
class TransactionViewSet(ReadOnlyModelViewSet):
    """
    Simple Transaction History for the users wallet
    """
    permission_classes = [IsTransactionOwner, IsWalletOrTransactionObjOwner]
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(wallet__user=self.request.user).order_by('-created_at')

class PaymentVerificationView(GenericAPIView):
    """
    sends a status to frontend if transaction is succesful from flutterwave
    takes transaction id from user as path parameter
    returns transacrion status
    """
    serializer_class = VerifyPaymentSerializer
    def get(self, request):
        serializer = self.get_serializer(request.data)
        serializer.is_valid(raise_exception=True)
        transaction_id = serializer.validated_data["transaction_id"]
        verify_transaction = FlutterwaveService.verify_transaction(transaction_id)
        return Response(verify_transaction, status=status.HTTP_200_OK)

        
