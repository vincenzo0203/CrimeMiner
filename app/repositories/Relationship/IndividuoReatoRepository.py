from typing import List
from app.Neo4jConnection import Neo4jDriver
from app.repositories.Entity.ReatoRepository import ReatoRepository
from app.repositories.Entity.IndividuoRepository import IndividuoRepository
from app.Models.Relationship.CondannatoModel import Condannato
from app.Models.Relationship.ImputatoDiModel import ImputatoDi
from app.Models.Entity.IndividuoModel import Individuo
from app.Models.Entity.ReatoModel import Reato

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
            edges_query = "MATCH ()-[r]->() WHERE ()-[r:Condannato]->() OR ()-[r:ImputatoDi]->()  RETURN r.sourceNodeId as source, r.targetNodeId as target, r.edgeId as id, r.entityType AS classes"
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
    
    # Prende le informazioni riguardo un Individuo e di un Reato per il caricamento dei dati nella modale
    # Returns:
    #     List[dict]: Una lista di risultati contenenti le informazioni su tutti gli individui e reati.
    @staticmethod
    def getModalIndividuoReato():
        resultIndividual=IndividuoRepository.find_all_surname_name()
        resultCrime=ReatoRepository.find_all_name()
        
        return resultIndividual + resultCrime
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
            cypher_query = "CALL gds.closeness.stream('IndividuoReatiCloBet') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:ImputatoDi|Condannato]->() OR (node)<-[:ImputatoDi|Condannato]-() RETURN node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.betweenness.stream('IndividuoReatiCloBet') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:ImputatoDi|Condannato]->() OR (node)<-[:ImputatoDi|Condannato]-() RETURN node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.pageRank.stream('IndividuoReati', {maxIterations: 10,relationshipTypes: ['ImputatoDi', 'Condannato']}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:ImputatoDi|Condannato]->() OR (node)<-[:ImputatoDi|Condannato]-() RETURN node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.pageRank.stream('IndividuoReatiCloBet', {maxIterations: 10, dampingFactor: 0.85,relationshipWeightProperty: 'mesiTotali'})YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:ImputatoDi|Condannato]->() OR (node)<-[:ImputatoDi|Condannato]-() RETURN DISTINCT node.nodeId AS id, score AS size;"
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
            cypher_query = "CALL gds.degree.stream('IndividuoReati',{orientation:'UNDIRECTED'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:ImputatoDi|Condannato]->() OR (node)<-[:ImputatoDi|Condannato]-() RETURN DISTINCT node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.degree.stream('IndividuoReati',{orientation:'REVERSE'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:ImputatoDi|Condannato]->() OR (node)<-[:ImputatoDi|Condannato]-() RETURN DISTINCT node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.degree.stream('IndividuoReati',{orientation:'NATURAL'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:ImputatoDi|Condannato]->() OR (node)<-[:ImputatoDi|Condannato]-() RETURN DISTINCT node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

    @staticmethod
    def CreaImputazione(id_individuo,id_reato):
        try:
            ImputatoDi_model = ImputatoDi()
            edge=IndividuoReatoRepository.get_max_edge_imputatoDi_id()

            nodo1 = Individuo.nodes.get(nodeId=id_individuo)
            nodo2 = Reato.nodes.get(nodeId=id_reato)

            ImputatoDi_model = nodo1.CondannatoList.connect(nodo2)

            ImputatoDi_model.edgeId = edge

            mesiCondanna = ((nodo2.maxMonths + nodo2.minMonths )/2)
          
            ImputatoDi_model.mesiTotali= nodo1.mesiTotali + mesiCondanna

            nodo1.mesiTotali = nodo1.mesiTotali + mesiCondanna

            nodo1.save()

            ImputatoDi_model.entityType = "ImputatoDi"
            ImputatoDi_model.sourceNodeId = id_individuo
            ImputatoDi_model.targetNodeId = id_reato

            ImputatoDi_model.save()

            return ImputatoDi_model.edgeId
        
        except Exception as e:
            # Gestione degli altri errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante il salvataggio dell'intercettazione:", e)
            return []
        
    @staticmethod
    def CreaCondanna(id_individuo,id_reato):
        try:
            Condannato_model = Condannato()
            edge=IndividuoReatoRepository.get_max_edge_condannato_id()

            nodo1 = Individuo.nodes.get(nodeId=id_individuo)
            nodo2 = Reato.nodes.get(nodeId=id_reato)

            Condannato_model = nodo1.CondannatoList.connect(nodo2)

            Condannato_model.edgeId = edge

            mesiCondanna = ((nodo2.maxMonths + nodo2.minMonths )/2)
          
            Condannato_model.mesiTotali= nodo1.mesiTotali + mesiCondanna

            nodo1.mesiTotali = nodo1.mesiTotali + mesiCondanna

            nodo1.save()

            Condannato_model.entityType = "Condannato"
            Condannato_model.sourceNodeId = id_individuo
            Condannato_model.targetNodeId = id_reato

            Condannato_model.save()

            return Condannato_model.edgeId
        
        except Exception as e:
            # Gestione degli altri errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante il salvataggio dell'intercettazione:", e)
            return []
        

    # Ottiene tutti i nodeId presenti nel database e ritorna il massimo degli edge id
    # Args:
    #   none
    # Returns:
    #   string: il massimo edge nodeId presente
    @staticmethod
    def get_max_edge_condannato_id():
            max_edge_id = None
            max_number = -1  # Un valore iniziale molto basso per confronto
            try:
                session = Neo4jDriver.get_session()
                result = session.run("MATCH ()-[r:Condannato]->() RETURN r.edgeId AS edgeId")
                for record in result:
                    edge_id = record["edgeId"]
                    # Estrai la parte numerica dalla stringa edgeId
                    numeric_part = int(edge_id[2:])  # Assume che i primi due caratteri siano "IT"
                    # Confronto con il massimo attuale
                    if numeric_part > max_number:
                        max_number = numeric_part
                        max_edge_id = edge_id

                
                result_numeric_part=max_number+1
                result_edge_id=f"IT{result_numeric_part}"

                return result_edge_id
            except Exception as e:
                # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
                print("Errore durante l'esecuzione della query Cypher:", e)
                return None  # Restituisci None anziché una lista vuota in caso di errore
            


    @staticmethod
    def get_max_edge_imputatoDi_id():
            max_edge_id = None
            max_number = -1  # Un valore iniziale molto basso per confronto
            try:
                session = Neo4jDriver.get_session()
                result = session.run("MATCH ()-[r:ImputatoDi]->() RETURN r.edgeId AS edgeId")
                for record in result:
                    edge_id = record["edgeId"]
                    # Estrai la parte numerica dalla stringa edgeId
                    numeric_part = int(edge_id[2:])  # Assume che i primi due caratteri siano "IT"
                    # Confronto con il massimo attuale
                    if numeric_part > max_number:
                        max_number = numeric_part
                        max_edge_id = edge_id

                
                result_numeric_part=max_number+1
                result_edge_id=f"IT{result_numeric_part}"

                return result_edge_id
            except Exception as e:
                # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
                print("Errore durante l'esecuzione della query Cypher:", e)
                return None  # Restituisci None anziché una lista vuota in caso di errore








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