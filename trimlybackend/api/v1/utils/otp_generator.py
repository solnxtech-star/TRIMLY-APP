def send_otp_email(email, code):
        from django.core.mail import send_mail
        from django.conf import settings
        
        send_mail(
            'Verify Your Email',
            f'Your verification code is: {code}\nThis code expires in 5 minutes.',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )