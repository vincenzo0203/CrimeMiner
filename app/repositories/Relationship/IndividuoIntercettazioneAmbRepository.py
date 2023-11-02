from app.Neo4jConnection import Neo4jDriver
import json
from app.Models.Entity.IndividuoModel import IndividuoModel
from neomodel import UniqueIdProperty, db

#Questa classe fornisce metodi per eseguire query su un database Neo4j che contiene dati sugli individui e le intercettazioni ambientali.
class IndividuoIntercettazioneAmbRepository:


#Recupera tutti gli individui presenti in intercettazioni ambientali e restituisce i loro ID.
#Args: none
# Returns:
#   list: Una lista di tuple (n, e) rappresentanti gli ID dei nodi Individuo (n) e InterceptionAmb (e).

    @staticmethod
    def getIndividuiInIntercettazioneAmb():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) RETURN n.nodeId AS n, i.nodeId AS e"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
    
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