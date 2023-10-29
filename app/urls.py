from django.urls import path
from . import views
from app.Views.IndividuoView import IndividuoView

from django_request_mapping import UrlPattern


urlpatterns =  UrlPattern()
urlpatterns.register(IndividuoView)

urlpatterns = [
    path('', views.app),
    path('chiamate_individui', views.individualWiretaps),
    path('/individuo', IndividuoView, name='individuo')
]






