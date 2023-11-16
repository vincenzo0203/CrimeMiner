from neomodel import UniqueIdProperty, db
from app.Neo4jConnection import Neo4jDriver
from app.Models.Entity.IndividuoModel import Individuo
from app.Models.Entity.IntercettazioneAmbModel import IntercettazioneAmb
from datetime import datetime

# Questa classe fornisce metodi per recuperare informazioni sugli individui.
class IntercettazioneAmbRepository:

    # Trova tutti gli individui.
    # Args: none
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni su tutti gli individui.
    @staticmethod
    def find_all():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:IntercettazioneAmb) RETURN n"
            results = session.run(cypher_query).data()
            return results
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

        
    # Ottiene le informazioni di un nodo dato il suo node_id.
    # Args:
    #     node_id (str): L'ID del nodo dell'individuo da cercare.
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni sull'individuo trovato.
    @staticmethod
    def get_node_info_by_nodeId(node_id):
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (i:IntercettazioneAmb) WHERE i.nodeId = $nodeId RETURN i"
            results = session.run(cypher_query, {"nodeId": node_id}).data()
            return results
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
        
    @staticmethod
    def get_max_node_id_AMB():
        max_node_id = None
        max_number = -1  # Un valore iniziale molto basso per confronto

        try:
            session = Neo4jDriver.get_session()
            result = session.run("MATCH (n:IntercettazioneAmb) RETURN n.nodeId AS nodeId")

            for record in result:
                node_id = record["nodeId"]
                # Estrai la parte numerica dalla stringa nodeId
                numeric_part = int(node_id[2:])

                # Confronto con il massimo attuale
                if numeric_part > max_number:
                    max_number = numeric_part
                    max_node_id = node_id

            result_numeric = max_number + 1
            result_node_id = f"IA{result_numeric}"

            return result_node_id
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return None  # Restituisci None anziché una lista vuota in caso di errore
        
    @staticmethod
    def CalcolaTimeStamp():
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        return timestamp
    
    @staticmethod
    def CreaIntercettazioneAmb(data):
        try:
            idNodo=IntercettazioneAmbRepository.get_max_node_id_AMB()
            times = IntercettazioneAmbRepository.CalcolaTimeStamp()
            intercettazioneAmbModel = IntercettazioneAmb(
            nodeId=idNodo,
            entityType="IntercettazioneAmb",
            timestamp = times,
            name=idNodo,
            data= data.get("date"),
            luogo= data.get("place"),
            contenuto= data.get("content")
            )

            intercettazioneAmbModel.save()

            return intercettazioneAmbModel.nodeId
        except Exception as e:
            # Gestione degli altri errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante il salvataggio dell'intercettazioneAmb:", e)
            return []
        
    @staticmethod
    def find_all_id():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:IntercettazioneAmb) RETURN n.nodeId AS nodeId"
            results = session.run(cypher_query).data()
            return results
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
        
    @staticmethod
    def EditIntAmb(data):
        try:                
                nodo= IntercettazioneAmb.nodes.get(nodeId=data.get("nodeId"))
                
                nodo.luogo=data.get("place")
                nodo.contenuto=data.get("content")
                
                if data.get("date")!="":
                    nodo.data=data.get("date")                

                nodo.save()
                
                return nodo
        except Exception as e:
                # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
                print("Errore durante l'esecuzione della query Cypher:", e)
                return None  # Restituisci None anziché una lista vuota in caso di errore
    
    @staticmethod
    def deleteNodo(data):
            print("ciao")
            nodo= IntercettazioneAmb.nodes.get(nodeId=data.get("nodeId"))
            print(data.get("nodeId"))
            try:
                sourceNodeId = data.get("nodeId") 
                targetNodeId = data.get("nodeId")
                #prendersi tutti gli edgeId e cancellarli, poi eliminare il nodo
                session = Neo4jDriver.get_session()
                query = ("MATCH p=()-[r]->() where r.sourceNodeId=$sourceNodeId or r.targetNodeId=$targetNodeId return r.edgeId")
                results = session.run(query, {"sourceNodeId":sourceNodeId,"targetNodeId": targetNodeId}).data()
                
                for result in results:
                    edgeId = result.get("r.edgeId")
                    query_delete = (
                        "MATCH ()-[r]->() WHERE r.edgeId = $edgeId DELETE r"
                    )
                    session.run(query_delete, {"edgeId": edgeId})

                nodo.delete()
                    
                return "tutto eliminato"
            except Exception as e:
                # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
                print("Errore durante l'esecuzione della query Cypher:", e)
                return None  # Restituisci None anziché una lista vuota in caso di errore