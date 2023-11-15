from neomodel import UniqueIdProperty, db
from app.Neo4jConnection import Neo4jDriver
from app.Models.Entity.IndividuoModel import Individuo

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
    def CreaIntercettazioneAmb(data):
        try:
            print("qualcosa")
        
        except Exception as e:
            # Gestione degli altri errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante il salvataggio dell'intercettazioneAmb:", e)
            return []