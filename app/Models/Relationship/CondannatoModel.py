from neomodel import StructuredRel,Relationship, RelationshipTo,RelationshipFrom, StringProperty, IntegerProperty, UniqueIdProperty, BooleanProperty
from django.db import models

class Condannato(StructuredRel):
    type = "HaChiamato"

    # Valori Long
    idHaChiamato = IntegerProperty(primary_key=True, generated_value=True)
    timestamp = IntegerProperty()

    # Valori String
    edgeId = StringProperty(primary_key=True, json_property="edgeId")
    data = StringProperty()
    entityType = StringProperty()
    name = StringProperty()

    ora = StringProperty()

    durata = StringProperty()
    mesiCondanna=IntegerProperty()
    mesiImputati=IntegerProperty()
    mesiTotali=IntegerProperty()
    contenuto = StringProperty()
    sourceNodeId = StringProperty(json_property="sourceid")
    targetNodeId = StringProperty(json_property="targetid")

    element_id_property = 'edgeId'