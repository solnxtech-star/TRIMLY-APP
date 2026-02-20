# core/email_backend.py
from anymail.backends.resend import EmailBackend
from django.conf import settings
import re

class SandboxEmailBackend(EmailBackend):
    
    def _rewrite_recipient(self, address):
        base = settings.DEV_EMAIL_REDIRECT
        if not base:
            return address
        
        # Handle if address is a User object instead of a string
        if hasattr(address, 'email'):
            address = address.email

        # Resend sandbox only accepts the exact registered email
        # no plus aliases in sandbox mode
        return base

    def send_messages(self, email_messages):
        for message in email_messages:
            message.to = [self._rewrite_recipient(addr) for addr in message.to]
            message.cc = [self._rewrite_recipient(addr) for addr in message.cc]
            message.bcc = [self._rewrite_recipient(addr) for addr in message.bcc]
        
        return super().send_messages(email_messages)