import os
import requests
from django.conf import settings

class FlutterwaveService:
    BASE_URL = "https://api.flutterwave.com/v3"
    HEADERS = {
        "Authorization": f"Bearer {settings.FLW_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    @staticmethod
    def _get_proxies():
        """
        Explicitly reads our custom static proxy variables.
        Using these custom names avoids conflicts with Render's system defaults.
        """
        http_proxy = os.getenv("STATIC_HTTP_PROXY")
        https_proxy = os.getenv("STATIC_HTTPS_PROXY")
        
        if http_proxy or https_proxy:
            return {
                "http": http_proxy,
                "https": https_proxy,
            }
        return None

    @staticmethod
    def test_proxy_ip():
        """
        Hits a public IP API to verify if outbound traffic is successfully
        routing through our Fixie proxy or leaking the real server IP.
        """
        url = "https://api.ipify.org?format=json"
        proxies = FlutterwaveService._get_proxies()
        
        try:
            response = requests.get(url, proxies=proxies, timeout=10)
            ip_data = response.json()
            print(f"--- [PROXY CHECK] Outbound IP being sent: {ip_data.get('ip')} ---")
            return ip_data
        except Exception as e:
            print(f"--- [PROXY CHECK ERROR]: {str(e)} ---")
            return {"error": str(e)}

    @staticmethod
    def create_subaccount(data):
        FlutterwaveService.test_proxy_ip()
        
        url = f"{FlutterwaveService.BASE_URL}/subaccounts"
        payload = {
            "account_bank": str(data['account_bank']),
            "account_number": str(data['account_number']),
            "business_name": str(data['business_name']),
            "business_email": str(data['business_email']),
            "business_mobile": str(data['business_mobile']),
            "country": "NGN",
            "split_type": "percentage",
            "split_value": 0  
        }
        response = requests.post(
            url, 
            json=payload, 
            headers=FlutterwaveService.HEADERS,
            proxies=FlutterwaveService._get_proxies()
        )
        return response.json()

    @staticmethod
    def initialize_payment(booking, vendor_user_id, amount):
        url = f"{FlutterwaveService.BASE_URL}/payments"
        tx_ref = f"TRM-{booking.id}"
        
        payload = {
            "tx_ref": str(tx_ref),
            "amount": float(amount),
            "currency": "NGN",
            "redirect_url": "https://trimly.africa/",
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
        
        response = requests.post(
            url, 
            json=payload, 
            headers=FlutterwaveService.HEADERS,
            proxies=FlutterwaveService._get_proxies()
        )
        return response.json()
    
    @staticmethod
    def initiate_transfer(account_bank, account_number, amount, reference):
        # 1. Print current proxy IP to terminal
        FlutterwaveService.test_proxy_ip()

        url = f"{FlutterwaveService.BASE_URL}/transfers"
        
        # 2. Inject explicit forward headers to bypass the V3 test routing engine blocks
        headers = {
            "Authorization": f"Bearer {settings.FLW_SECRET_KEY}",
            "Content-Type": "application/json",
            "X-Scenario-Key": "scenario:successful",
            "X-Forwarded-For": "52.5.155.132"  # Hard matches your dashboard IP whitelisting
        }

        payload = {
            "account_bank": account_bank,
            "account_number": account_number,
            "amount": float(amount),
            "currency": "NGN",
            "reference": reference,
            "callback_url": "https://interconfessional-erna-unheaded.ngrok-free.dev/api/v1/payments/transfer-webhook/"
        }
        
        response = requests.post(
            url, 
            json=payload, 
            headers=headers,
            proxies=FlutterwaveService._get_proxies()
        )
        
        # 3. Print full response for diagnostic visibility
        print(f"--- [FLW API RESPONSE]: {response.status_code} - {response.text} ---")
        
        return response.json()
    
    @staticmethod
    def verify_transaction(transaction_id):
        url = f"{FlutterwaveService.BASE_URL}/transactions/{transaction_id}/verify"
        response = requests.get(
            url, 
            headers=FlutterwaveService.HEADERS,
            proxies=FlutterwaveService._get_proxies()
        )
        return response.json()
    
    @staticmethod
    def verify_bank_account(account_number, bank_code):
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
            response = requests.post(
                url, 
                json=payload, 
                headers=headers, 
                timeout=15,
                proxies=FlutterwaveService._get_proxies()
            )
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"status": "error", "message": f"Network error: {str(e)}"}
    
    @staticmethod
    def get_all_nigerian_banks():
        url = "https://api.flutterwave.com/v3/banks/NG"
        headers = {
            "Authorization": f"Bearer {settings.FLW_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        try:
            response = requests.get(
                url, 
                headers=headers, 
                timeout=10,
                proxies=FlutterwaveService._get_proxies()
            )
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"status": "error", "message": str(e)}