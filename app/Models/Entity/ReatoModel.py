from neomodel import StructuredNode, StringProperty, IntegerProperty
from django.db import models

class Reato(StructuredNode):

    #Valori long
    idReato = IntegerProperty(primary_key=True, generated_value=True)
    entityType="Reato"

    #Valori Interi
    minMonths = IntegerProperty()
    maxMonths = IntegerProperty()

    #Valori stringa
    name = StringProperty()
    nodeId = StringProperty(primary_key=True,json_property="nodeId")
    normeDiRiferimento = StringProperty()

