from neo4j import GraphDatabase

class Neo4jDriver:
    _uri = "bolt://localhost:7687"
    _user = "neo4j"
    _password = "neo44%*j"
    _driver = None

    @classmethod
    def initialize(cls):
        if cls._driver is None:
            cls._driver = GraphDatabase.driver(cls._uri, auth=(cls._user, cls._password))

    @classmethod
    def close(cls):
        if cls._driver is not None:
            cls._driver.close()
            cls._driver = None

    @classmethod
    def get_session(cls):
        if cls._driver is None:
            cls.initialize()
        return cls._driver.session()