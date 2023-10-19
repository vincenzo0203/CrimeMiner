from django_neomodel import GraphDatabase, Node, Relationship, RelationshipTo, StringProperty, IntegerProperty, UniqueIdProperty, LongProperty, BooleanProperty

class Individuo(Node):

    # Valori Long
    id = LongProperty(primary_key=True, generated_value=True)

    # Valori String
    nodeId = StringProperty(primary_key=True, json_property="nodeid")
    entityType = StringProperty()
    name = StringProperty()
    provinciaResidenza = StringProperty()
    luogoNascita = StringProperty()
    dataNascita = StringProperty()
    indirizzoResidenza = StringProperty()
    cognome = StringProperty()
    nome = StringProperty()
    codice = StringProperty()
    capResidenza = StringProperty()
    cittaResidenza = StringProperty()
    nazioneResidenza = StringProperty()
    pseudonimo = StringProperty()

    # Valori Interi
    lng = IntegerProperty()
    lat = IntegerProperty()
    community = IntegerProperty()

    # Valori Booleani
    isIndagato = BooleanProperty()

    #Sezione di definizione delle relazioni con entity
    haChiamatoList = RelationshipTo("HaChiamato", direction=Relationship.UNDIRECTED)


