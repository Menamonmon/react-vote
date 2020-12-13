from rest_framework import serializers
from .models import Election, Candidate


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ('id', 'name', 'party', 'vote_count')

class ElectionSerializer(serializers.ModelSerializer):
    candidate_set = CandidateSerializer(many=True, read_only=True)

    class Meta:
        model = Election
        fields = ('id', '_type', 'year', 'state', 'created_at', 'candidate_set')
