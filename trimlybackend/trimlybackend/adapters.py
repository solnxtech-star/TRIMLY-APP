import threading
from allauth.account.adapter import DefaultAccountAdapter

class BackgroundEmailAdapter(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context):
        """
        Overriding the default send_mail to run in a background thread.
        This prevents Render from timing out while waiting for SMTP.
        """
        # 1. Render the email content (fast)
        msg = self.render_mail(template_prefix, email, context)
        
        # 2. Start the actual sending in a separate thread (slow part)
        # This returns control to your Django view immediately!
        threading.Thread(target=msg.send).start()