from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import CustomUser, USER_STATE_CHOICES
from .serializers import CustomUserSerializer


class CustomUsersView(ListAPIView):
    model = CustomUser
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        if 'username' in self.kwargs:
            username = self.kwargs['username']
            user = CustomUser.objects.filter(username=username)
            return user

        else:
            return CustomUser.objects.all()

class StateChoicesListView(ListAPIView):
    permission_classes = [AllowAny,]

    def list(self, request):
        data = USER_STATE_CHOICES
        return Response(data)