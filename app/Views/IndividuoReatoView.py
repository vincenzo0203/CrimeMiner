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
        return JsonResponse({"result": graph_list})
    

    
    #Fa riferimento alla getIndividuo_o_Reato(node_id) della repository IndividuoRepository e restituisce le informazioni dell'individuo con il node_Id
    #Args in input: node_Id dell'individuo
    #Result: una lista contenente le informazioni relative all'individuo con quel node_Id
    @request_mapping("/getReatoIndividuoInfoById/<str:node_id>", method="get")
    def get_Reato_o_Individuo_by_Id(self,request,node_id) -> JsonResponse:
        nodes = self.individuoReato_repository.getIndividuo_o_Reato(node_id)
        if nodes:
            return JsonResponse({"result": nodes})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)

