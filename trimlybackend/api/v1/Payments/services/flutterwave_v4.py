import requests
from django.conf import settings
from django.core.cache import cache

TOKEN_CACHE_KEY = "flw_v4_access_token"


class FlutterwaveV4Service:
    """
    v4 uses OAuth2 client_credentials instead of a static secret key.
    Token is cached (via Django's cache framework) so we're not re-authenticating
    on every single request — v4 access tokens are short-lived.
    """

    # NOTE: confirm this against Flutterwave's v4 docs for your exact environment —
    # sandbox vs production may use different token hosts.
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
        expires_in = payload.get("expires_in", 300)
        # refresh 30s before actual expiry to avoid edge-of-window failures
        cache.set(TOKEN_CACHE_KEY, access_token, timeout=max(expires_in - 30, 30))
        return access_token

    @classmethod
    def _headers(cls):
        return {
            "Authorization": f"Bearer {cls._get_access_token()}",
            "Content-Type": "application/json",
        }

    @classmethod
    def initiate_transfer(cls, account_bank, account_number, amount, reference):
        """
        Returns a v3-shaped response so calling code (RequestWithdrawalView)
        doesn't need to change: {"status": "success"/"error", "data": {...}, "message": ...}
        """
        url = f"{cls.BASE_URL}/direct-transfers"

        # NOTE: confirm exact required field names for this payload via
        # Flutterwave's v4 "Try It" panel on the direct-transfers doc page —
        # v4 payloads don't always mirror v3's field names 1:1.
        payload = {
            "account_bank": account_bank,
            "account_number": account_number,
            "amount": float(amount),
            "currency": "NGN",
            "reference": reference,
        }

        try:
            response = requests.post(url, json=payload, headers=cls._headers(), timeout=20)
            data = response.json()
        except requests.exceptions.RequestException as e:
            return {"status": "error", "message": f"Network error: {str(e)}", "data": None}

        return cls._normalize_response(response.status_code, data)

    @staticmethod
    def _normalize_response(status_code, data):
        if status_code in (200, 201) and data.get("status") in ("success", "successful"):
            return {
                "status": "success",
                "message": data.get("message", "Transfer initiated"),
                "data": data.get("data", {}),
            }
        return {
            "status": "error",
            "message": data.get("message") or data.get("error", {}).get("message", "Transfer failed"),
            "data": None,
        }