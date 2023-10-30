import typing

from neo4j import GraphDatabase
from app.Neo4jConnection import Neo4jDriver
import json

class IndividuoIntercettazioneRepository:

#funzione che ritorna tutti gli archi e i nodi (il front-end cosi richiedeva)
    @staticmethod
    def get_all_nodes_and_edge():
        try:
            session = Neo4jDriver.get_session()
            query1 ="Match (n:Individuo) RETURN n.nodeId AS nodeId"
            nodes = session.run(query1).data()
            query2 ="MATCH (n:Individuo)-[r:HaChiamato]->(m:Individuo) RETURN r.sourceNodeId AS sourceNodeId,r.edgeId AS edgeId,r.targetNodeId AS targetNodeId "
            edges = session.run(query2).data()
            result = {'nodes': nodes, 'edges': edges}
            return result
        
        except Exception as e:
                # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
                print("Errore durante l'esecuzione della query Cypher:", e)
                return []  # o solleva un'eccezione   
        
        

#Restituisce un grafo di tutti gli individui e delle chiamate tra di loro.
    def graph(self) -> typing.Iterator[typing.Dict[str, str]]:
        """Returns a graph of all individuals and the calls between them."""
        try:
            session = Neo4jDriver.get_session()
            query = """MATCH p= (user:Individuo)-[r:HaChiamato]->(m:Individuo) RETURN nodes(p) as n, relationships(p)[0] as e"""
            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)
            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione


#Restituisce un elenco di tutte le coppie di ID di individui che hanno effettuato chiamate tra di loro
    def get_all_ids_individuo_intercettazione(self) -> typing.List[str]:
        """Returns a list of all pairs of individual IDs that have made calls to each other."""
        try: 
            session = Neo4jDriver.get_session()
            query = """match(n:Individuo)-[r:HaChiamato]->()where n.nome=\"DURANTE\" and n.cognome=\"SINISCALCHI\" OR n.nome=\"BIAGIO\" and n.cognome=\"CAVA\" RETURN toString(r.sourceNodeId) as n, toString(r.targetNodeId) as k"""
            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)
            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione


#Restituisce un grafo di tutti gli individui e delle chiamate tra di loro, con gli ID degli individui al posto dei loro nomi.
    def graph_id(self) -> typing.Iterator[typing.Dict[str, str]]:
        """Returns a graph of all individuals and the calls between them, with the IDs of the individuals instead of their names."""
        try:
            session = Neo4jDriver.get_session()
            query = """MATCH p= (user:Individuo)-[r:HaChiamato]->(m:Individuo) RETURN user.nodeId as n, m.nodeId as k"""
            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)
            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

#Restituisce un grafo di tutti gli individui e delle chiamate tra di loro, con i nomi e i cognomi degli individui al posto dei loro ID.
    def graph_nome_cognome(self) -> typing.Iterator[typing.Dict[str, str]]:
        """Returns a graph of all individuals and the calls between them, with the names and surnames of the individuals instead of their IDs."""
        try:
            session = Neo4jDriver.get_session()
            query = """MATCH p= (user:Individuo)-[r:HaChiamato]->(m:Individuo) RETURN user.nome+' '+user.cognome as n, m.nome+' '+m.cognome as k"""
            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)
            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
    
#Questa funzione ritorna un Individuo attraverso il suo id 
    def get_nome_cognome_by_id(self, id1: str) -> typing.List[str]:
        """Returns the name and surname of an individual given their ID."""
        try:
            session = Neo4jDriver.get_session()
            query = """MATCH (user:Individuo) where user.nodeId={id} return user.nome+' '+user.cognome as n"""
            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)
            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

#funzione che restituisce un grafo di tutti gli individui e delle chiamate tra di loro, filtrato in base ai nomi e ai cognomi di due individui.
    def graph_filter_id(
        self, nome1: str, cogn1: str, nome2: str, cogn2: str
    ) -> typing.Iterator[typing.Dict[str, str]]:
        """Returns a graph of all individuals and the calls between them, filtered by the names and surnames of two individuals."""

        try:
            session = Neo4jDriver.get_session()
            query = """match(n:Individuo)-[r:HaChiamato]->()where n.nome={nome1} and n.cognome={cogn1} OR n.nome={nome2} and n.cognome={cogn2} RETURN toString(r.sourceNodeId) as n, toString(r.targetNodeId) as k"""

            results = session.run(query, nome1=nome1, cogn1=cogn1, nome2=nome2, cogn2=cogn2).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)

            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
        
#Funzione che ritorna l'individuo attraverso il nome e cognome (non era difficile da capire dal nome)
    def get_individuo_id_by_nome_cognome(
        self, nome: str, cognome: str
    ) -> typing.List[str]:
        """Returns the ID of an individual given their name and surname."""

        try:
            session = Neo4jDriver.get_session()
            query = """match(n:Individuo) where n.nome={nome} and n.cognome={cognome} return n.nodeId"""

            results = session.run(query, nome=nome, cognome=cognome).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)

            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione

#Questa funzione non ritornava nulla, ho aggiunto la return, forse nel vecchio progetto non veniva usata
#betweenness è una funzione che richiama un algoritmo del plugin algo

    def betweenness(self) -> typing.Iterator[typing.Dict[str, str]]:
        """Returns the betweenness centrality of all individuals."""

        try:
            session = Neo4jDriver.get_session()
            query = """CALL algo.betweenness.stream(\"Individuo\", \"HaChiamato\", {direction:\"both\"})\n"
                    + "YIELD nodeId, centrality\n"
                    + "MATCH (individuo:Individuo) WHERE id(individuo) = nodeId\n"
                    + "RETURN individuo.nodeId AS id,centrality AS score\n"
                    + "ORDER BY centrality DESC;"""

            results = session.run(query).data()
            json_data = json.dumps(results, ensure_ascii=False, indent=2)

            return json_data
        except Exception as e:
            # Gestione degli errori, ad esempio, registra l'errore o solleva un'eccezione personalizzata
            print("Errore durante l'esecuzione della query Cypher:", e)
            return []  # o solleva un'eccezione
