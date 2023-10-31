from typing import List
from app.Neo4jConnection import Neo4jDriver

class IndividuoReatoRepository:

    def graph(self) -> List[dict]:
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

    def graphId(self) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = """
                    MATCH p=()-[r:ImputatoDi|Condannato]->()
                    RETURN r.sourceNodeId as n, r.targetNodeId as e
                """
            results = session.run(query).data()
            return results
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    def getAllNomiReato(self) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = """
                    MATCH p=(n:Individuo)-[c:ImputatoDi|Condannato]->(r:Reato)
                    RETURN n.nome+' '+n.cognome as nome, r.name as reato
                """
            results = session.run(query).data()
            return results
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    def getNomeIndividuoCrimeStartWith(self, name) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = """
                    MATCH(n:Individuo)-[rel:ImputatoDi|Condannato]->(r:Reato)
                    WHERE n.nome =~ $name or n.cognome =~ $name
                    RETURN DISTINCT n.nome as nome, n.cognome as cogn
                """
            results = session.run(query, name=name).data()
            return results
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    def getAllIdsIndividuoReato(self) -> List[str]:
        try:
            session = Neo4jDriver.get_session()
            query = """
                    MATCH(n:Individuo)-[rel:ImputatoDi|Condannato]->(r:Reato)
                    RETURN distinct substring(n.nodeId, 1) + ',' + r.nodeId as id
                """
            results = session.run(query).data()
            return [result["id"] for result in results]
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    def getNomiCrime(self) -> List[str]:
        try:
            session = Neo4jDriver.get_session()
            query = """
                    MATCH(n:Individuo)-[rel:Condannato|ImputatoDI]->(r:Reato)
                    RETURN n.nome+' '+n.cognome as nome
                """
            results = session.run(query).data()
            return [result["nome"] for result in results]
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    def betweenness(self) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = """
                    CALL algo.betweenness.stream('Individuo', 'Condannato|ImputatoDi', {direction: 'both'})
                    YIELD nodeId, centrality
                    MATCH (individuo:Individuo) WHERE id(individuo) = nodeId
                    RETURN individuo.nodeId AS id, centrality AS score
                    ORDER BY centrality DESC
                """
            results = session.run(query).data()
            return results
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    def closeness(self) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = """
                    CALL algo.closeness.stream('Individuo', 'Condannato|ImputatoDi', {direction: 'both'})
                    YIELD nodeId, centrality
                    MATCH (individuo:Individuo) WHERE id(individuo) = nodeId
                    RETURN individuo.nodeId AS id, centrality AS score
                    ORDER BY centrality DESC
                """
            results = session.run(query).data()
            return results
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []

    def pageRank(self) -> List[dict]:
        try:
            session = Neo4jDriver.get_session()
            query = """
                    OPTIONAL MATCH (n1:Individuo) 
                    WITH collect(distinct n1) as c1 
                    OPTIONAL MATCH (n2:Reato) 
                    WITH collect(distinct n2) + c1 as nodes 
                    CALL apoc.algo.pageRankWithConfig(nodes, {iterations: 10, types: 'ImputatoDi|Condannato'}) 
                    YIELD node, score 
                    RETURN node.nodeId as id, score ORDER BY score DESC
                """
            results = session.run(query).data()
            return results
        except Exception as e:
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []
