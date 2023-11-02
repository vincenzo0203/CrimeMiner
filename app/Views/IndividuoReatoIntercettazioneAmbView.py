from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoReatoIntercettazioneAmbRepository import IndividuoReatoIntercettazioneAmbRepository
from django_request_mapping import request_mapping


@request_mapping("/individuoReatoIntercettazioneAmb")  
class IndividuoReatoIntercettazioneAmbView(View):

    def __init__(self):
        super().__init__()
        self.individuoReatoIntercettazioneAmb_repository: IndividuoReatoIntercettazioneAmbRepository = IndividuoReatoIntercettazioneAmbRepository()


    
    #Fa riferimento alla getRelationships_IndividuiReati() della repository IndividuoReatoIntercettazioneAmbRepository e 
    # grafo delle relazioni tra individui e reati e intercettazioni ambientali
    #Args in input: none
    #Restituisce result, che è una lista contenente le informazioni deigli individui con il reato e l'intercettazione di riferimento
    @request_mapping("/findallgraph/", method="get")
    def graph(self, request) -> JsonResponse:
        graph_list = self.individuoReatoIntercettazioneAmb_repository.getRelationships_IndividuiReati()
        return JsonResponse({"result": graph_list})
    
    