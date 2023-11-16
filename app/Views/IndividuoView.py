from django.http import JsonResponse
from django.views import View
from app.repositories.Entity.IndividuoRepository import IndividuoRepository
from django_request_mapping import request_mapping
from app.Models.Entity.IndividuoModel import Individuo
import json


@request_mapping("/individuo")
class IndividuoView(View):

    def __init__(self):
        super().__init__()
        self.individuo_repository: IndividuoRepository = IndividuoRepository()


    #Fa riferimento alla find_all() della repository IndividuoRepository e restituisce tutte le informazioni di tutti gli individui 
    #Args in input: none
    #Restituisce result, che è una lista contenete tutte le informazioni degli individui 
    @request_mapping("/findall/", method="get")
    def find_all(self, request) -> JsonResponse:
        individuo_list = self.individuo_repository.find_all()
        return JsonResponse({"result": individuo_list})
    
    
    #Fa riferimento alla find_all_surname_name() della repository IndividuoRepository e restituisce l'identificativo, il cognome e il nome di tutti gli individui 
    #Args in input: none
    #Restituisce result, che è una lista contenete l'identificativo, il cognome e il nome degli individui 
    @request_mapping("/findAllSurnameName/", method="get")
    def find_all(self, request) -> JsonResponse:
        individuo_list = self.individuo_repository.find_all_surname_name()
        return JsonResponse({"result":individuo_list})


    #Fa riferimento alla get_node_info_by_nodeId(node_id) della repository IndividuoRepository e restituisce le informazioni dell'individuo con il node_Id
    #Args in input: node_Id dell'individuo
    #Result: una lista contenente le informazioni relative all'individuo con quel node_Id
    @request_mapping("/getinfobynodeid/<str:node_id>", method="get")
    def get_nodeinfo_by_node_id(self,request,node_id) -> JsonResponse:
        nodes = self.individuo_repository.get_node_info_by_nodeId(node_id)
        if nodes:
            return JsonResponse({"result": nodes})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)
        

    @request_mapping("/modificaIndividuo/", method="post")
    def edit_Node_Individuo(self,request) -> JsonResponse:  
        try:            
            
            data = json.loads(json.loads(request.body))
            print(data)
            
            individuo_repository = IndividuoRepository()
            individuo_repository.EditIndividuo(data)
            
            return JsonResponse({"status": 100, "result": "Tutto apposto"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Se si verifica un errore, restituisci status 500 e il messaggio di errore
            return JsonResponse({"error_message": str(e)}, status=500)
        
    @request_mapping("/eliminaIndividuo/", method="post")
    def delete_Node_Individuo(self,request) -> JsonResponse:  
        print("sono in eliminaNodo")
        try:            
            
            print("prima del data")
            data = json.loads(json.loads(request.body))
                        
            individuo_repository = IndividuoRepository()
            individuo_repository.DeleteIndividuo(data)
            
            return JsonResponse({"status": 100, "result": "Tutto apposto"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Se si verifica un errore, restituisci status 500 e il messaggio di errore
            return JsonResponse({"error_message": str(e)}, status=500)

    
    
        

############################################# NON UTILIZZATE (POSSIBILMENTE UTILI IN FUTURO) #########################################################################

"""

    #Fa riferimento alla get_node_info(id) della repository IndividuoRepository e restituisce le informazioni dell'individuo con l'id della entry individuo
    #NB. diverso dal nodeId
    #Args in input: id della entry individuo
    #Result: una lista contenente le informazioni relative all'individuo con quel id
    @request_mapping("/getinfobyid/<int:id>/", method="get")
    def get_nodeinfo_by_id(self,request,id) -> JsonResponse:
        nodes = self.individuo_repository.get_node_info(id)
        if nodes:
            return JsonResponse({"result": nodes})
        else:
            return JsonResponse({"error": "Nodes not found"}, status=404)
    


    #Fa riferimento alla find_by_nome(name) della repository IndividuoRepository e restituisce le informazioni dell'individuo con il nome "name"
    #Args in input: name ovvero il nome individuo
    #Restituisce result, che è una lista contenente le informazioni relative all'individuo con quel nome
    @request_mapping("/findbynome/<str:name>/", method="get")
    def get_individuo_by_name(self,request,name) -> JsonResponse:
        individuo = self.individuo_repository.find_by_nome(name)
        if individuo:
            return JsonResponse({"result": individuo})
        else:
            return JsonResponse({"error": "Individuo not found"}, status=404)


    #Fa riferimento alla get_id_by_nome_cognome(nome,cognome) della repository IndividuoRepository e restituisce l'id dell'individuo con il nome "nome,cognome"
    #Args in input: nome e cognome individuo separati dal carattere "_" 
    #Restituisce result, che è una lista contenente l'id relativo all'individuo con quel nome e cognome
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

"""