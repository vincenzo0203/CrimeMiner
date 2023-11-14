from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoReatoRepository import IndividuoReatoRepository
from app.repositories.Entity.IndividuoRepository import IndividuoRepository
from django_request_mapping import request_mapping
import json

@request_mapping("/individuoReato")
class IndividuoReatoView(View):

    def __init__(self):
        super().__init__()
        self.individuoReato_repository: IndividuoReatoRepository = IndividuoReatoRepository()


    #Fa riferimento alla getGraph_IndividuiReati() della repository IndividuoReatoRepository e 
    # grafo delle relazioni tra individui e reati (Condannati o Imputati)
    #Args in input: none
    #Restituisce result, che è una lista contenente le informazioni deigli individui con il reato di riferimento
    @request_mapping("/findallgraph/", method="get")
    def find_all(self, request) -> JsonResponse:
        graph_list = self.individuoReato_repository.getGraph_IndividuiReati()
        return JsonResponse(graph_list)
    
    #Fa riferimento alla getIndividuo_o_Reato(node_id) della repository IndividuoReatoRepository e restituisce le informazioni dell'individuo con il node_Id
    #Args in input: node_Id dell'individuo
    #Result: una lista contenente le informazioni relative all'individuo con quel node_Id
    @request_mapping("/getReatoIndividuoInfoById/<str:node_id>", method="get")
    def get_Reato_o_Individuo_by_Id(self,request,node_id) -> JsonResponse:
        nodes = self.individuoReato_repository.getIndividuo_o_Reato(node_id)
        if nodes:
            return JsonResponse({"result": nodes})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)
    
    #Fa riferimento alla getEdge_Info(edge_id) della repository IndividuoReatoRepository e 
    #restituisce l'arco del grafo con id "edge_id" della relazione HaChiamato
    #Args in input: edge_id che è l'id dell'arco
    #Restituisce result, che è una lista contenete le informazioni dell'arco con quel edge_id
    @request_mapping("/getinfobyedgeid/<str:edge_id>", method="get")
    def get_info_by_edge_id(self, request,edge_id) -> JsonResponse:
        edge = self.individuoReato_repository.getEdge_Info(edge_id)
        if edge:
            return JsonResponse({"result": edge})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)
        
    
    #Fa riferimento alla find_all_name() della repository ReatoRepository e restituisce l'identificativo e il nome di tutti i reati 
    #Args in input: none
    #Restituisce result, che è una lista contenete l'identificativo e il nome dei reati 
    @request_mapping("/findAllIndividualCrime/", method="get")
    def find_allIndividualCrime(self, request) -> JsonResponse:
        node_list = self.individuoReato_repository.getModalIndividuoReato()
        return JsonResponse({"result":node_list})


    @request_mapping("/Closeness/", method="get")
    def Closeness(self, request) -> JsonResponse:
        node_list = self.individuoReato_repository.Closeness()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/Betweenness/", method="get")
    def Betweenness(self, request) -> JsonResponse:
        node_list = self.individuoReato_repository.Betweenness()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/PageRank/", method="get")
    def PageRank(self, request) -> JsonResponse:
        node_list = self.individuoReato_repository.PageRank()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/WeightedPageRank/", method="get")
    def WeightedPageRank(self, request) -> JsonResponse:
        node_list = self.individuoReato_repository.WeightedPageRank()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/Degree/", method="get")
    def Degree(self, request) -> JsonResponse:
        node_list = self.individuoReato_repository.Degree()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/InDegree/", method="get")
    def InDegree(self, request) -> JsonResponse:
        node_list = self.individuoReato_repository.InDegree()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/OutDegree/", method="get")
    def OutDegree(self, request) -> JsonResponse:
        node_list = self.individuoReato_repository.OutDegree()
        return JsonResponse({"result":node_list})


    @request_mapping("/creaIndReato/", method="post")
    def create_Node(self,request) -> JsonResponse:  

        try:
            #il primo json.load lo converte da Unicode a Stringa e il secondo json.load converte la Stringa in un oggetto Json
            data =json.loads(json.loads(request.body)) 
            print(f"Tipo di 'data': {type(data)}")

            id_individuo=None
            id_reato=data["reato"].get("nodeId")
 

            # Esegui la tua query e ottieni il risultato
            if  not "nodeId" in data["individuo"]:
                individuo_repository = IndividuoRepository()
                id_individuo = individuo_repository.CreaIndividuo(data["individuo"])
            else:
                id_individuo=data["individuo"].get("nodeId")
                print(id_individuo)


            if  not "Condannato" in data:
                intercettazione_result = self.individuoReato_repository.CreaImputazione(data["imputato"],id_individuo,id_reato)
            else:
                intercettazione_result = self.individuoReato_repository.CreaCondanna(data["condannato"],id_individuo,id_reato)

            # Restituisci il risultato con status 100 se la query è andata bene
            return JsonResponse({"status": 100, "result": intercettazione_result})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Se si verifica un errore, restituisci status 500 e il messaggio di errore
            return JsonResponse({"error_message": str(e)}, status=500)