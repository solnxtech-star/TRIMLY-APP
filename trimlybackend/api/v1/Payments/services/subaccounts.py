import os
import requests
from django.conf import settings

import os
import requests
from django.conf import settings  # or your framework's settings import

class FlutterwaveService:
    BASE_URL = "https://developersandbox-api.flutterwave.com/v3" if settings.DEBUG else "https://api.flutterwave.com/v3"


    HEADERS = {
        "Authorization": f"Bearer {settings.FLW_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    @staticmethod
    def _get_proxies():
        """
        Explicitly reads our custom static proxy variables.
        Fixie requires HTTPS traffic to be mapped to the standard http:// protocol string 
        to ensure Python's requests library tunnels the SSL handshake correctly.
        """
        # Read the raw proxy string (e.g., http://usefixie.com)
        # Use the exact same HTTP URL for both keys. Do NOT use an https:// prefix for the proxy.
        proxy_url = os.getenv("STATIC_HTTP_PROXY") or os.getenv("FIXIE_URL")
        
        if proxy_url:
            return {
                "http": proxy_url,
                "https": proxy_url, # MUST use the http:// formatted proxy URL here too
            }
        return None

    @staticmethod
    def test_proxy_ip():
        """
        Hits a public IP API to verify if outbound traffic is successfully routing through our Fixie proxy.
        """
        url = "https://api.ipify.org?format=json"
        proxies = FlutterwaveService._get_proxies()
        try:
            response = requests.get(url, proxies=proxies, timeout=10)
            ip_data = response.json()
            print(f"--- [PROXY CHECK] Outbound IP being sent: {ip_data.get('ip')} ---")
            return ip_data.get('ip')
        except Exception as e:
            print(f"--- [PROXY CHECK ERROR]: {str(e)} ---")
            return None

    # ... keeping create_subaccount and initialize_payment the same ...

    @staticmethod
    def initiate_transfer(account_bank, account_number, amount, reference):
        # 1. Run the test and get the EXACT IP Fixie is outputting right now
        fixie_ip = FlutterwaveService.test_proxy_ip()
        
        url = f"{FlutterwaveService.BASE_URL}/transfers"
        
        # 2. Re-build the header securely. Remove the hardcoded 52.5.155.132 IP.
        headers = {
            "Authorization": f"Bearer {settings.FLW_SECRET_KEY}",
            "Content-Type": "application/json",
        }
        
        # If testing in sandbox, you can leave the scenario key, but drop X-Forwarded-For
        if "sandbox" in settings.FLW_SECRET_KEY or settings.DEBUG:
            headers["X-Scenario-Key"] = "scenario:successful"

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
        
        print(f"--- [FLW API RESPONSE]: {response.status_code} - {response.text} ---")
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
        url = "{FlutterwaveService.BASE_URL}/banks/NG"
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