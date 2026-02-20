# users/adapters.py
from allauth.account.adapter import DefaultAccountAdapter

class NoEmailAdapter(DefaultAccountAdapter):
    def send_confirmation_mail(self, request, emailconfirmation, signup):
        # Do nothing - we handle verification via our own OTP system
        pass
    
    def send_mail(self, template_prefix, email, context):
        # Block all allauth emails
        pass
