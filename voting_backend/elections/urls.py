from django.urls import path
from django.contrib.auth.decorators import permission_required, login_required
from .views import ElectionsView, CreateElectionView

urlpatterns = [
    path('create/', CreateElectionView.as_view()),
    path('', ElectionsView.as_view()),
]
