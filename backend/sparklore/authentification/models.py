from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import random
from django.db.models import Count

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=False, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class OTPCode(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timezone.timedelta(minutes=5)

    @staticmethod
    def can_send_otp(email):
        now = timezone.now()
        one_minute_ago = now - timezone.timedelta(minutes=1)
        recent = OTPCode.objects.filter(email=email, created_at__gte=one_minute_ago)
        return not recent.exists()

    @staticmethod
    def too_many_requests(email):
        now = timezone.now()
        ten_minutes_ago = now - timezone.timedelta(minutes=10)
        return OTPCode.objects.filter(email=email, created_at__gte=ten_minutes_ago).count() >= 3

    @staticmethod
    def generate_otp():
        return str(random.randint(1000, 9999))