from typing import Iterable
from app.Neo4jConnection import Neo4jDriver
import json

#Questa classe fornisce metodi per l'accesso ai dati relativi alle relazioni tra individui, reati e intercettazioni ambientali.
class IndividuoReatoIntercettazioneAmbRepository:

# Recupera un grafo di relazioni tra individui e reati nell'ambito di intercettazioni ambientali.
# Args: none
# Returns:
# list: Una lista di risultati contenenti le informazioni sul grafo
    def getRelationships_IndividuiReati(self) -> Iterable[dict]:       
        try:
            session = Neo4jDriver.get_session()
            query = "MATCH p=()-->() RETURN nodes(p) as n, relationships(p)[0] as e" 
            result = session.run(query).data()
            return result
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query per ottenere i graph:", e)
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
            cypher_query = "CALL gds.betweenness.stream('IndividuoIntercettazioni') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score RETURN node.nodeId AS id, score AS score ORDER BY score DESC;"
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

# Recupera un grafo di relazioni tra individui e reati nell'ambito di intercettazioni ambientali, utilizzando ID.
# Returns:
# list: Una lista di risultati contenenti le informazioni sul grafo con ID.
    def getRelationships_IndividuiReati_ID(self) -> Iterable[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = "MATCH p=()-[r:HaChiamato|Condannato|Presente|ImputatoDi]->() RETURN r.sourceNodeId as n, r.targetNodeId as e, r.agg_id as k"
            result = session.run(query).data
            return result
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query per ottenere i graph:", e)
            return []  # o solleva un'eccezione

# Calcola la centralità di intermediazione (betweenness centrality) per tutti gli individui nel grafo.
# Args: none
# Returns:
# list: Una lista di risultati contenenti la centralità di intermediazione per gli individui.
    def betweenness(self) -> Iterable[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = ""CALL algo.betweenness.stream("Individuo", "HaChiamato|Condannato|Presente|Presente", {direction:"both"})
                    YIELD nodeId, centrality
                    MATCH (individuo:Individuo) WHERE id(individuo) = nodeId
                    RETURN individuo.nodeId AS id, centrality AS score
                    ORDER BY centrality DESC;""
            result = session.run(query).data()
            return result
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query per ottenere la betweenness centrality:", e)
            return []  # o solleva un'eccezione


# Calcola la centralità di vicinanza (closeness centrality) per tutti gli individui nel grafo.
# Args: none
# Returns:
# list: Una lista di risultati contenenti la centralità di vicinanza per gli individui.
    def closeness(self) -> Iterable[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = ""CALL algo.closeness.stream("Individuo", "HaChiamato|Condannato|Presente|Presente", {direction:"both"})
                    YIELD nodeId, centrality
                    MATCH (individuo:Individuo) WHERE id(individuo) = nodeId
                    RETURN individuo.nodeId AS id, centrality AS score
                    ORDER BY centrality DESC;""
            result = session.run(query).data()
            return result
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query per ottenere la closeness centrality:", e)
            return []  # o solleva un'eccezione


# Calcola il PageRank per tutti gli individui nel grafo.
# Returns:
# list: Una lista di risultati contenenti i punteggi del PageRank per gli individui.
    def page_rank(self) -> Iterable[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = ""OPTIONAL MATCH (n1)
                    WITH collect(distinct n1) as nodes
                    CALL apoc.algo.pageRankWithConfig(nodes, {iterations: 10, types: 'HaChiamato|Condannato|Presente|Presente'}) YIELD node, score
                    RETURN node.nodeId as id, score ORDER BY score DESC;""
            result = session.run(query).data()
            return result
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query per ottenere il page rank:", e)
            return []  # o solleva un'eccezione

# Calcola il PageRank pesato per tutti gli individui nel grafo.
# Returns:
# list: Una lista di risultati contenenti i punteggi del PageRank pesato per gli individui.
    def weighted_page_rank(self) -> Iterable[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = ""//PRE CALCULATED WPR
                    MATCH (n)
                    RETURN n.nodeId as id, n.wpr_pers as score ORDER BY score DESC;""
            result = session.run(query).data()
            return result
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query per ottenere il weighted page rank:", e)
            return []  # o solleva un'eccezione

    
# Calcola il grado di ogni individuo nel grafo.
# Returns:
# list: Una lista di risultati contenenti il grado di ciascun individuo.
    def degree(self) -> Iterable[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = ""MATCH (n)
                    WITH n, size((n)-[]->()) as score
                    RETURN n.nodeId as id, score ORDER BY score DESC;""
            result = session.run(query).data()
            return result
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query per ottenere il degree:", e)
            return []  # o solleva un'eccezione

    
# Calcola il diametro del grafo, ovvero la lunghezza del percorso più lungo tra due individui.
# Returns:
# list: Una lista di risultati contenenti il diametro del grafo.
    def diameter(self) -> Iterable[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = ""MATCH (a:Individuo), (b:Individuo) WHERE id(a) > id(b)
                    MATCH p=shortestPath((a)-[:Codannato|ImputatoDi|HaChiamato*]-(b))
                    RETURN length(p) AS len, extract(x IN nodes(p) | x.name) AS path
                    ORDER BY len DESC LIMIT 1;""
            result = session.run(query).data()
            return result
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query per ottenere il diameter:", e)
            return []  # o solleva un'eccezione

"""