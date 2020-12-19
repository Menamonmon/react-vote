from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import CustomUser, Vote, USER_STATE_CHOICES
from .serializers import CustomUserSerializer, VoteSerializer


class CustomUsersView(generics.ListAPIView):
    model = CustomUser
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        if 'username' in self.kwargs:
            username = self.kwargs['username']
            user = CustomUser.objects.filter(username=username)
            return user

        else:
            return CustomUser.objects.all()

class VotesListView(generics.ListAPIView):
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


class StateChoicesList(generics.ListAPIView):
    permission_classes = [AllowAny,]

    def list(self, request):
        data = USER_STATE_CHOICES
        return Response(data)