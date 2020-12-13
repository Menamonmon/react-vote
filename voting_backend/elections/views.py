from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from .models import Election
from .serializers import ElectionSerializer

class ElectionsView(generics.ListAPIView):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    permissions_classes = (IsAuthenticated,)

    def get_queryset(self):
        matching_user = self.request.user
        state = matching_user.state
        elections_qs = Election.objects.filter(state__in=(state, 'US'))
        return elections_qs

    def list(self, request):
        qs = self.get_queryset()
        if not qs.exists():
            return Response('Election Not Found', status=status.HTTP_404_NOT_FOUND)

        serializer = ElectionSerializer(qs, many=True)
        return Response(serializer.data)



ElectionAdminPermission = DjangoModelPermissions
ElectionAdminPermission.perms_map = {
    'POST': 'users.election_admin'
}

class CreateElectionView(generics.CreateAPIView):
    serializer_class = ElectionSerializer
    permission_classes = [IsAuthenticated, ElectionAdminPermission,]
    queryset = Election.objects.none()

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            # Checks if this election already exists
            try:
                election = Election.objects.get(**serializer.validated_data)
            except Election.DoesNotExist:
                serializer.save()
                return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
            
            return Response({'election': f'The election ({str(election)}) already exists'}, status=status.HTTP_208_ALREADY_REPORTED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
