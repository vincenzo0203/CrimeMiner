from typing import Iterable
from neo4j import APOC #import utilizzanto per usare le funzioni apoc

class IndividuoReatoIntercettazioneAmbRepository:

    def graph(self) -> Iterable[dict]:
        return self.run("MATCH p=()-->() RETURN nodes(p) as n, relationships(p)[0] as e")

    def graph_id(self) -> Iterable[dict]:
        return self.run("MATCH p=()-[r:HaChiamato|Condannato|Presente|ImputatoDi]->() RETURN r.sourceNodeId as n, r.targetNodeId as e, r.agg_id as k")

    def betweenness(self) -> Iterable[dict]:
        return self.run("CALL algo.betweenness.stream(\"Individuo\", \"HaChiamato|Condannato|Presente|Presente\", {direction:\"both\"})\n"
                 + "YIELD nodeId, centrality\n"
                 + "MATCH (individuo:Individuo) WHERE id(individuo) = nodeId\n"
                 + "RETURN individuo.nodeId AS id,centrality AS score\n"
                 + "ORDER BY centrality DESC;")

    def closeness(self) -> Iterable[dict]:
        return self.run("CALL algo.closeness.stream(\"Individuo\", \"HaChiamato|Condannato|Presente|Presente\", {direction:\"both\"})\n"
                 + "YIELD nodeId, centrality\n"
                 + "MATCH (individuo:Individuo) WHERE id(individuo) = nodeId\n"
                 + "RETURN individuo.nodeId AS id,centrality AS score\n"
                 + "ORDER BY centrality DESC;")

    def page_rank(self) -> Iterable[dict]:
        return self.run("OPTIONAL MATCH (n1) "+
                 "WITH collect(distinct n1) as nodes "+
                 "CALL apoc.algo.pageRankWithConfig(nodes,{iterations:10,types:'HaChiamato|Condannato|Presente|Presente'}) YIELD node, score "+
                 "RETURN node.nodeId as id, score ORDER BY score DESC")

    def weighted_page_rank(self) -> Iterable[dict]:
        return self.run("//PRE CALCULATED WPR\n" +
                 "MATCH (n) RETURN n.nodeId as id, n.wpr_pers as score order by score desc")

    def degree(self) -> Iterable[dict]:
        return self.run("MATCH (n) " +
                 "WITH n, size((n)-[]->()) as score " +
                 "RETURN n.nodeId as id, score ORDER BY score DESC")

    def diameter(self) -> Iterable[dict]:
        return self.run("MATCH (a:Individuo), (b:Individuo) WHERE id(a) > id(b)\n" +
                 "MATCH p=shortestPath((a)-[:Codannato|ImputatoDi|HaChiamato*]-(b))\n" +
                 "RETURN length(p) AS len, extract(x IN nodes(p) | x.name) AS path\n" +
                 "ORDER BY len DESC LIMIT 1")

