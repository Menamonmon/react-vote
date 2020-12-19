from django.db import models
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver


# A vote Model that would represent a peron's vote
# It has a user_id that would point to the user who cast this vote
# It also has a candidate_id which would point to the candidate to which this vote was cast

class Vote(models.Model):
    user = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE)
    candidate = models.ForeignKey('elections.Candidate', on_delete=models.CASCADE)
    election = models.ForeignKey('elections.Election', on_delete=models.CASCADE)

    def clean(self):
        errors = {}
        if not self.election.candidate_set.filter(id=self.candidate.id).exists():
            errors['candidate'] = f'The candidate {self.candidate.name} is not part of the election, {str(self.election)}'

        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return f'Vote by {self.user.username} to {self.candidate.name}'


@receiver(post_save, sender=Vote)
def create_vote_signal(sender, instance, created, **kwargs):
    if created:
        print("Create Method Called")
        instance.candidate.add_vote()

@receiver(pre_save, sender=Vote)
def update_vote_signal(sender, instance, **kwargs):
    if instance.id is None:
        print("Update Method Called")
    else: 
        previous = Vote.objects.get(id=instance.id)
        if previous.candidate != instance.candidate:
            previous.candidate.remove_vote()
            instance.candidate.add_vote()

@receiver(post_delete, sender=Vote)
def delete_vote_signal(sender, instance, **kwargs):
    instance.candidate.remove_vote()