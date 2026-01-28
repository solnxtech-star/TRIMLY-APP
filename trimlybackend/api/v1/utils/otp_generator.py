def send_otp_email(user, code):
        from django.core.mail import send_mail
        
        send_mail(
            'Verify Your Email',
            f'Your verification code is: {code}\nThis code expires in 5 minutes.',
            'noreply@trimly.com',
            [user.email],
            fail_silently=False,
        )