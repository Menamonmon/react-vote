from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .serializers import RegistrationSerializer
from users.models import CustomUser


class RegisterView(APIView):
    serializer_class = RegistrationSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        data = {}
        if serializer.is_valid():
            username = serializer.data.get('username')
            # Checking if the user already exists
            queryset = CustomUser.objects.filter(username=username)
            if queryset.exists():
                return Response({'username': f'The user {username} already exists'}, status=status.HTTP_208_ALREADY_REPORTED)

            else:
                user = serializer.save()
                data['response'] = 'new user created successfully'
                data['username'] = user.username
                data['state'] = user.state
                token = Token.objects.get(user=user).key
                data['token'] = token
                return Response(data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
