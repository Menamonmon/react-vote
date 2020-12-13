from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.translation import pgettext_lazy
from django.core.exceptions import ValidationError

STATE_CHOICES = (
    ('US', _('United States')),
    ('AL', _('Alabama')),
    ('AZ', _('Arizona')),
    ('AR', _('Arkansas')),
    ('CA', _('California')),
    ('CO', _('Colorado')),
    ('CT', _('Connecticut')),
    ('DE', _('Delaware')),
    ('DC', _('District of Columbia')),
    ('FL', _('Florida')),
    ('GA', pgettext_lazy('US state', 'Georgia')),
    ('ID', _('Idaho')),
    ('IL', _('Illinois')),
    ('IN', _('Indiana')),
    ('IA', _('Iowa')),
    ('KS', _('Kansas')),
    ('KY', _('Kentucky')),
    ('LA', _('Louisiana')),
    ('ME', _('Maine')),
    ('MD', _('Maryland')),
    ('MA', _('Massachusetts')),
    ('MI', _('Michigan')),
    ('MN', _('Minnesota')),
    ('MS', _('Mississippi')),
    ('MO', _('Missouri')),
    ('MT', _('Montana')),
    ('NE', _('Nebraska')),
    ('NV', _('Nevada')),
    ('NH', _('New Hampshire')),
    ('NJ', _('New Jersey')),
    ('NM', _('New Mexico')),
    ('NY', _('New York')),
    ('NC', _('North Carolina')),
    ('ND', _('North Dakota')),
    ('OH', _('Ohio')),
    ('OK', _('Oklahoma')),
    ('OR', _('Oregon')),
    ('PA', _('Pennsylvania')),
    ('RI', _('Rhode Island')),
    ('SC', _('South Carolina')),
    ('SD', _('South Dakota')),
    ('TN', _('Tennessee')),
    ('TX', _('Texas')),
    ('UT', _('Utah')),
    ('VT', _('Vermont')),
    ('VA', _('Virginia')),
    ('WA', _('Washington')),
    ('WV', _('West Virginia')),
    ('WI', _('Wisconsin')),
    ('WY', _('Wyoming')),
)


# Model to represent Election Data
class Election(models.Model):
    _type = models.CharField(max_length=100)
    year = models.IntegerField(null=False, default=0)
    state = models.CharField(max_length=2, default='US', choices=STATE_CHOICES)
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    def winner(self):
        return self.candidate_set.all().order_by('vote_count').reverse()[0]

    def __str__(self):
        return f'{self._type} Election' if self.state == 'US' else f'{self._type} Election ({self.state})'


# Model to represent candidates' data and the election in which they are participating
class Candidate(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, unique=True)
    party = models.CharField(max_length=50)
    vote_count = models.IntegerField(null=False, default=0)

    def add_vote(self):
        self.vote_count += 1

    def remove_vote(self):
        self.vote_count -= 1

    def __str__(self):
        return f'{self.name} ({self.party})'
