import uuid
import requests
from django.conf import settings
from django.core.cache import cache

TOKEN_CACHE_KEY = "flw_v4_access_token"


class FlutterwaveV4Service:
    """
    v4 uses OAuth2 client_credentials (10-minute tokens) and a two-step
    transfer: create a recipient, then reference its id in the transfer.
    Confirmed working against sandbox as of your last test.
    """

    TOKEN_URL = "https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token"
    BASE_URL = "https://developersandbox-api.flutterwave.com" if settings.DEBUG else settings.FLW_V4_LIVE_BASE_URL

    CLIENT_ID = settings.FLW_V4_CLIENT_ID
    CLIENT_SECRET = settings.FLW_V4_CLIENT_SECRET

    @classmethod
    def _get_access_token(cls):
        cached = cache.get(TOKEN_CACHE_KEY)
        if cached:
            return cached

        resp = requests.post(
            cls.TOKEN_URL,
            data={
                "client_id": cls.CLIENT_ID,
                "client_secret": cls.CLIENT_SECRET,
                "grant_type": "client_credentials",
            },
            timeout=15,
        )
        resp.raise_for_status()
        payload = resp.json()

        access_token = payload["access_token"]
        expires_in = payload.get("expires_in", 600)
        cache.set(TOKEN_CACHE_KEY, access_token, timeout=max(expires_in - 30, 30))
        return access_token

    @classmethod
    def _headers(cls, extra=None):
        headers = {
            "Authorization": f"Bearer {cls._get_access_token()}",
            "Content-Type": "application/json",
            "X-Trace-Id": str(uuid.uuid4()),
        }
        if extra:
            headers.update(extra)
        return headers

    @classmethod
    def _create_recipient(cls, account_bank, account_number):
        url = f"{cls.BASE_URL}/transfers/recipients"
        payload = {
            "type": "bank_ngn",
            "bank": {
                "account_number": account_number,
                "code": account_bank,
            }
        }
        headers = cls._headers({"X-Idempotency-Key": str(uuid.uuid4())})
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        data = response.json()

        print(f"--- [FLW V4 RECIPIENT RAW RESPONSE] status={response.status_code} body={data} ---")

        if response.status_code == 409:
            # Recipient already exists — look it up instead of failing
            return cls._find_existing_recipient(account_bank, account_number)

        if response.status_code not in (200, 201) or data.get("status") != "success":
            raise ValueError(data.get("message", "Failed to create transfer recipient"))
        return data["data"]["id"]

    @classmethod
    def _find_existing_recipient(cls, account_bank, account_number):
        url = f"{cls.BASE_URL}/transfers/recipients"
        headers = cls._headers()
        response = requests.get(url, headers=headers, timeout=15)
        data = response.json()

        print(f"--- [FLW V4 RECIPIENT LOOKUP] status={response.status_code} body={data} ---")

        if response.status_code == 200 and data.get("status") == "success":
            for r in data.get("data", {}).get("recipients", []):
                bank = r.get("bank", {})
                if bank.get("account_number") == account_number and bank.get("code") == account_bank:
                    return r["id"]

        raise ValueError("Recipient exists but could not be located via lookup.")

    @classmethod
    def initiate_transfer(cls, account_bank, account_number, amount, reference):
        try:
            recipient_id = cls._create_recipient(account_bank, account_number)

            url = f"{cls.BASE_URL}/transfers"
            payload = {
                "action": "instant",
                "reference": reference,
                "narration": "Trimly vendor withdrawal",
                "payment_instruction": {
                    "source_currency": "NGN",
                    "destination_currency": "NGN",
                    "amount": {
                        "applies_to": "destination_currency",
                        "value": float(amount),
                    },
                    "recipient_id": recipient_id,
                }
            }

            extra_headers = {"X-Idempotency-Key": str(uuid.uuid4())}
            if settings.DEBUG:
                extra_headers["X-Scenario-Key"] = "scenario:successful"

            response = requests.post(url, json=payload, headers=cls._headers(extra_headers), timeout=20)
            data = response.json()

            # TEMP DEBUG — remove once resolved
            print(f"--- [FLW V4 TRANSFER RESPONSE] status={response.status_code} body={data} ---")

        except requests.exceptions.RequestException as e:
            return {"status": "error", "message": f"Network error: {str(e)}", "data": None}
        except ValueError as e:
            # This catches _create_recipient failures too — log it
            print(f"--- [FLW V4 RECIPIENT ERROR] {str(e)} ---")
            return {"status": "error", "message": str(e), "data": None}

        return cls._normalize_response(response.status_code, data)

    @staticmethod
    def _normalize_response(status_code, data):
        if status_code in (200, 201) and data.get("status") == "success":
            return {
                "status": "success",
                "message": data.get("message", "Transfer initiated"),
                "data": data.get("data", {}),
            }
        return {
            "status": "error",
            "message": data.get("message", "Transfer failed"),
            "data": None,
        }