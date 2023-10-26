from neomodel import StructuredNode, StringProperty, IntegerProperty
from django.db import models

class ReatoModel(StructuredNode):

    #Valori long
    idReato = IntegerProperty(primary_key=True, generated_value=True)

    #Valori stringa
    nodeId = StringProperty(primary_key=True, generated_value="uuid", json_property="nodeId")
    name = StringProperty()
    normeDiRiferimento = StringProperty()

    #Valori Interi
    minMonths = IntegerProperty()
    maxMonths = IntegerProperty()