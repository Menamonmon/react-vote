from django.urls import path

from .views import VotesListView, SubmitVoteView

urlpatterns = [
    path("", VotesListView.as_view(), name="votes-list"),
    path("submit/", SubmitVoteView.as_view(), name="votes-submit"),
]
