from django.http import JsonResponse
from django.views import View
from app.repositories.Entity.IndividuoRepository import IndividuoRepository
from django_request_mapping import request_mapping

@request_mapping("/individuo")
class IndividuoView(View):

    def __init__(self):
        super().__init__()
        self.individuo_repository: IndividuoRepository = IndividuoRepository()

    @request_mapping("/findall/", method="get")
    def find_all(self, request) -> JsonResponse:
        individuo_list = self.individuo_repository.find_all()
        return JsonResponse({"result": individuo_list})

    @request_mapping("/findbynome/<str:name>/", method="get")
    def get_individuo_by_name(self,request,name) -> JsonResponse:
        individuo = self.individuo_repository.find_by_nome(name)
        if individuo:
            return JsonResponse({"result": individuo})
        else:
            return JsonResponse({"error": "Individuo not found"}, status=404)


    @request_mapping("/getinfobyid/<int:node_id>/", method="get")
    def get_nodeinfo_by_id(self,request,node_id) -> JsonResponse:
        nodes = self.individuo_repository.get_node_info(node_id)
        if nodes:
            return JsonResponse({"result": nodes})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)
    
    @request_mapping("/getidbynomecognome/<str:nome_cognome>/", method="get")
    def get_id_by_nome_cognome(self,request,nome_cognome) -> JsonResponse:
        nome, cognome = nome_cognome.split("_")
        ids = self.individuo_repository.get_id_by_nome_cognome(nome,cognome)
        if ids:
            return JsonResponse({"result": ids})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)
    
    
    
    
    def get_closeness(self):
        closeness_data = self.individuo_repository.get_closeness()
        return JsonResponse({"result": closeness_data})

    def get_diameter(self):
        diameter = self.individuo_repository.get_diameter()
        return JsonResponse({"result": diameter})

    def get_proj(self):
        proj_data = self.individuo_repository.get_proj()
        return JsonResponse({"result": proj_data})

    def get_custom_proj(self, t1, t2):
        custom_proj_data = self.individuo_repository.get_custom_proj(t1, t2)
        return JsonResponse({"result": custom_proj_data})
