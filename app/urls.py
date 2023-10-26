from django.urls import path
from . import views
from app.Views.IndividuoView import IndividuoView

urlpatterns = [
    path('', views.app),
    path('chiamate_individui', views.individualWiretaps),
    path('individuo/', IndividuoView.as_view(), name='individuo-view'),
]