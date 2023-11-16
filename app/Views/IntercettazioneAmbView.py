from django.http import JsonResponse
from django.views import View
from app.repositories.Entity.IntercettazioneAmbRepository import IntercettazioneAmbRepository
from django_request_mapping import request_mapping
import json

@request_mapping("/intercettazioneAmbientale")
class IntercettazioneAmbView(View):

    def __init__(self):
        super().__init__()
        self.individuo_repository: IntercettazioneAmbRepository = IntercettazioneAmbRepository()


    #Fa riferimento alla find_all() della repository IndividuoRepository e restituisce tutte le informazioni di tutti gli individui 
    #Args in input: none
    #Restituisce result, che è una lista contenete tutte le informazioni degli individui 
    @request_mapping("/findall/", method="get")
    def find_all(self, request) -> JsonResponse:
        individuo_list = self.individuo_repository.find_all()
        return JsonResponse({"result": individuo_list})


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
        
    @request_mapping("/modificaNodoAmb/", method="post")
    def edit_Node_IntAmbientale(self,request) -> JsonResponse:  
        print("boh forse")
        try:             
            data = json.loads(json.loads(request.body))
            print(data)
            
            self.individuo_repository.EditIntAmb(data["enviromentalTapping"])
            
            return JsonResponse({"status": 100, "result": "Tutto apposto"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Se si verifica un errore, restituisci status 500 e il messaggio di errore
            return JsonResponse({"error_message": str(e)}, status=500)
        
    @request_mapping("/eliminaNodoAmb/", method="post")
    def delete_Node_AmbIndividuo(self,request) -> JsonResponse:  
        try:            
            
            data = json.loads(json.loads(request.body))
                        
            self.individuo_repository.deleteNodo(data)
            
            return JsonResponse({"status": 100, "result": "Tutto apposto"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Se si verifica un errore, restituisci status 500 e il messaggio di errore
            return JsonResponse({"error_message": str(e)}, status=500)
