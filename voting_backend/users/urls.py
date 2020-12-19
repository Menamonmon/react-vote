from django.urls import path

from .views import StateChoicesListView

urlpatterns = [
    path('states/', StateChoicesListView.as_view(), name='states'),
]