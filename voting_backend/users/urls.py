from django.urls import path

from .views import StateChoicesList

urlpatterns = [
    path('states/', StateChoicesList.as_view(), name='states'),
]