from typing import List
from app.Neo4jConnection import Neo4jDriver

# Questa classe fornisce metodi per recuperare informazioni sugli individui e i reati.
class IndividuoReatoRepository:

    # Recupera un grafo delle relazioni tra individui e reati (Condannati o Imputati).
    # Args: none
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni sul grafo.
    def getGraph_IndividuiReati(self) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = """
                    MATCH p=()-[r:ImputatoDi|Condannato]->()
                    RETURN nodes(p) as n, relationships(p)[0] as e
                """
            results = session.run(query).data()
            return results
        except Exception as e:
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
        

#################################################### NON UTILIZZATE (POSSIBILMENTE UTILI IN FUTURO) ##############################################################

"""

    # Recupera un grafo delle relazioni tra individui e reati (Condannati o Imputati) con informazioni sugli ID.
    # Args: none
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni sul grafo con ID.
    def getGraph_IndividuiReati_Id(self) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = "MATCH p=()-[r:ImputatoDi|Condannato]->() RETURN r.sourceNodeId as n, r.targetNodeId as e"
            results = session.run(query).data()
            return results
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    # Recupera informazioni sui nomi degli individui e i nomi dei reati associati alle relazioni.
    # Args: none
    # Returns:
    #     List[dict]: Una lista di risultati contenenti i nomi degli individui e i nomi dei reati associati.
    def getAllNomiReato(self) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = "MATCH p=(n:Individuo)-[c:ImputatoDi|Condannato]->(r:Reato) RETURN n.nome+' '+n.cognome as nome, r.name as reato"
            results = session.run(query).data()
            return results
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    # Recupera i nomi degli individui e dei reati associati alle relazioni con un nome specifico o cognome corrispondente.
    # Args:
    #     name (str): Nome o cognome da cercare nelle relazioni.
    # Returns:
    #     List[dict]: Una lista di risultati contenenti i nomi degli individui e i nomi dei reati associati.
    def getNomeIndividuoCrimeStartWith(self, name) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = "MATCH(n:Individuo)-[rel:ImputatoDi|Condannato]->(r:Reato) WHERE n.nome =~ $name or n.cognome =~ $name RETURN DISTINCT n.nome as nome, n.cognome as cogn"
            results = session.run(query, name=name).data()
            return results
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    # Recupera gli ID degli individui e dei reati associati alle relazioni.
    # Args: none
    # Returns:
    #     List[str]: Una lista di ID degli individui e reati associati alle relazioni.
    def getAllIdsIndividuoReato(self) -> List[str]:
        try:
            session = Neo4jDriver.get_session()
            query = "MATCH(n:Individuo)-[rel:ImputatoDi|Condannato]->(r:Reato) RETURN distinct substring(n.nodeId, 1) + ',' + r.nodeId as id"
            results = session.run(query).data()
            return [result["id"] for result in results]
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    # Recupera i nomi degli individui associati alle relazioni Condannati o Imputati di reati.
    # Args: none
    # Returns:
    #     List[str]: Una lista di nomi degli individui associati alle relazioni.
    def getNomiCrime(self) -> List[str]:
        try:
            session = Neo4jDriver.get_session()
            query = "MATCH(n:Individuo)-[rel:Condannato|ImputatoDI]->(r:Reato) RETURN n.nome+' '+n.cognome as nome"
            results = session.run(query).data()
            return [result["nome"] for result in results]
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    # Calcola la betweenness centrality degli individui nelle relazioni Condannati o Imputati.
    # Args: none
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni sulla betweenness centrality.
    def betweenness(self) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = "CALL algo.betweenness.stream('Individuo', 'Condannato|ImputatoDi', {direction: 'both'}) YIELD nodeId, centrality MATCH (individuo:Individuo) WHERE id(individuo) = nodeId RETURN individuo.nodeId AS id, centrality AS score ORDER BY centrality DESC"
            results = session.run(query).data()
            return results
        except Exception as e:
            print

"""