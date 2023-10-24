from django.shortcuts import render

# Create your views here.

def app(request):
    return render(request, 'dashboard.html')

def individualWiretaps(request):
    return render(request, 'features/individualWiretaps.html')