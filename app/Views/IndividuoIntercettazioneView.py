from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoIntercettazioneRepository import IndividuoIntercettazioneRepository
from app.repositories.Entity.IndividuoRepository import IndividuoRepository
from django_request_mapping import request_mapping
import json


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
    
    @request_mapping("/Betweenness/", method="get")
    def Betweenness(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.Betweenness()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/PageRank/", method="get")
    def PageRank(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.PageRank()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/WeightedPageRank/", method="get")
    def WeightedPageRank(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.WeightedPageRank()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/Degree/", method="get")
    def Degree(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.Degree()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/InDegree/", method="get")
    def InDegree(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.InDegree()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/OutDegree/", method="get")
    def OutDegree(self, request) -> JsonResponse:
        node_list = self.IndividuoIntercettazione_repository.OutDegree()
        return JsonResponse({"result":node_list})
    

    @request_mapping("/creaIntercettazione/", method="post")
    def create_Node(self,request) -> JsonResponse:  

        try:
            #il primo json.load lo converte da Unicode a Stringa e il secondo json.load converte la Stringa in un oggetto Json
            data =json.loads(json.loads(request.body)) 
            print(f"Tipo di 'data': {type(data)}")

            id1_individuo=None
            id2_individuo=None

            # Esegui la tua query e ottieni il risultato
            
            if  not "nodeId" in data["source"]:
                individuo_repository = IndividuoRepository()
                id1_individuo = individuo_repository.CreaIndividuo(data["source"])
            else:
                id1_individuo=data["source"].get("nodeId")
                print(id1_individuo)


            if  not "nodeId" in data["target"]:
                individuo_repository = IndividuoRepository()
                id2_individuo = individuo_repository.CreaIndividuo(data["target"])
            else:
                id2_individuo=data["target"].get("nodeId")
                print(id2_individuo)

            intercettazione_result = self.IndividuoIntercettazione_repository.CreaIntercettazione(data["call"],id1_individuo,id2_individuo)

            # Restituisci il risultato con status 100 se la query è andata bene
            return JsonResponse({"status": 100, "result": intercettazione_result},status=100)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Se si verifica un errore, restituisci status 500 e il messaggio di errore
            return JsonResponse({"error_message": str(e)}, status=500)