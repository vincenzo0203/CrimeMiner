from django.shortcuts import render

# Create your views here.

def graphview(request):
    return render(request, 'graphview/file.html')