from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import obtain_auth_token as login_view

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


class LogoutView(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request, format=None):
        # Delete token
        # Generate a new one
        # attach the new one to the user

        token_key = request.get('Authorization').replace('Token ', '')
        token = Token.objects.get(key=token_key)
        user = token.user
        token.delete()
        Token.objects.create(user=user)

        return Response({ 'details': f'{str(user)} is logged out successfully.' }, status=status.HTTP_200_OK)
