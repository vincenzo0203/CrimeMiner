from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoIntercettazioneRepository import IndividuoIntercettazioneRepository
from django_request_mapping import request_mapping


@request_mapping("/individuoIntercettazione")    
class IndividuoIntercettazioneView(View): 

    def __init__(self):     
        super().__init__()
        self.IndividuoIntercettazione_repository: IndividuoIntercettazioneRepository = IndividuoIntercettazioneRepository()


    #Fa riferimento alla getAll_nodes_and_edge() della repository IndividuoIntercettazioneRepository e 
    # restituisce tutti i nodi e gli archi del grafo, inclusi i nodi Individuo e gli archi HaChiamato
    #Args in input: none 
    #Restituisce result, che è una lista i nodi e gli archi in relazione
    @request_mapping("/findallnodes/", method="get")
    def find_all(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.getAll_nodes_and_edge()
        return JsonResponse(node_list)
    

    #Fa riferimento alla getEdge_Info(edge_id) della repository IndividuoIntercettazioneRepository e 
    #restituisce l'arco del grafo con id "edge_id" della relazione HaChiamato
    #Args in input: edge_id che è l'id dell'arco
    #Restituisce result, che è una lista contenete le informazioni dell'arco con quel edge_id
    @request_mapping("/getinfobyedgeid/<str:edge_id>", method="get")
    def get_info_by_edge_id(self, request,edge_id) -> JsonResponse:
        edge = self.IndividuoIntercettazione_repository.getEdge_Info(edge_id)
        if edge:
            return JsonResponse({"result": edge})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)
    
    @request_mapping("/Closeness/", method="get")
    def Closeness(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.Closeness()
        return JsonResponse({"result":node_list})