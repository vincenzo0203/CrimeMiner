from neomodel import StructuredRel,Relationship, RelationshipTo,RelationshipFrom, StringProperty, IntegerProperty, UniqueIdProperty, BooleanProperty
from django.db import models

class ImputatoDi(StructuredRel):
    type = "ImputatoDi"

    # Valori Long
    idImputatoDi = IntegerProperty(primary_key=True, generated_value=True)

    # Valori String
    edgeId = StringProperty(primary_key=True, json_property="edgeId")
    entityType = StringProperty()

    mesiTotali=IntegerProperty()
 
    sourceNodeId = StringProperty(json_property="sourceid")
    targetNodeId = StringProperty(json_property="targetid")

    element_id_property = 'edgeId'