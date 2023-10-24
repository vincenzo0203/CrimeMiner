from neomodel import GraphDatabase, Node, RelationshipEntity, RelationshipTo, StringProperty, IntegerProperty, UniqueIdProperty, LongProperty, BooleanProperty
from django.db import models


class HaChiamatoModel(RelationshipEntity):
    type = "HaChiamato"

    # Valori Long
    id = LongProperty(primary_key=True, generated_value=True)
    timestamp = LongProperty()

    # Valori String
    edgeId = StringProperty(primary_key=True, generated_value="uuid", json_property="relId")
    data = StringProperty()
    entityType = StringProperty()
    name = StringProperty()
    source_phone = StringProperty()
    target_phone = StringProperty()
    ora = StringProperty()
    codice = StringProperty()
    durata = StringProperty()
    luogo = StringProperty()
    contenuto = StringProperty()
    sourceNodeId = StringProperty(json_property="sourceid")
    targetNodeId = StringProperty(json_property="targetid")

    #Sezione di definizione delle relazioni
    source = RelationshipTo("Individuo", start_node=True, rel_name="HA_CHIAMATO")
    target = RelationshipTo("Individuo", end_node=True, rel_name="HA_CHIAMATO")