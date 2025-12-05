from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        
        email = self.normalize_email(email)
        
        # --- CRITICAL FIX ---
        # 1. Automatically populate the inherited 'username' field with the email.
        # This keeps the username field unique and satisfied without user input.
        extra_fields['username'] = email 
        # --------------------

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # The CustomManager signature now correctly expects email first.
        # This method uses create_user, which handles the username auto-population.
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin') # Set the default superuser role
        
        return self.create_user(email, password, **extra_fields)