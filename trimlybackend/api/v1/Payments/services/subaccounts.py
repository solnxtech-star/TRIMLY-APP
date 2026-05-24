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
            
            "redirect_url": "https://trimly.africa/", # Where the user goes after paying
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
                "description": f"Payment for {booking.get_vendor_service_name}",
                "logo": "https://trimly.app/static/logo.png"
            }
        }
        
        response = requests.post(url, json=payload, headers=FlutterwaveService.HEADERS)
        return response.json()
    
    @staticmethod
    def initiate_transfer(account_bank, account_number, amount, reference):
        """
        Transfers to vendor bank account.
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
    
    @staticmethod
    def verify_bank_account(account_number, bank_code):
        """
        Calls Flutterwave to verify the account number matches the bank code.
        Returns the resolved account name if valid.
        """
        url = f"{FlutterwaveService.BASE_URL}/accounts/resolve"
        headers = {
            "Authorization": f"Bearer {settings.FLW_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "account_number": account_number,
            "account_bank": bank_code
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=15)
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"status": "error", "message": f"Network error: {str(e)}"}
    
    @staticmethod
    def get_all_nigerian_banks():
        """
        IRL Step: Frontend calls this to populate the dropdown menu.
        Fetches the complete list of banks in Nigeria with their official codes.
        """
        url = "https://api.flutterwave.com/v3/banks/NG"
        headers = {
            "Authorization": f"Bearer {settings.FLW_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        try:
            response = requests.get(url, headers=headers, timeout=10)
            return response.json() # Returns a list of dicts: {"id": 1, "code": "058", "name": "GTBank"}
        except requests.exceptions.RequestException as e:
            return {"status": "error", "message": str(e)}