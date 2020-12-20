from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token

from .serializers import ListVoteSerializer, CreateVoteSerializer
from .models import Vote

from elections.models import Candidate, Election
from users.models import CustomUser


class VotesListView(ListAPIView):
    model = Vote
    serializer_class = ListVoteSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        user = self.request.user
        qs = Vote.objects.filter(user=user)
        return qs

    def list(self, request):
        qs = self.get_queryset()
        serializer = self.serializer_class(qs, many=True)
        return Response(serializer.data)


class SubmitVoteView(CreateAPIView):
    serializer_class = CreateVoteSerializer
    permission_classes = [IsAuthenticated,]

    def post(self, request, format=None):
        '''
        Request Shape: 
        {
            election_id: int,
            candidate_id: int,
        }
        '''
        user = request.user

        election_id = int(request.data.get('election_id'))
        candidate_id = int(request.data.get('candidate_id'))

        # Checking that the id's correspond with actual data
        data_not_found = False
        try:
            election = Election.objects.get(id=election_id)
            candidate = Candidate.objects.get(id=candidate_id)
        except (Election.DoesNotExist, Candidate.DoesNotExist) as e:
            data_not_found = True

        # Checking that election is valid for user and that the candidate is part of the election
        if data_not_found or election.state not in (user.state, 'US') or candidate not in election.candidate_set.all():
            return Response({ 'details': 'invalid eleciton id / candidate id' }, status=status.HTTP_409_CONFLICT)

        # If the vote already exists by this user for this election then edit the vote instead of creating a new one
        matching_votes = Vote.objects.filter(user=user, election=election)
        if matching_votes.exists():
            assert matching_votes.count() == 1

            prev_vote = matching_votes[0]
            prev_vote.candidate = candidate
            prev_vote.save()
            return Response({ 'details': ['vote edited successfully'] }, status=status.HTTP_200_OK)

        serializer = self.serializer_class(
            data={
                'election':election.pk,
                'candidate':candidate.pk,
                'user':user.pk,
            }
        )

        serializer.is_valid(raise_exception=True)

        vote = serializer.save()

        return Response({ 'details': 'vote submitted successfully', 'user_id': user_id, 'candidate_id': candidate_id, 'election_id': election_id }, status=status.HTTP_201_CREATED)


class DeleteVoteView(APIView):
    permission_classes = [IsAuthenticated,]
    
    def delete(self, request, form=None):
        vote_id = request.data.get('vote_id')
        vote = Vote.objects.get(id=vote_id)

        # if vote.user.id != 
        return