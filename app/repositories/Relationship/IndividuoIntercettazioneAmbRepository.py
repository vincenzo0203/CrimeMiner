from typing import List
from app.Neo4jConnection import Neo4jDriver
from app.Models.Entity.IndividuoModel import Individuo
from neomodel import UniqueIdProperty, db
import json

from app.repositories.Entity.IndividuoRepository import IndividuoRepository
from app.repositories.Entity.IntercettazioneAmbRepository import IntercettazioneAmbRepository

#Questa classe fornisce metodi per eseguire query su un database Neo4j che contiene dati sugli individui e le intercettazioni ambientali.
class IndividuoIntercettazioneAmbRepository:


    # Recupera un grafo delle relazioni tra individui e intercettazioni (Presente).
    # Args: none
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni sul grafo.
    def getGraph_IndividuiIntercettazioneAmb(self) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            individuo_nodes_query = "MATCH (n:Individuo) WHERE (n:Individuo)-[:Presente]->() RETURN DISTINCT n.nodeId AS id, n.entityType AS classes"
            individuo_nodes = session.run(individuo_nodes_query).data()

            intercettazioni_nodes_query = "MATCH (i:IntercettazioneAmb) WHERE ()-[:Presente]->(i:IntercettazioneAmb) RETURN DISTINCT i.nodeId AS id, i.entityType AS classes"
            intercettazioni_nodes = session.run(intercettazioni_nodes_query).data()

            nodes = individuo_nodes + intercettazioni_nodes

            # Query per ottenere gli archi
            edges_query = "MATCH ()-[r]->() WHERE ()-[r:Presente]->() RETURN r.sourceNodeId as source, r.targetNodeId as target, r.edgeId as id"
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
    def getIndividuo_o_Intercettazione(id):
        if(id.startswith("IA")):
            result=IntercettazioneAmbRepository.get_node_info_by_nodeId(id)
        else:
            result=IndividuoRepository.get_node_info_by_nodeId(id)
            
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
            cypher_query = "MATCH ()-[r:Presente]->() WHERE r.edgeId = $edgeId RETURN DISTINCT properties(r) AS r"
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
            cypher_query = "CALL gds.closeness.stream('IndividuoIntercettazioneAmbCloBet') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:Presente]->() OR (node)<-[:Presente]-() RETURN DISTINCT node.nodeId AS id, score AS size;"
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
            cypher_query = "CALL gds.betweenness.stream('IndividuoIntercettazioneAmbCloBet') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:Presente]->() OR (node)<-[:Presente]-() RETURN node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.pageRank.stream('IndividuoIntercettazioneAmb', { maxIterations: 10, relationshipTypes: ['Presente'] }) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:Presente]->() OR (node)<-[:Presente]-() RETURN node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.pageRank.stream('IndividuoIntercettazioneAmb', {maxIterations: 10,dampingFactor: 0.85,relationshipWeightProperty: 'mesiTotali'})YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:Presente]->() OR (node)<-[:Presente]-() RETURN node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.degree.stream('IndividuoIntercettazioneAmb', {orientation: 'UNDIRECTED'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:Presente]->() OR (node)<-[:Presente]-()  RETURN node.nodeId AS id, score AS size;"
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
            cypher_query = "CALL gds.degree.stream('IndividuoIntercettazioneAmb', {orientation: 'REVERSE'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:Presente]->() OR (node)<-[:Presente]-()  RETURN node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.degree.stream('IndividuoIntercettazioneAmb', {orientation: 'NATURAL'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:Presente]->() OR (node)<-[:Presente]-()  RETURN node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        

    @staticmethod
    def CreaPresenteIntercettazioneAmb(data,idIndividuo,IdIntercettazioneAmb):
        try:
            print("qualcosa")
        
        except Exception as e:
            # Gestione degli altri errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante il salvataggio di PresenteIntercettazioneAmb:", e)
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
                numeric_part = int(node_id[1:])

                # Confronto con il massimo attuale
                if numeric_part > max_number:
                    max_number = numeric_part
                    max_node_id = node_id

            result_numeric = max_number + 1
            result_node_id = f"I{result_numeric}"

            return result_node_id
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return None  # Restituisci None anziché una lista vuota in caso di errore

    @staticmethod
    def convert_and_save_to_json():
        try:
            session = Neo4jDriver.get_session()

            # Query per ottenere i nodi degli individui
            query_individui = "MATCH (i:Individuo) RETURN i.nodeId AS individuoNodeId, i.nome AS individuoNome, i.cognome AS individuoCognome"
            result_individui = session.run(query_individui)

            # Query per ottenere i nodi delle intercettazioni
            query_intercettazioni = "MATCH (i:IntercettazioneAmb) RETURN i.nodeId"
            result_intercettazioni = session.run(query_intercettazioni)

            # Unisci i risultati delle query
            nodes = []
            for record in result_individui:
                nodes.append({
                    "nodeId": record["individuoNodeId"],
                    "nome": record["individuoNome"],
                    "cognome": record["individuoCognome"]
                })

            for record in result_intercettazioni:
                nodes.append({
                    "nodeId": record["nodeId"]
                })

            # Crea il nuovo nodeId
            newNodeId = IndividuoIntercettazioneAmbRepository.get_max_node_id_AMB()

            # Costruisci la struttura JSON
            data = {
                "nodes": nodes,
                "newNodeId": newNodeId
            }

            # Salva i dati in un file JSON
            with open('output.json', 'w') as json_file:
                json.dump(data, json_file, indent=2)

            print("Dati convertiti con successo e salvati in output.json")

        except Exception as e:
            print("Errore durante la conversione dei dati:", e)

#################################################### NON UTILIZZATE (POSSIBILMENTE UTILI IN FUTURO) ##############################################################

"""
    
#Recupera tutti i collegamenti tra nodi Individuo e InterceptionAmb e restituisce gli ID dei nodi sorgente e di destinazione.
#Args: none
#Returns:
#   list: Una lista di tuple (n, e) rappresentanti gli ID dei nodi sorgente (n) e di destinazione (e).

    @staticmethod
    def getAllSourceNode_TargetNode():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) RETURN r.sourceNodeId AS n, r.targetNodeId AS e"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

#Recupera tutti i nomi completi di individui coinvolti in intercettazioni ambientali.
#Args: none
#Returns:
#   list: Una lista di tuple (nome, intercettazione) che rappresentano il nome completo dell'individuo e il nome dell'intercettazione.

    @staticmethod
    def getAll_nomiIndividuoInIntercettazioneAmb():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) WHERE exists(n.nome) OR exists(n.cognome) RETURN n.nome + ' ' + n.cognome AS nome, i.name AS intercettazione"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

#Trova individui il cui nome o cognome corrispondono a una stringa fornita.
#Args:
#   name (str): La stringa da cercare nei nomi e cognomi degli individui.
#Returns:
#   list: Una lista di tuple (nome, cogn) che rappresentano il nome e il cognome degli individui corrispondenti.

    @staticmethod
    def trovaIndividuiConNome_O_Cognome(name):
        try:
            session = Neo4jDriver.get_session()
            cypher_query = f"MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) WHERE n.nome =~ '{name}' OR n.cognome =~ '{name}' RETURN DISTINCT n.nome AS nome, n.cognome AS cogn"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
    
#Recupera nomi completi di tutti gli individui coinvolti in intercettazioni ambientali.
#Args: none
#   list: Una lista di nomi e cognomi completi degli individui nelle intercettazioni.

    @staticmethod
    def getAll_NomiCognomi_IndividuoIntercettazioneAmb():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) RETURN DISTINCT n.nome + ' ' + n.cognome AS nome"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

#Recupera gli ID dei nodi Individuo e InterceptionAmb coinvolti nelle intercettazioni ambientali.
#Args: none
#Returns:
#   list: Una lista di tuple (id) rappresentanti gli ID dei nodi Individuo e InterceptionAmb.

    @staticmethod
    def getAll_Ids_IndividuoIntercettazioneAmb():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) RETURN DISTINCT substring(n.nodeId,1) + ',' + substring(i.nodeId,1) AS id"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

#Calcola la centralità di betweenness per gli individui nel grafo
#Args: none
#Returns:
#   list: Una lista di tuple (id, score) rappresentanti l'ID degli individui e il punteggio di centralità di betweenness.

    @staticmethod
    def betweenness():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL algo.betweenness.stream('Individuo', 'Presente', {direction:'both'}) YIELD nodeId, centrality MATCH (individuo:Individuo) WHERE id(individuo) = nodeId RETURN individuo.nodeId AS id, centrality AS score ORDER BY centrality DESC"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

#Calcola la centralità di closeness per gli individui nel grafo
#Args: none
#Returns:
#   list: Una lista di tuple (id, score) rappresentanti l'ID degli individui e il punteggio di centralità di closeness.

    @staticmethod
    def closeness():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL algo.closeness.stream('Individuo', 'Presente', {direction:'both'}) YIELD nodeId, centrality MATCH (individuo:Individuo) WHERE id(individuo) = nodeId RETURN individuo.nodeId AS id, centrality AS score ORDER BY centrality DESC"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

#Calcola il punteggio di PageRank per gli individui nel grafo
#Args: none
#Returns:
#   list: Una lista di tuple (id, score) rappresentanti l'ID degli individui e il punteggio di PageRank.

    @staticmethod
    def page_rank():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n1:Individuo) WITH collect(distinct n1) as c1 MATCH (n2:IntercettazioneAmb) WITH collect(distinct n2) + c1 as nodes CALL apoc.algo.pageRankWithConfig(nodes, {iterations: 10, types: 'Presente'}) YIELD node, score RETURN node.nodeId AS id, score ORDER BY score DESC"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

#Calcola il punteggio di PageRank ponderato per gli individui nel grafo.
#Args: none
#Returns:
#   list: Una lista di tuple (id, score) rappresentanti l'ID degli individui e il punteggio di PageRank ponderato.

    @staticmethod
    def weighted_page_rank():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n1:Individuo) WITH collect(distinct n1) as c1 MATCH (n2:IntercettazioneAmb) WITH collect(distinct n2) + c1 as nodes CALL apoc.algo.pageRankWithConfig(nodes, {iterations: 10, types: 'Presente', weightProperty: 'mesiTotali'}) YIELD node, score RETURN node.nodeId AS id, score ORDER BY score DESC"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

#Calcola il grado dei nodi Individuo e InterceptionAmb nel grafo.
#Args: none
#Returns:
#   list: Una lista di tuple (id, score) rappresentanti l'ID dei nodi e il loro grado nel grafo.

    @staticmethod
    def degree():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) RETURN n.nodeId AS id, count(r) AS score ORDER BY score UNION MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) RETURN i.nodeId AS id, count(r) AS score ORDER BY score"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

#Calcola il diametro del grafo tra nodi Individuo.
#Args: none
#Returns:
#   list: Una lista di tuple (len, path) rappresentanti la lunghezza del percorso e il percorso più lungo tra nodi Individuo.

    @staticmethod
    def diameter():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (a:Individuo), (b:Individuo) WHERE id(a) > id(b) MATCH p=shortestPath((a)-[:Presente*]-(b)) RETURN length(p) AS len, extract(x IN nodes(p) | x.name) AS path ORDER BY len DESC LIMIT 1"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

"""