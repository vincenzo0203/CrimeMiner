from neomodel import StructuredNode, StringProperty, IntegerProperty
from django.db import models

class IntercettazioneAmbModel(StructuredNode):

    #Valori long
    idIntercettazioneAmb = IntegerProperty(primary_key=True, generated_value=True)

    #Valori stringa
    nodeId = StringProperty(primary_key=True, generated_value="uuid", json_property="nodeId")
    name = StringProperty()
    data = StringProperty()
    luogo = StringProperty()
    contenuto = StringProperty()