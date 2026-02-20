def send_otp_email(email, code):
        from django.core.mail import send_mail
        
        send_mail(
            'Verify Your Email',
            f'Your verification code is: {code}\nThis code expires in 5 minutes.',
            'onboarding@resend.dev',
            [email],
            fail_silently=False,
        )