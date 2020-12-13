from django.urls import path, include
from .views import CustomUsersView

urlpatterns = [
    path('<str:username>', CustomUsersView.as_view()),
    path('', CustomUsersView.as_view()),
]