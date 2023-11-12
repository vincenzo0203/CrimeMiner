from django.http import JsonResponse
from django.views import View
from app.repositories.Entity.IndividuoRepository import IndividuoRepository
from django_request_mapping import request_mapping
from app.Models.Entity.IndividuoModel import IndividuoModel
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
        
                
    @request_mapping("/createNode/", method="post")
    def create_Node(self,request) -> JsonResponse:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

        # Crea un'istanza di IndividuoModel
        individuo_model = IndividuoModel(
            nodeId="ValoreNodo",
            entityType="Individuo",
            name=data.get("CoincideconnodeID"),
            mesiImputati=0,
            mesiTotali=0,
            lng = 0,
            lat = 0,
            community = 0,
            isIndagato = False,
            provinciaResidenza = data.get("provinciaResidenza"),
            luogoNascita = data.get("luogoNascita"),
            dataNascita = data.get("dataNascita"),
            indirizzoResidenza = data.get("indirizzoResidenza"),
            cognome = data.get("cognome"),
            nome = data.get("nome"),
            capResidenza = data.get("capResidenza"),
            cittaResidenza = data.get("cittaResidenza"),
            nazioneResidenza = data.get("nazioneResidenza"),
        )

        
        try:
            data = json.loads(request.body)
            # Esegui la tua query e ottieni il risultato
            result = self.individuo_repository.CreaIntercettazione(individuo_model)
            # Restituisci il risultato con status 100 se la query è andata bene
            return JsonResponse({"status": 100, "result": result})
        except Exception as e:
            # Se si verifica un errore, restituisci status 104 e il messaggio di errore
            return JsonResponse({"status": 104, "error_message": str(e)}, status=500)
    
        

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