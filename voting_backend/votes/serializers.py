from rest_framework import serializers

from .models import Vote

from users.serializers import CustomUserSerializer
from elections.serializers import ElectionSerializerWithoutCandidates, CandidateSerializer

class ListVoteSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    election = ElectionSerializerWithoutCandidates(read_only=True)
    candidate = CandidateSerializer(read_only=True)

    class Meta:
        model = Vote
        fields = ('user', 'election', 'candidate')

class CreateVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ('user', 'election', 'candidate')

    def create(self, validated_data):
        vote = self.Meta.model.objects.create(**validated_data)
        return vote