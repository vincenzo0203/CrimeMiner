from neomodel import db
from app.Models.Entity.ReatoModel import Reato
from app.Neo4jConnection import Neo4jDriver
import json

class ReatoRepository:

    # Restituisce tutti i nodeId, cognomi e nomi degli individui.
    # Args: none
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni su tutti gli individui.
    @staticmethod
    def find_all_name():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (r:Reato) RETURN r.nodeId AS nodeId, r.name AS nome"
            results = session.run(cypher_query).data()
            return results
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
        

    # Ottiene le informazioni di un reato dato il suo id.
    # Args:
    #     id (str): L'ID del reato .
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni sul reato.
    @staticmethod
    def getReato_Info_BynodeId(id):
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (r:Reato) WHERE r.nodeId = $nodeId RETURN r"
            results = session.run(cypher_query, {"nodeId": id}).data()
            return results
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []