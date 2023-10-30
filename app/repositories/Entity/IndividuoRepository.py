from neomodel import StructuredNode, StringProperty, RelationshipTo, Relationship
from neomodel import UniqueIdProperty, db
from app.Models.Entity.IndividuoModel import IndividuoModel
from app.Neo4jConnection import Neo4jDriver
import json

# Creazione di una repository personalizzata
class IndividuoRepository:

    @staticmethod
    def find_by_node_id(node_id):
        return IndividuoModel.nodes.get(nodeId=node_id)

    @staticmethod
    def find_by_nome(nome):
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo{nome:'" + nome + "'}) RETURN n"
            results = session.run(cypher_query).data()

            json_data = json.dumps(results, ensure_ascii=False, indent=2)

            return json_data
          
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

    @staticmethod
    def find_by_cognome(cognome):
        return IndividuoModel.nodes.filter(cognome=cognome)

    @staticmethod
    def find_by_nome_and_cognome(nome, cognome):
        return IndividuoModel.nodes.filter(name=nome, cognome=cognome)

    @staticmethod
    def find_all_by_entity_type(entity_type):
        return IndividuoModel.nodes.filter(entityType=entity_type)

    @staticmethod
    def find_all():
        try:
            session = Neo4jDriver.get_session()
            cypher_query = "MATCH (n:Individuo) RETURN n"
            results = session.run(cypher_query).data()

            json_data = json.dumps(results, ensure_ascii=False, indent=2)

            return json_data
           
        
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

    @staticmethod
    def get_id_by_name(nome, cognome):
        cypher_query = (
            "MATCH (n:Individuo) "
            "WHERE n.nome = $nome AND n.cognome = $cognome "
            "RETURN DISTINCT substring(n.nodeId, 1) AS id"
        )
        result, _ = db.cypher_query(cypher_query, {"nome": nome, "cognome": cognome})
        return [row[0] for row in result]

    @staticmethod
    def get_individuo_by_name(nome):
        return IndividuoModel.nodes.get(name=nome)

    @staticmethod
    def get_id_and_nomi():
        cypher_query = (
            "MATCH (n:Individuo) "
            "RETURN n.nodeId AS id, n.nome + ' ' + n.cognome AS nome"
        )
        result, _ = db.cypher_query(cypher_query)
        return [{"id": row[0], "nome": row[1]} for row in result]

    @staticmethod
    def get_nome_individuo_start_with(name):
        cypher_query = (
            "MATCH (n:Individuo)-[:HaChiamato]->(m:Individuo) "
            "WHERE n.nome =~ $name OR n.cognome =~ $name "
            "RETURN DISTINCT n.nome AS nome, n.cognome AS cogn"
        )
        result, _ = db.cypher_query(cypher_query, {"name": f"{name}.*"})
        return [{"nome": row[0], "cognome": row[1]} for row in result]

    @staticmethod
    def get_all_nomi_individuo(name):
        cypher_query = (
            "MATCH (n:Individuo) "
            "WHERE n.nome =~ $name OR n.cognome =~ $name "
            "RETURN DISTINCT n.nome AS nome, n.cognome AS cogn"
        )
        result, _ = db.cypher_query(cypher_query, {"name": f"{name}.*"})
        return [{"nome": row[0], "cognome": row[1]} for row in result]

    @staticmethod
    def get_nomi_individui_intercettati():
        cypher_query = (
            "MATCH (n:Individuo)-[:HaChiamato]->(m:Individuo) "
            "RETURN DISTINCT n.nome + ' ' + n.cognome AS nome"
        )
        result, _ = db.cypher_query(cypher_query)
        return [row[0] for row in result]

    @staticmethod
    def get_closeness():
        cypher_query = (
            "MATCH (n:Individuo) "
            "WITH collect(n) AS nodes "
            "CALL apoc.algo.closeness(['HaChiamato'], nodes, 'INCOMING') YIELD node, score "
            "RETURN node.name AS Name, node.born AS Born, score AS score "
            "ORDER BY score DESC"
        )
        result, _ = db.cypher_query(cypher_query)
        return [dict(zip(row.columns, row)) for row in result]

    @staticmethod
    def get_diameter():
        cypher_query = (
            "MATCH (n:Individuo), (m:Individuo) "
            "WHERE n <> m "
            "WITH n, m "
            "MATCH p = shortestPath((n)-[*]->(m)) "
            "RETURN length(p) AS diameter "
            "ORDER BY diameter DESC "
            "LIMIT 1"
        )
        result, _ = db.cypher_query(cypher_query)
        return result[0][0]

    @staticmethod
    def get_node(id):
        cypher_query = (
            "MATCH (s) "
            "WHERE ID(s) = $id "
            "RETURN s"
        )
        result, _ = db.cypher_query(cypher_query, {"id": id})
        return [{"s": row[0]} for row in result]

    @staticmethod
    def get_proj():
        cypher_query = (
            "MATCH (p1:Individuo)-[:ImputatoDi]->(m:Reato)<-[:ImputatoDi]-(p2:Individuo) "
            "WHERE p1 <> p2 "
            "CALL apoc.create.vRelationship(p1, 'compagnoDireato', {name: 'compagnoDireato'}, p2) YIELD rel AS vr "
            "RETURN p1, p2, vr"
        )
        result, _ = db.cypher_query(cypher_query)
        return [{"p1": row[0], "p2": row[1], "vr": row[2]} for row in result]

    @staticmethod
    def get_custom_proj(t1, t2):
        cypher_query = (
            "WITH $t1 AS label1, $t2 AS label2 "
            "CALL apoc.cypher.run("
            "\"MATCH (p1:\" + label1 + \")-[:ACTED_IN]->(m:\" + label2 + \")<-[:ACTED_IN]-(p2:\" + label1 + \") "
            "RETURN p1, p2\", null) YIELD value "
            "RETURN value"
        )
        result, _ = db.cypher_query(cypher_query, {"t1": t1, "t2": t2})
        return [dict(zip(row.columns, row)) for row in result]
