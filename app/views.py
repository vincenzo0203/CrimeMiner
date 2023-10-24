from django.shortcuts import render
from app.Views import IndividuoView

# Create your views here.

def app(request):
    return render(request, 'index.html')