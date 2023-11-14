from neomodel import StructuredRel,StructuredNode, RelationshipTo, StringProperty, IntegerProperty, UniqueIdProperty, BooleanProperty
from django.db import models


class IntercettazioneAmb(StructuredNode):

    #Valori long
    idIntercettazioneAmb = IntegerProperty(primary_key=True, generated_value=True)

    #Valori stringa
    nodeId = StringProperty(primary_key=True,json_property="nodeId")
    name = StringProperty()
    data = StringProperty()
    luogo = StringProperty()
    contenuto = StringProperty()

    #Sezione di definizione delle relazioni con entity
    PresenteList = RelationshipTo('Individuo', 'Presente')