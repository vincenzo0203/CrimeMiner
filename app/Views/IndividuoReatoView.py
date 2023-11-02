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