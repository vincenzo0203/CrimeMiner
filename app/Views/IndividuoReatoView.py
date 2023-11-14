from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoReatoRepository import IndividuoReatoRepository
from django_request_mapping import request_mapping

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
