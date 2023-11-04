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
        graph_list = self.individuoIntercettazioneAmb_repository.getIndividuiInIntercettazioneAmb()
        return JsonResponse({"result": graph_list})   
    

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

    