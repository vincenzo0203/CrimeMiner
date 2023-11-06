from django.shortcuts import render

# Create your views here.
def app(request):
    return render(request, 'dashboard.html')

def individualWiretaps(request):
    return render(request, 'features/individualWiretaps.html')

def individualCrimes(request):
    return render(request, 'features/individualCrimes.html')

def individualEnviromentalTapping(request):
    return render(request, 'features/individualEnviromentalTapping.html')