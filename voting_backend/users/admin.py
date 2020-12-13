from django.contrib import admin
from .models import CustomUser, Vote

admin.site.register(CustomUser)
admin.site.register(Vote)