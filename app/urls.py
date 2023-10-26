from django.urls import path
from . import views

urlpatterns = [
    path('', views.app),
    path('chiamate_individui', views.individualWiretaps, name='individualWiretaps'),
    path('individuo/', IndividuoView.as_view(), name='individuo-view'),
]