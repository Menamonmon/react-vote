from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from .serializers import VoteSerializer
from .models import Vote
from elections.models import Candidate, Election
from users.models import CustomUser

class VotesListView(ListAPIView):
    model = Vote
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        user = self.request.user
        qs = Vote.objects.filter(user=user)
        return qs

    def list(self, request):
        qs = self.get_queryset()
        serializer = VoteSerializer(qs, many=True)
        return Response(serializer.data)

class SubmitVoteView(CreateAPIView):
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated,]

    def post(self, request, format=None):
        token_str = request.headers.get('Authorization', '').replace('Token ', '')
        user_id = Token.objects.get(key=token_str).user.id
        election_id = request.data.election_id
        candidate_id = request.data.candidate_id
        data = {
            "user": CustomUser.objects.get(id=user_id),
            "candidate": Candidate.objects.get(id=candidate_id),
            "election": Election.objects.get(id=election_id),
        }

        serializer = self.serializer_class(data=data)