from django.db import models
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser

from rest_framework.authtoken.models import Token

from elections.models import STATE_CHOICES

USER_STATE_CHOICES = STATE_CHOICES[1:]

class CustomUser(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    state = models.CharField(max_length=2, default='US',
                             choices=USER_STATE_CHOICES)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['state']

    class Meta:
        permissions = (
            ('election_admin', 'Can Edit, Remove, and Add Elections'),
        )

    def __str__(self):
        return self.username


# A reviever that would automatically generate a token when a user is created
@receiver(models.signals.post_save, sender=CustomUser)
def create_user_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
