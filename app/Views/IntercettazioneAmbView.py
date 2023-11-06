from django.http import JsonResponse
from django.views import View
from app.repositories.Entity.IntercettazioneAmbRepository import IntercettazioneAmbRepository
from django_request_mapping import request_mapping

@request_mapping("/intercettazioneAmbientale")
class IndividuoView(View):

    def __init__(self):
        super().__init__()
        self.individuo_repository: IntercettazioneAmbRepository = IntercettazioneAmbRepository()


    #Fa riferimento alla find_all() della repository IndividuoRepository e restituisce tutte le informazioni di tutti gli individui 
    #Args in input: none
    #Restituisce result, che è una lista contenete tutte le informazioni degli individui 
    @request_mapping("/findall/", method="get")
    def find_all(self, request) -> JsonResponse:
        individuo_list = self.individuo_repository.find_all()
        return JsonResponse({"result": individuo_list})


    #Fa riferimento alla get_node_info_by_nodeId(node_id) della repository IndividuoRepository e restituisce le informazioni dell'individuo con il node_Id
    #Args in input: node_Id dell'individuo
    #Result: una lista contenente le informazioni relative all'individuo con quel node_Id
    @request_mapping("/getinfobynodeid/<str:node_id>", method="get")
    def get_nodeinfo_by_node_id(self,request,node_id) -> JsonResponse:
        nodes = self.individuo_repository.get_node_info_by_nodeId(node_id)
        if nodes:
            return JsonResponse({"result": nodes})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)