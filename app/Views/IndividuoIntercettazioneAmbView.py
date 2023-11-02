from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoIntercettazioneAmbRepository import IndividuoIntercettazioneAmbRepository
from django_request_mapping import request_mapping

@request_mapping("/individuoIntercettazioneAmb")
class IndividuoIntercettazioneAmbView(View):

    def __init__(self):
        super().__init__()
        self.individuoIntercettazioneAmb_repository: IndividuoIntercettazioneAmbRepository = IndividuoIntercettazioneAmbRepository()

    #Fa riferimento alla getIndividuiInIntercettazioneAmb() della repository IndividuoIntercettazioneAmbRepository e 
    #l'id degli individui nelle intercettazioni ambientali
    #Args in input: none
    #Restituisce result, che è una lista contenente l'id degli individui coinvolti in un intercettazione ambientale
    @request_mapping("/graphall/", method="get")
    def graph(self, request) -> JsonResponse: 
        graph_list = self.individuoIntercettazioneAmb_repository.getIndividuiInIntercettazioneAmb()
        return JsonResponse({"result": graph_list})   
    

    