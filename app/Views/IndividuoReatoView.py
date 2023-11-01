from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoReatoRepository import IndividuoReatoRepository
from django_request_mapping import request_mapping

@request_mapping("/individuoReato")
class IndividuoReatoView(View):

    def __init__(self):
        super().__init__()
        self.individuoReato_repository: IndividuoReatoRepository = IndividuoReatoRepository()

    @request_mapping("/findallgraph/", method="get")
    def find_all(self, request) -> JsonResponse:
        graph_list = self.individuoReato_repository.graph()
        return JsonResponse({"result": graph_list})