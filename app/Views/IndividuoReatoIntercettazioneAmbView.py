from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoReatoIntercettazioneAmbRepository import IndividuoReatoIntercettazioneAmbRepository
from django_request_mapping import request_mapping


@request_mapping("/individuoReatoIntercettazioneAmb")  
class IndividuoReatoIntercettazioneAmbView(View):

    def __init__(self):
        super().__init__()
        self.individuoReatoIntercettazioneAmb_repository: IndividuoReatoIntercettazioneAmbRepository = IndividuoReatoIntercettazioneAmbRepository()

    #Fa riferimento alla getRelationships_IndividuiReati() della repository IndividuoReatoIntercettazioneAmbRepository e 
    # grafo delle relazioni tra individui e reati e intercettazioni ambientali
    #Args in input: none
    #Restituisce result, che è una lista contenente le informazioni deigli individui con il reato e l'intercettazione di riferimento
    @request_mapping("/findallgraph/", method="get")
    def graph(self, request) -> JsonResponse:
        graph_list = self.individuoReatoIntercettazioneAmb_repository.getRelationships_IndividuiReati_IntercettazioniAmb()
        return JsonResponse(graph_list)
    
    #Fa riferimento alla getIndividuo_o_Intercettazione(node_id) della repository IndividuoIntercettazioneAmbRepository e restituisce le informazioni dell'individuo o dell'intercettazione con il node_Id
    #Args in input: node_Id dell'individuo o dell'intercettazione ambientale
    #Result: una lista contenente le informazioni relative all'individuo o all'intercettazione ambientale con quel node_Id
    @request_mapping("/getIntercettazioneAmbIndividuoReatoInfoById/<str:node_id>", method="get")
    def get_IntercettazioneAmb_o_Individuo_by_Id(self,request,node_id) -> JsonResponse:
        nodes = self.individuoReatoIntercettazioneAmb_repository.getIndividuo_o_Intercettazione_o_Reato(node_id)
        if nodes:
            return JsonResponse({"result": nodes})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)
    
    #Fa riferimento alla getEdge_Info(edge_id) della repository IndividuoIntercettazioneRepository e 
    #restituisce l'arco del grafo con id "edge_id" della relazione HaChiamato
    #Args in input: edge_id che è l'id dell'arco
    #Restituisce result, che è una lista contenete le informazioni dell'arco con quel edge_id
    @request_mapping("/getinfobyedgeid/<str:edge_id>", method="get")
    def get_info_by_edge_id(self, request,edge_id) -> JsonResponse:
        edge = self.individuoReatoIntercettazioneAmb_repository.getEdge_Info_More(edge_id)
        if edge:
            return JsonResponse({"result": edge})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)
    
    @request_mapping("/Closeness/", method="get")
    def Closeness(self, request) -> JsonResponse:
        node_list = self.individuoReatoIntercettazioneAmb_repository.Closeness()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/Betweenness/", method="get")
    def Betweenness(self, request) -> JsonResponse:
        node_list = self.individuoReatoIntercettazioneAmb_repository.Betweenness()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/PageRank/", method="get")
    def PageRank(self, request) -> JsonResponse:
        node_list = self.individuoReatoIntercettazioneAmb_repository.PageRank()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/WeightedPageRank/", method="get")
    def WeightedPageRank(self, request) -> JsonResponse:
        node_list = self.individuoReatoIntercettazioneAmb_repository.WeightedPageRank()
        return JsonResponse({"result":node_list})
    

    @request_mapping("/Degree/", method="get")
    def Degree(self, request) -> JsonResponse:
        node_list = self.individuoReatoIntercettazioneAmb_repository.Degree()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/InDegree/", method="get")
    def InDegree(self, request) -> JsonResponse:
        node_list = self.individuoReatoIntercettazioneAmb_repository.InDegree()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/OutDegree/", method="get")
    def OutDegree(self, request) -> JsonResponse:
        node_list = self.individuoReatoIntercettazioneAmb_repository.OutDegree()
        return JsonResponse({"result":node_list})
    
    