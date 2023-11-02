from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoIntercettazioneRepository import IndividuoIntercettazioneRepository
from django_request_mapping import request_mapping


@request_mapping("/individuoIntercettazione")    
class IndividuoIntercettazioneView(View): 

    def __init__(self):     
        super().__init__()
        self.IndividuoIntercettazione_repository: IndividuoIntercettazioneRepository = IndividuoIntercettazioneRepository()

    @request_mapping("/findallnodes/", method="get")
    def find_all(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.get_all_nodes_and_edge()
        return JsonResponse(node_list)
    
    @request_mapping("/getinfobyedgeid/<str:edge_id>", method="get")
    def get_info_by_edge_id(self, request,edge_id) -> JsonResponse:
        edge = self.IndividuoIntercettazione_repository.get_edge_info(edge_id)
        if edge:
            return JsonResponse({"result": edge})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)