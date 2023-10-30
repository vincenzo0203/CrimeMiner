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

    def get_individuo_by_name(self, name) -> JsonResponse:
        individuo = self.individuo_repository.find_by_nome(name)
        if individuo:
            return JsonResponse({"result": individuo})
        else:
            return JsonResponse({"error": "Individuo not found"}, status=404)

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
