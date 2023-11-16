from django.http import JsonResponse
from django.views import View
from app.repositories.Relationship.IndividuoIntercettazioneAmbRepository import IndividuoIntercettazioneAmbRepository
from django_request_mapping import request_mapping
from app.repositories.Entity.IndividuoRepository import IndividuoRepository
from app.repositories.Entity.IntercettazioneAmbRepository import IntercettazioneAmbRepository
import json

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
    

    @request_mapping("/creaIntercettazioneAmb/", method="post")
    def create_Node(self,request) -> JsonResponse:  
        try:
            #il primo json.load lo converte da Unicode a Stringa e il secondo json.load converte la Stringa in un oggetto Json
            data =json.loads(json.loads(request.body)) 
            id_individuo=None
            id_intercettazioneAmb=None

            # Esegui la tua query e ottieni il risultato
            
            if  not "nodeId" in data["individual"]:
                individuo_repository = IndividuoRepository()
                id_individuo = individuo_repository.CreaIndividuo(data["individual"])
            else:
                id_individuo=data["individual"].get("nodeId")
                print(id_individuo)

            if  not "nodeId" in data["enviromentalTapping"]:
                intercettazioneAmb_repository = IntercettazioneAmbRepository()
                id_intercettazioneAmb = intercettazioneAmb_repository.CreaIntercettazioneAmb(data["enviromentalTapping"])
            else:
                id_intercettazioneAmb=data["enviromentalTapping"].get("nodeId")

            presente_result = self.individuoIntercettazioneAmb_repository.CreaPresenteIntercettazioneAmb(id_individuo,id_intercettazioneAmb)

            # Restituisci il risultato con status 100 se la query è andata bene
            return JsonResponse({"status": 100, "result": "ciao"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Se si verifica un errore, restituisci status 500 e il messaggio di errore
            return JsonResponse({"error_message": str(e)}, status=500)
        
    @request_mapping("/outputJson/", method="get")
    def OutputJson(self, request) -> JsonResponse:
        output = self.individuoIntercettazioneAmb_repository.convert_and_save_to_json()
        return JsonResponse({"result": output})
     
          
    @request_mapping("/eliminaIntIndAmb/",method="post")
    def delete_EdgePresente(self,request) -> JsonResponse:
        try:
            data = json.loads(json.loads(request.body))
            print(data)
            
            self.individuoIntercettazioneAmb_repository.elemina_ArcoIndIntercettazione(data)
            
            return JsonResponse({"status": 100, "result": "Tutto apposto"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            # Se si verifica un errore, restituisci status 500 e il messaggio di errore
            return JsonResponse({"error_message": str(e)}, status=500)



    