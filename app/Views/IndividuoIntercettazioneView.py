from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoIntercettazioneRepository import IndividuoIntercettazioneRepository
from django_request_mapping import request_mapping


@request_mapping("/individuoIntercettazione")
class IndividuoIntercettazioneView(View):

    template_name = 'template_name.html'

    def __init__(self):
        super().__init__()
        self.IndividuoIntercettazione_repository: IndividuoIntercettazioneRepository = IndividuoIntercettazioneRepository()

    @request_mapping("/findallnodes/", method="get")
    def find_all(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.get_all_nodes_and_edge()
        return JsonResponse({"result": node_list})