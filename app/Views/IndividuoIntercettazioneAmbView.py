from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoIntercettazioneAmbRepository import IndividuoIntercettazioneAmbRepository
from django_request_mapping import request_mapping

@request_mapping("/individuoIntercettazioneAmb")
class IndividuoIntercettazioneAmbView(View):

    def __init__(self):
        super().__init__()
        self.individuoIntercettazioneAmb_repository: IndividuoIntercettazioneAmbRepository = IndividuoIntercettazioneAmbRepository()

    #Fa riferimento alla getIndividuiInIntercettazioneAmb() della repository IndividuoIntercettazioneAmbRepository e 
    #l'id degli individui nelle intercettazioni ambientali
    #Args in input: none
    #Restituisce result, che è una lista contenente l'id degli individui coinvolti in un intercettazione ambientale
    @request_mapping("/graphall/", method="get")
    def graph(self, request) -> JsonResponse: 
        graph_list = self.individuoIntercettazioneAmb_repository.getGraph_IndividuiIntercettazioneAmb()
        return JsonResponse({"result": graph_list})   
    
    #Fa riferimento alla getIndividuo_o_Intercettazione(node_id) della repository IndividuoIntercettazioneAmbRepository e restituisce le informazioni dell'individuo o dell'intercettazione con il node_Id
    #Args in input: node_Id dell'individuo o dell'intercettazione ambientale
    #Result: una lista contenente le informazioni relative all'individuo o all'intercettazione ambientale con quel node_Id
    @request_mapping("/getIntercettazioneAmbIndividuoInfoById/<str:node_id>", method="get")
    def get_IntercettazioneAmb_o_Individuo_by_Id(self,request,node_id) -> JsonResponse:
        nodes = self.individuoIntercettazioneAmb_repository.getIndividuo_o_Intercettazione(node_id)
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
        edge = self.individuoIntercettazioneAmb_repository.getEdge_Info(edge_id)
        if edge:
            return JsonResponse({"result": edge})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)

    @request_mapping("/Closeness/", method="get")
    def Closeness(self, request) -> JsonResponse:
        node_list = self.individuoIntercettazioneAmb_repository.Closeness()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/Betweenness/", method="get")
    def Betweenness(self, request) -> JsonResponse:
        node_list = self.individuoIntercettazioneAmb_repository.Betweenness()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/PageRank/", method="get")
    def PageRank(self, request) -> JsonResponse:
        node_list = self.individuoIntercettazioneAmb_repository.PageRank()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/WeightedPageRank/", method="get")
    def WeightedPageRank(self, request) -> JsonResponse:
        node_list = self.individuoIntercettazioneAmb_repository.WeightedPageRank()
        return JsonResponse({"result":node_list})
    

    @request_mapping("/Degree/", method="get")
    def Degree(self, request) -> JsonResponse:
        node_list = self.individuoIntercettazioneAmb_repository.Degree()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/InDegree/", method="get")
    def InDegree(self, request) -> JsonResponse:
        node_list = self.individuoIntercettazioneAmb_repository.InDegree()
        return JsonResponse({"result":node_list})
    
    @request_mapping("/OutDegree/", method="get")
    def OutDegree(self, request) -> JsonResponse:
        node_list = self.individuoIntercettazioneAmb_repository.OutDegree()
        return JsonResponse({"result":node_list})

    