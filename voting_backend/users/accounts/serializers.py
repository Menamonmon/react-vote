from rest_framework import serializers
from users.models import CustomUser

class RegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'state', 'password', 'confirm_password')
        extra_kwargs = {
            'password': {'write_only': True},
            'confirm_password': {'write_only': True}
        }

    def save(self, *args, **kwargs):
        state = self.validated_data['state']
        custom_user = CustomUser(
                        username=self.validated_data['username'],
                        state=state,
            )
        password = self.validated_data['password']
        confirm_password = self.validated_data['confirm_password']

        if password != confirm_password:
            raise serializers.ValidationError({'password': 'Passwords Must Match'})
        custom_user.set_password(password)
        custom_user.save()
        return custom_user
