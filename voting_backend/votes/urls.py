from django.urls import path

from .views import VotesListView, SubmitVoteView, DeleteVoteView

urlpatterns = [
    path("", VotesListView.as_view(), name="votes-list"),
    path("submit/", SubmitVoteView.as_view(), name="votes-submit"),
    path("delete/<int:vote_id>", DeleteVoteView.as_view(), name="votes-delete")
]
