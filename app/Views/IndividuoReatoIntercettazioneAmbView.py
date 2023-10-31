from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoReatoIntercettazioneAmbRepository import IndividuoReatoIntercettazioneAmbRepository
from django_request_mapping import request_mapping


@request_mapping("/individuoReatoIntercettazioneAmb")
class IndividuoReatoIntercettazioneAmbView(View):

    def __init__(self):
        super().__init__()
        self.individuoReatoIntercettazioneAmb_repository: IndividuoReatoIntercettazioneAmbRepository = IndividuoReatoIntercettazioneAmbRepository()

    @request_mapping("/findallgraph/", method="get")
    def graph(self, request) -> JsonResponse:
        graph_list = self.individuoReatoIntercettazioneAmb_repository.graph()
        return JsonResponse(graph_list)
    
    