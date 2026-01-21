import uuid
import requests
from django.conf import settings

class FlutterwaveService:
    BASE_URL = "https://api.flutterwave.com/v3"
    HEADERS = {
        "Authorization": f"Bearer {settings.FLW_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    @staticmethod
    def create_subaccount(data):
        """
        Creates a collection subaccount.
        In a manual system, we set split_value to 0 so no money 
        is sent to them automatically during payment.
        """
        url = f"{FlutterwaveService.BASE_URL}/subaccounts"
        payload = {
            "account_bank": str(data['account_bank']),
            "account_number": str(data['account_number']),
            "business_name": str(data['business_name']),
            "business_email": str(data['business_email']),
            "business_mobile": str(data['business_mobile']),
            "country": "NGN",
            "split_type": "percentage",
            "split_value": 0  # 0% because we handle the 90/10 split in our DB
        }
        response = requests.post(url, json=payload, headers=FlutterwaveService.HEADERS)
        return response.json()

    @staticmethod
    def initialize_payment(booking, vendor_user_id, amount):
        """
        Generates a Flutterwave hosted payment link.
        """
        url = f"{FlutterwaveService.BASE_URL}/payments"

        # Unique reference for this payment attempt
        tx_ref = f"TRM-{booking.id}"
        
        payload = {
            "tx_ref": str(tx_ref),
            "amount": float(amount),
            "currency": "NGN",
            
            "redirect_url": "https://interconfessional-erna-unheaded.ngrok-free.dev/", # Where the user goes after paying
            "customer": {
                "email": booking.customer.email,
                "name": f"{booking.customer.first_name} {booking.customer.last_name}",
            },
            "meta": {
                "vendor_id": str(vendor_user_id),
                "booking_id": str(booking.id)
            },
            "customizations": {
                "title": "Trimly Checkout",
                "description": "Payment for beauty/grooming service",
                "logo": "https://trimly.app/static/logo.png"
            }
        }
        
        response = requests.post(url, json=payload, headers=FlutterwaveService.HEADERS)
        return response.json()
    
    @staticmethod
    def initiate_transfer(account_bank, account_number, amount, reference):
        """
        Generates a Flutterwave hosted payment link.
        """
        url = f"{FlutterwaveService.BASE_URL}/transfers"
        headers = {
            "Authorization": f"Bearer {settings.FLW_SECRET_KEY}",
            "Content-Type": "application/json",
            "X-Scenario-Key": "scenario:successful"
        }
        

        payload = {
            "account_bank": account_bank,
            "account_number": account_number,
            "amount": float(amount),
            "currency": "NGN",
            "reference" : reference,
            "callback_url" : "https://interconfessional-erna-unheaded.ngrok-free.dev/api/v1/payments/transfer-webhook/"
            
        }
        
        response = requests.post(url, json=payload, headers=headers)
        return response.json()
    
    @staticmethod
    def verify_transaction(transaction_id):
        url = f"{FlutterwaveService.BASE_URL}/transactions/{transaction_id}/verify"
        response = requests.get(url, headers=FlutterwaveService.HEADERS)
        return response.json()