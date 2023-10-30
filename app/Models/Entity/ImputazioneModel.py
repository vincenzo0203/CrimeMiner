from neomodel import RelationshipFrom,StructuredNode, RelationshipTo, StringProperty, IntegerProperty, ArrayProperty
from django.db import models

class Imputazione(StructuredNode):

    # Valori Long
    idImputazione = IntegerProperty(primary_key=True, generated_value=True)

     # Valori String
    edgeId = StringProperty(primary_key=True, json_property="edgeid",generated_value="uuid")
    sourceNodeId = StringProperty(primary_key=True, json_property="sourceid")
    targetNodeId = StringProperty(primary_key=True, json_property="targetid")
    entityType = StringProperty() 
    name = StringProperty()
    agg_id = ArrayProperty(StringProperty())  # Lista di stringhe
    agg_desc = ArrayProperty(StringProperty())  # Lista di stringhe
    agg_ReatoRef = ArrayProperty(StringProperty())  # Lista di stringhe
    agg_norm = ArrayProperty(StringProperty())  # Lista di stringhe
    agg_inc_min = ArrayProperty(StringProperty())  # Lista di stringhe
    agg_inc_max = ArrayProperty(StringProperty())  # Lista di stringhe
    att_id = ArrayProperty(StringProperty())  # Lista di stringhe
    att_desc = ArrayProperty(StringProperty())  # Lista di stringhe
    att_ReatoRef = ArrayProperty(StringProperty())  # Lista di stringhe
    att_norm = ArrayProperty(StringProperty())  # Lista di stringhe
    att_rid = ArrayProperty(StringProperty())  # Lista di stringhe   

    source = RelationshipFrom('Individuo', 'IMPUTAZIONE')
    target = RelationshipTo('Reato', 'IMPUTAZIONE')

    