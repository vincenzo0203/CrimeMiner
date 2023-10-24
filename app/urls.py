from django.urls import path
from . import views

urlpatterns = [
    path('', views.app),
    path('chiamate_individui', views.individualWiretaps, name='individualWiretaps'),
]