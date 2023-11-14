import typing
from app.Neo4jConnection import Neo4jDriver
import json
from app.Models.Relationship.HaChiamatoModel import HaChiamato
from app.Models.Entity.IndividuoModel import Individuo
from datetime import datetime

#Questa classe fornisce metodi per eseguire query su un database Neo4j contenente informazioni sugli individui e le chiamate tra di loro.
class IndividuoIntercettazioneRepository:


# Recupera le informazioni sull'arco identificato da edge_id
# Args:
#     edge_id (str): L'ID dell'arco da cercare
# Returns:
#     list: Una lista di risultati contenenti le informazioni sull'arco.

    @staticmethod
    def getEdge_Info(edge_id):
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH ()-[r:HaChiamato]->() WHERE r.edgeId = $edgeId RETURN DISTINCT properties(r) AS r"
            results = session.run(cypher_query,{"edgeId":edge_id}).data()
            return results
          
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

# Recupera tutti i nodi e gli archi del grafo, inclusi i nodi Individuo e gli archi HaChiamato, in un formato compatibile con Cytoscape.
# Args: none
# Returns:
#     dict: Un dizionario contenente nodi ed archi, strutturato per l'uso con Cytoscape.

    @staticmethod
    def getAll_nodes_and_edge():
        try:
            session = Neo4jDriver.get_session()
            # Query per ottenere i nodi
            nodes_query = "MATCH (n:Individuo)  WHERE (n)-[:HaChiamato]->() OR (n)<-[:HaChiamato]-() RETURN DISTINCT n.nodeId AS id" 
            nodes = session.run(nodes_query).data()
        
            # Query per ottenere gli archi
            edges_query = "MATCH (n:Individuo)-[r:HaChiamato]->(m:Individuo) RETURN r.sourceNodeId AS source, r.targetNodeId AS target, r.edgeId AS id"
            edges = session.run(edges_query).data()
        
            # Creazione della struttura dati JSON compatibile con Cytoscape
            cytoscape_data = {
                "nodes": [{"data": {"id": node["id"] ,"size": 1}} for node in nodes],
                "edges": [{"data": edge} for edge in edges]
            }
        
            return cytoscape_data
    
        except Exception as e:
                # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
                print("Errore durante l'esecuzione della query Cypher:", e)
                return []  # o solleva un'eccezione   
            
#Metrics
#Prima creare il grafo in questo modo CALL gds.graph.project('IndividuoIntercettazioni', 'Individuo', 'HaChiamato')
#e poi 
#Closeness query
#CALL gds.closeness.stream('IndividuoIntercettazioni')
#YIELD nodeId, score
#WITH gds.util.asNode(nodeId) AS node, score
#RETURN node.nodeId AS id, score AS score
#ORDER BY score DESC;
#Inserire nel file conf di neo4j dbms.security.procedures.unrestricted=apoc.*, gds.*


    #Calcola la closeness dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def Closeness():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.closeness.stream('IndividuoIntercettazioni') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato]->() OR (node)<-[:HaChiamato]-() RETURN DISTINCT node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.betweenness.stream('IndividuoIntercettazioni') YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato]->() OR (node)<-[:HaChiamato]-() RETURN node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.pageRank.stream('IndividuoIntercettazioni', { maxIterations: 10, relationshipTypes: ['HaChiamato'] }) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato]->() OR (node)<-[:HaChiamato]-() RETURN node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.pageRank.stream('IndividuoIntercettazioni', {maxIterations: 10,dampingFactor: 0.85,relationshipWeightProperty: 'mesiTotali'})YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato]->() OR (node)<-[:HaChiamato]-() RETURN node.nodeId AS id, score AS size"
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
            cypher_query = "CALL gds.degree.stream('IndividuoIntercettazioni', {orientation: 'UNDIRECTED'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato]->() OR (node)<-[:HaChiamato]-()  RETURN node.nodeId AS id, score AS size;"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        
    #Calcola In Degree dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def InDegree():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.degree.stream('IndividuoIntercettazioni', {orientation: 'REVERSE'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato]->() OR (node)<-[:HaChiamato]-()  RETURN node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
    
    #Calcola In Degree dei vari nodi attraverso l'utilizzo del plugin graph data science di neo4j
    @staticmethod
    def OutDegree():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "CALL gds.degree.stream('IndividuoIntercettazioni', {orientation: 'NATURAL'}) YIELD nodeId, score WITH gds.util.asNode(nodeId) AS node, score WHERE (node)-[:HaChiamato]->() OR (node)<-[:HaChiamato]-()  RETURN node.nodeId AS id, score AS size"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        

    @staticmethod
    def CreaIntercettazione(data,id1,id2):
        try:
            times=int(IndividuoIntercettazioneRepository.CalcolaTimeStamp())
            edge=IndividuoIntercettazioneRepository.get_max_edge_id()

            nodo1 = Individuo.nodes.get(nodeId=id1)
            nodo2 = Individuo.nodes.get(nodeId=id2)

            haChiamato_model = HaChiamato()
            haChiamato_model.timestamp = times
            haChiamato_model.edgeId = edge
            haChiamato_model.mesiCondanna=0
            haChiamato_model.mesiImputati=0
            haChiamato_model.mesiTotali=0
            haChiamato_model.data = data.get("Data")
            haChiamato_model.entityType = "HaChiamato"
            haChiamato_model.name = "Name"
            haChiamato_model.ora = data.get("Ora")
            haChiamato_model.durata = data.get("Durata")
            haChiamato_model.contenuto = data.get("Contenuto")
            haChiamato_model.sourceNodeId = id1
            haChiamato_model.targetNodeId = id2


            nodo1.haChiamatoList.connect(haChiamato_model)
            nodo2.haChiamatoList.connect(haChiamato_model)

            haChiamato_model.save()



            return haChiamato_model.edgeId
        
        except Exception as e:
            # Gestione degli altri errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante il salvataggio dell'intercettazione:", e)
            return []
        
    @staticmethod
    def CalcolaTimeStamp():
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        return timestamp

    # Ottiene tutti i nodeId presenti nel database e ritorna il massimo degli id
    # Args:
    #   none
    # Returns:
    #   string: il massimo nodeId presente
    @staticmethod
    def get_max_edge_id():
            max_edge_id = None
            max_number = -1  # Un valore iniziale molto basso per confronto
            try:
                session = Neo4jDriver.get_session()
                result = session.run("MATCH ()-[r:HaChiamato]->() RETURN r.edgeId AS edgeId")
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

# Restituisce un grafo di tutti gli individui e delle chiamate tra di loro.
# Args: none
# Returns:
#     str: Una rappresentazione JSON del grafo contenente nodi e archi.

    def getGraph_Individui_HaChiamato(self) -> typing.Iterator[typing.Dict[str, str]]:
        try:
            session = Neo4jDriver.get_session()
            query = ""MATCH p= (user:Individuo)-[r:HaChiamato]->(m:Individuo) RETURN nodes(p) as n, relationships(p)[0] as e""
            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)
            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione


# Restituisce un elenco di tutte le coppie di ID di individui che hanno effettuato chiamate tra di loro.
# Args: none
# Returns:
#     str: Una rappresentazione JSON dell'elenco di coppie di ID.

    def getAll_Ids_IndividuoIntercettazione(self) -> typing.List[str]:
        try: 
            session = Neo4jDriver.get_session()
            query = ""match(n:Individuo)-[r:HaChiamato]->()where n.nome=\"DURANTE\" and n.cognome=\"SINISCALCHI\" OR n.nome=\"BIAGIO\" and n.cognome=\"CAVA\" RETURN toString(r.sourceNodeId) as n, toString(r.targetNodeId) as k""
            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)
            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

# Restituisce un grafo di tutti gli individui e delle chiamate tra di loro, con gli ID degli individui al posto dei loro nomi.
# Args: none
# Returns:
#     str: Una rappresentazione JSON del grafo contenente gli ID degli individui.

    def getGraph_Ids_Individui_HaChiamato(self) -> typing.Iterator[typing.Dict[str, str]]:
        try:
            session = Neo4jDriver.get_session()
            query = ""MATCH p= (user:Individuo)-[r:HaChiamato]->(m:Individuo) RETURN user.nodeId as n, m.nodeId as k""
            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)
            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

# Restituisce un grafo di tutti gli individui e delle chiamate tra di loro, con i nomi e i cognomi degli individui al posto dei loro ID.
# Args: none
# Returns:
#     str: Una rappresentazione JSON del grafo contenente i nomi e cognomi degli individui.

    def getGraph_NomeCognome_Individui_HaChiamato(self) -> typing.Iterator[typing.Dict[str, str]]:
        try:
            session = Neo4jDriver.get_session()
            query = ""MATCH p= (user:Individuo)-[r:HaChiamato]->(m:Individuo) RETURN user.nome+' '+user.cognome as n, m.nome+' '+m.cognome as k""
            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)
            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
    
# Restituisce il nome e il cognome di un individuo dato il suo ID.
# Args:
#     id1 (str): L'ID dell'individuo da cercare.
# Returns:
#     str: Una rappresentazione JSON contenente il nome e il cognome dell'individuo.

    def getNome_Cognome_ById(self, id1: str) -> typing.List[str]:
        try:
            session = Neo4jDriver.get_session()
            query = ""MATCH (user:Individuo) where user.nodeId={id} return user.nome+' '+user.cognome as n""
            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)
            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

# Restituisce un grafo di tutti gli individui e delle chiamate tra di loro, filtrato in base ai nomi e ai cognomi di due individui.
# Args:
#     nome1 (str): Nome del primo individuo.
#     cogn1 (str): Cognome del primo individuo.
#     nome2 (str): Nome del secondo individuo.
#     cogn2 (str): Cognome del secondo individuo.
# Returns:
#     str: Una rappresentazione JSON del grafo filtrato.

    def getGraph_Filtered_ById(
        self, nome1: str, cogn1: str, nome2: str, cogn2: str
    ) -> typing.Iterator[typing.Dict[str, str]]:
        try:
            session = Neo4jDriver.get_session()
            query = ""match(n:Individuo)-[r:HaChiamato]->()where n.nome={nome1} and n.cognome={cogn1} OR n.nome={nome2} and n.cognome={cogn2} RETURN toString(r.sourceNodeId) as n, toString(r.targetNodeId) as k""

            results = session.run(query, nome1=nome1, cogn1=cogn1, nome2=nome2, cogn2=cogn2).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)

            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        
# Restituisce l'ID di un individuo dato il suo nome e cognome.
# Args:
#     nome (str): Nome dell'individuo.
#     cognome (str): Cognome dell'individuo.
# Returns:
#     str: Una rappresentazione JSON contenente l'ID dell'individuo.

    def getId_Individuo_By_NomeCognome(
        self, nome: str, cognome: str
    ) -> typing.List[str]:
       
        try:
            session = Neo4jDriver.get_session()
            query = ""match(n:Individuo) where n.nome={nome} and n.cognome={cognome} return n.nodeId""

            results = session.run(query, nome=nome, cognome=cognome).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)

            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

# Restituisce la centralità di betweenness di tutti gli individui.
# Returns:
#     str: Una rappresentazione JSON della centralità di betweenness per gli individui.

    def betweenness(self) -> typing.Iterator[typing.Dict[str, str]]:
        try:
            session = Neo4jDriver.get_session()
            query = ""CALL algo.betweenness.stream(\"Individuo\", \"HaChiamato\", {direction:\"both\"})\n"
                    + "YIELD nodeId, centrality\n"
                    + "MATCH (individuo:Individuo) WHERE id(individuo) = nodeId\n"
                    + "RETURN individuo.nodeId AS id,centrality AS score\n"
                    + "ORDER BY centrality DESC;""

            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)

            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

#Metrics
#Prima creare il grafo in questo modo CALL gds.graph.project('IndividuoIntercettazioni', 'Individuo', 'HaChiamato')
#e poi 
#Closeness query CALL gds.closeness.stream('IndividuoIntercettazioni')
#YIELD nodeId, score
#WITH gds.util.asNode(nodeId) AS node, score
#RETURN node.nodeId AS id, score AS score
#ORDER BY score DESC;

"""