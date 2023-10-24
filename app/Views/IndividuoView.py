from django.http import JsonResponse
from django.views import View
from app.Models.Entity import IndividuoModel
from app.repositories.Entity import IndividuoRepository  

class IndividuoView(View):
    def __init__(self):
        self.individuo_repository = IndividuoRepository()

    def get(self, request):
        action = request.GET.get('action')
        if action == 'findAll':
            return self.find_all()
        elif action == 'getIndividuoByName':
            name = request.GET.get('name', 'Stranger')
            return self.get_individuo_by_name(name)
        elif action == 'getCloseness':
            return self.get_closeness()
        elif action == 'getDiameter':
            return self.get_diameter()
        elif action == 'getProj':
            return self.get_proj()
        elif action == 'getCustomProj':
            t1 = request.GET.get('t1')
            t2 = request.GET.get('t2')
            return self.get_custom_proj(t1, t2)
        else:
            return JsonResponse({"error": "Invalid action"}, status=400)

    def find_all(self):
        individuo_list = self.individuo_repository.find_all()
        return JsonResponse({"result": individuo_list})

    def get_individuo_by_name(self, name):
        individuo = self.individuo_repository.get_individuo_by_name(name)
        return JsonResponse({"result": individuo})

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
