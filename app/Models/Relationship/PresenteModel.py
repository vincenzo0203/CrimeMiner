from neomodel import Relationship, RelationshipTo, StringProperty, IntegerProperty, UniqueIdProperty, BooleanProperty
from django.db import models

class Presente(Relationship):
   
    idPresente = IntegerProperty(primary_key=True, generated_value=True)
    edgeId = StringProperty(primary_key=True, json_property="edgeId")

    entityType = StringProperty(default='Presente')
    name = StringProperty()

    mesiCondanna=IntegerProperty()
    mesiImputati=IntegerProperty()
    mesiTotali=IntegerProperty()

    sourceNodeId = StringProperty(json_property="sourceid")
    targetNodeId = StringProperty(json_property="targetid")


    PresenteList = RelationshipTo('Individuo', 'Presente')
    