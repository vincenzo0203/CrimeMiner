from neomodel import StructuredRel, RelationshipTo, StringProperty, IntegerProperty, UniqueIdProperty, BooleanProperty
from django.db import models

class Presente(StructuredRel):
   
    idPresente = IntegerProperty(primary_key=True, generated_value=True)
    edgeId = StringProperty(primary_key=True, json_property="edgeId")

    entityType = StringProperty()
    name = StringProperty()

    mesiCondanna=IntegerProperty()
    mesiImputati=IntegerProperty()
    mesiTotali=IntegerProperty()

    sourceNodeId = StringProperty(json_property="sourceid")
    targetNodeId = StringProperty(json_property="targetid")
    
    element_id_property= 'edgedId'