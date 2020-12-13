from django.contrib import admin
from .models import Election, Candidate

# Register your models here.
admin.site.register(Election)
admin.site.register(Candidate)