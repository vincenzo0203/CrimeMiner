from app.Neo4jConnection import Neo4jDriver
import json
from app.Models.Entity.IndividuoModel import IndividuoModel
from neomodel import UniqueIdProperty, db


class IndividuoIntercettazioneAmbRepository:

    @staticmethod
    def graph():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) RETURN n.nodeId AS n, i.nodeId AS e"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
    
    @staticmethod
    def graph_id():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) RETURN r.sourceNodeId AS n, r.targetNodeId AS e"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    @staticmethod
    def get_all_nomi_individuo_intercettazione_ambientale():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) WHERE exists(n.nome) OR exists(n.cognome) RETURN n.nome + ' ' + n.cognome AS nome, i.name AS intercettazione"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    @staticmethod
    def get_nome_individuo_amb_start_with(name):
        try:
            session = Neo4jDriver.get_session()
            cypher_query = f"MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) WHERE n.nome =~ '{name}' OR n.cognome =~ '{name}' RETURN DISTINCT n.nome AS nome, n.cognome AS cogn"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    @staticmethod
    def get_all_nomi_individuo_intercettazione_amb():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) RETURN DISTINCT n.nome + ' ' + n.cognome AS nome"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    @staticmethod
    def get_all_ids_individuo_intercettazione_amb():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo)-[r:Presente]->(i:IntercettazioneAmb) RETURN DISTINCT substring(n.nodeId,1) + ',' + substring(i.nodeId,1) AS id"
            results = session.run(cypher_query).data()
            return results

        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

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