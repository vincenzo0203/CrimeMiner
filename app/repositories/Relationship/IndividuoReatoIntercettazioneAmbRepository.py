from typing import Iterable
from app.Neo4jConnection import Neo4jDriver
from app.repositories.Entity.IndividuoRepository import IndividuoRepository
from app.repositories.Entity.IntercettazioneAmbRepository import IntercettazioneAmbRepository
from app.repositories.Entity.ReatoRepository import ReatoRepository

#Questa classe fornisce metodi per l'accesso ai dati relativi alle relazioni tra individui, reati e intercettazioni ambientali.
class IndividuoReatoIntercettazioneAmbRepository:

# Recupera un grafo di relazioni tra individui e reati nell'ambito di intercettazioni ambientali.
# Args: none
# Returns:
# list: Una lista di risultati contenenti le informazioni sul grafo
    def getRelationships_IndividuiReati_IntercettazioniAmb(self) -> Iterable[dict]:       
        try:
            session = Neo4jDriver.get_session()
            individuo_nodes_query = "MATCH (n:Individuo) WHERE (n:Individuo)-[:HaChiamato|Condannato|ImputatoDi|Presente]->() OR (n:Individuo)<-[:HaChiamato]->() RETURN DISTINCT n.nodeId AS id, n.entityType AS classes"
            individuo_nodes = session.run(individuo_nodes_query).data()

            reato_nodes_query = "MATCH (r:Reato) WHERE ()-[:Condannato|ImputatoDi]->(r:Reato) RETURN DISTINCT r.nodeId AS id, r.entityType AS classes"
            reato_nodes = session.run(reato_nodes_query).data()

            intercettazioni_nodes_query = "MATCH (i:IntercettazioneAmb) WHERE ()-[:Presente]->(i:IntercettazioneAmb) RETURN DISTINCT i.nodeId AS id, i.entityType AS classes"
            intercettazioni_nodes = session.run(intercettazioni_nodes_query).data()

            nodes = individuo_nodes + reato_nodes + intercettazioni_nodes

            # Query per ottenere gli archi
            edges_query = "MATCH ()-[r:HaChiamato|Condannato|ImputatoDi|Presente]->() RETURN r.sourceNodeId as source, r.targetNodeId as target, r.edgeId as id, r.entityType AS classes"
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

    # Trova le informazioni riguardo un Individuo o un'Intercettazione Ambientale tramite un ID
    # Args: <str> id
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni su tutti gli individui/intercettazioniAmb.
    @staticmethod
    def getIndividuo_o_Intercettazione_o_Reato(id):
        if(id.startswith("IA")):
            result=IntercettazioneAmbRepository.get_node_info_by_nodeId(id)
        else:
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
    def getEdge_Info_More(edge_id):
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH ()-[r:Condannato|ImputatoDi|Presente|HaChiamato]->() WHERE r.edgeId = $edgeId RETURN DISTINCT properties(r) AS r"
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
            cypher_query = "CALL gds.closeness.stream('IndividuoReatoIntercettazioneAmbCloBet') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato|ImputatoDi|Condannato|Presente]->() OR (node)<-[:HaChiamato|ImputatoDi|Condannato|Presente]-() RETURN DISTINCT node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.betweenness.stream('IndividuoReatoIntercettazioneAmbCloBet') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato|ImputatoDi|Condannato|Presente]->() OR (node)<-[:HaChiamato|ImputatoDi|Condannato|Presente]-() RETURN DISTINCT node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.pageRank.stream('IndividuoReatoIntercettazioneAmb', { maxIterations: 10, relationshipTypes: ['ImputatoDi', 'Condannato','HaChiamato','Presente'] }) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:Presente|Condannato|ImputatoDi|HaChiamato]->() OR (node)<-[:Presente|Condannato|ImputatoDi|HaChiamato]-() RETURN node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.pageRank.stream('IndividuoReatoIntercettazioneAmbCloBet', {maxIterations: 10, dampingFactor: 0.85,relationshipWeightProperty: 'mesiTotali'})YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:Presente|Condannato|ImputatoDi|HaChiamato]->() OR (node)<-[:Presente|Condannato|ImputatoDi|HaChiamato]-() RETURN DISTINCT node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.degree.stream('IndividuoReatoIntercettazioneAmb', {orientation: 'UNDIRECTED'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato|ImputatoDi|Condannato|Presente]->() OR (node)<-[:HaChiamato|ImputatoDi|Condannato|Presente]-()  RETURN node.nodeId AS id, score AS size order by score desc"
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
            cypher_query = "CALL gds.degree.stream('IndividuoReatoIntercettazioneAmb', {orientation: 'REVERSE'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato|ImputatoDi|Condannato|Presente]->() OR (node)<-[:HaChiamato|ImputatoDi|Condannato|Presente]-()  RETURN node.nodeId AS id, score AS size order by score desc"
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
            cypher_query = "CALL gds.degree.stream('IndividuoReatoIntercettazioneAmb', {orientation: 'NATURAL'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato|ImputatoDi|Condannato|Presente]->() OR (node)<-[:HaChiamato|ImputatoDi|Condannato|Presente]-()  RETURN node.nodeId AS id, score AS size order by score desc"
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