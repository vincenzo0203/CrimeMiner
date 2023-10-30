from django.urls import path, include
from . import views
from app.Views.IndividuoView import IndividuoView


from django_request_mapping import UrlPattern


urlpattern = UrlPattern()
#Registrazione delle view del backend
urlpattern.register(IndividuoView)



urlpatterns = [
    path('', views.app),
    path('chiamate_individui', views.individualWiretaps),

    #Path per la registrazione di tutte le View del Backend funzionante con request mapping. Si crea una classe view, si definiscono le request mapping in questa classe creata
    #e si registra la view creata in urlpattern
    path('', include(urlpattern)) 
    
]









