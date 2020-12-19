from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

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

# A vote Model that would represent a peron's vote
# It has a user_id that would point to the user who cast this vote
# It also has a candidate_id which would point to the candidate to which this vote was cast

class Vote(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, editable=False)
    candidate = models.ForeignKey('elections.Candidate', on_delete=models.CASCADE, editable=False)
    election = models.ForeignKey('elections.Election', on_delete=models.CASCADE, editable=False)

    def clean(self):
        errors = {}
        if not self.election.candidate_set.filter(id=self.candidate.id).exists():
            errors['candidate'] = f'The candidate {self.candidate.name} is not part of the election, {str(self.election)}'

        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return f'Vote by {self.user.username} to {self.candidate.name}'


# A reviever that would automatically generate a token when a user is created
@receiver(post_save, sender=CustomUser)
def create_user_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
