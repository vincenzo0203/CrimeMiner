from django.urls import path, include
from . import views
from app.Views.IndividuoView import IndividuoView
from app.Views.IndividuoIntercettazioneView import IndividuoIntercettazioneView
from app.Views.IndividuoReatoIntercettazioneAmbView import IndividuoReatoIntercettazioneAmbView
from app.Views.IndividuoIntercettazioneAmbView import IndividuoIntercettazioneAmbView
from app.Views.IndividuoReatoView import IndividuoReatoView
from app.Views.IntercettazioneAmbView import IntercettazioneAmbView



from django_request_mapping import UrlPattern


urlpattern = UrlPattern()
#Registrazione delle view del backend
urlpattern.register(IndividuoView)
urlpattern.register(IndividuoIntercettazioneView)
urlpattern.register(IndividuoReatoIntercettazioneAmbView)
urlpattern.register(IndividuoIntercettazioneAmbView)
urlpattern.register(IndividuoReatoView)
urlpattern.register(IntercettazioneAmbView)



urlpatterns = [
    path('', views.app),
    path('chiamate_individui', views.individualWiretaps, name='individualWiretaps'),
    path('crimini_individui', views.individualCrimes, name='individualCrimes'),
    path('intercettazioni_ambientali_individui', views.individualEnviromentalTapping, name='individualEnviromentalTapping'),
    path('intercettazioni_ambientali_crimini_individui', views.individualCrimesEnviromentalTapping, name='individualCrimesEnviromentalTapping'),

    #Path per la registrazione di tutte le View del Backend funzionante con request mapping. Si crea una classe view, si definiscono le request mapping in questa classe creata
    #e si registra la view creata in urlpattern
    path('', include(urlpattern)) 
    
]









