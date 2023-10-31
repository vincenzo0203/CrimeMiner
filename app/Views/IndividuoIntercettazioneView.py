from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoIntercettazioneRepository import IndividuoIntercettazioneRepository
from django_request_mapping import request_mapping


@request_mapping("/individuoIntercettazione")    #BISOGNA AGGIUSTARE LA REPOSITORY DI QUESTA VIEW E INFATTI NON FUNZIONA 
class IndividuoIntercettazioneView(View): 

    def __init__(self):     
        super().__init__()
        self.IndividuoIntercettazione_repository: IndividuoIntercettazioneRepository = IndividuoIntercettazioneRepository()

    @request_mapping("/findallnodes/", method="get")
    def find_all(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.get_all_nodes_and_edge()
        return JsonResponse(node_list)