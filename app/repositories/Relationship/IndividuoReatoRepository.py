from typing import List
from app.Neo4jConnection import Neo4jDriver
from app.repositories.Entity.ReatoRepository import ReatoRepository
from app.repositories.Entity.IndividuoRepository import IndividuoRepository

# Questa classe fornisce metodi per recuperare informazioni sugli individui e i reati.
class IndividuoReatoRepository:

    # Recupera un grafo delle relazioni tra individui e reati (Condannati o Imputati).
    # Args: none
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni sul grafo.
    def getGraph_IndividuiReati(self) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            individuo_nodes_query = "MATCH (n:Individuo) WHERE (n:Individuo)-[:Condannato]->() OR (n:Individuo)-[:ImputatoDi]->() RETURN DISTINCT n.nodeId AS id, n.entityType AS classes"
            individuo_nodes = session.run(individuo_nodes_query).data()

            reato_nodes_query = "MATCH (r:Reato) WHERE ()-[:Condannato]->(r:Reato) OR ()-[:ImputatoDi]->(r:Reato) RETURN DISTINCT r.nodeId AS id, r.entityType AS classes"
            reato_nodes = session.run(reato_nodes_query).data()

            nodes = individuo_nodes + reato_nodes

            # Query per ottenere gli archi
            edges_query = "MATCH ()-[r]->() WHERE ()-[r:Condannato]->() OR ()-[r:ImputatoDi]->()  RETURN r.sourceNodeId as source, r.targetNodeId as target, r.edgeId as id"
            edges = session.run(edges_query).data()

            # Creazione della struttura dati JSON compatibile con Cytoscape
            cytoscape_data = {
                "nodes": [{"data": {"id": node["id"] ,"size": 1},"classes": node["classes"]} for node in nodes],
                "edges": [{"data": edge} for edge in edges]
            }
        
            return cytoscape_data
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
        
          # Trova le informazioni riguardo un Individuo o di un Reato tramite un ID
    # Args: <str> id
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni su tutti gli individui/reati.
    @staticmethod
    def getIndividuo_o_Reato(id):
        if(id.startswith("I")):
            result=IndividuoRepository.get_node_info_by_nodeId(id)
        else:
            result=ReatoRepository.getReato_Info_BynodeId(id)
            
        return result
    
    # Recupera le informazioni sull'arco identificato da edge_id
    # Args:
    #     edge_id (str): L'ID dell'arco da cercare
    # Returns:
    #     list: Una lista di risultati contenenti le informazioni sull'arco.

    @staticmethod
    def getEdge_Info(edge_id):
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH ()-[r:Condannato|ImputatoDi]->() WHERE r.edgeId = $edgeId RETURN DISTINCT properties(r) AS r"
            result = session.run(cypher_query,{"edgeId":edge_id}).data()
            return result
          
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione


     #Calcola la closeness dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def Closeness():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.closeness.stream('IndividuoIntercettazioni') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score RETURN node.nodeId AS id, score AS score ORDER BY score DESC;"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        
    #Calcola la Betweenness dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def Betweenness():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.betweenness.stream('IndividuoReati') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE 'Individuo' IN labels(node) RETURN node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
    


    #Calcola il Page Rank dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def PageRank():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.pageRank.stream('IndividuoIntercettazioni', { maxIterations: 10, relationshipTypes: ['HaChiamato'] }) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score RETURN node.nodeId AS id, score AS score ORDER BY score DESC;"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        
     #Calcola il Weighted Page Rank dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def WeightedPageRank():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.pageRank.stream('IndividuoIntercettazioni', {maxIterations: 10,dampingFactor: 0.85,relationshipWeightProperty: 'mesiTotali'})YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score RETURN node.nodeId AS id, score ORDER BY score DESC;"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

    #Calcola il Degree dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def Degree():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = ""
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        
    #Calcola il InDegree dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def InDegree():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = ""
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

    #Calcola il OutDegree dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def OutDegree():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = ""
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione









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