"""voting_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework.authtoken.views import obtain_auth_token as login_view

from users.views import VotesListView

urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),
    path('elections/', include('elections.urls'), name='elections'),
    path('votes/', VotesListView.as_view(), name='votes'),
    path('accounts/', include('users.accounts.urls'), name='accoutns'),
]
