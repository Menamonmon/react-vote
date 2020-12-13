from rest_framework import generics
from .models import CustomUser, Vote
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
