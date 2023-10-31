from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoIntercettazioneAmbRepository import IndividuoIntercettazioneAmbRepository
from django_request_mapping import request_mapping

@request_mapping("/individuoIntercettazioneAmb")
class IndividuoIntercettazioneAmbView(View):

    def __init__(self):
        super().__init__()
        self.individuoIntercettazioneAmb_repository: IndividuoIntercettazioneAmbRepository = IndividuoIntercettazioneAmbRepository()

    @request_mapping("/findall/", method="get")
    def graph(self, request):
        graph_list = self.individuoIntercettazioneAmb_repository.graph()
        return JsonResponse(graph_list)   #aggiungere ,safe=False