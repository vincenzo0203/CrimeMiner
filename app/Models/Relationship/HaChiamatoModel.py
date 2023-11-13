from neomodel import Relationship, RelationshipTo, StringProperty, IntegerProperty, UniqueIdProperty, BooleanProperty
from django.db import models
from app.Models.Entity.IndividuoModel import Individuo

class HaChiamato(Relationship):
    type = "HaChiamato"

    # Valori Long
    idHaChiamato = IntegerProperty(primary_key=True, generated_value=True)
    timestamp = IntegerProperty()

    # Valori String
    edgeId = StringProperty(primary_key=True, json_property="edgeId")
    data = StringProperty()
    entityType = StringProperty()
    name = StringProperty()
    #source_phone = StringProperty()
    #target_phone = StringProperty()
    ora = StringProperty()
    #codice = StringProperty()
    durata = StringProperty()
    #luogo = StringProperty()
    contenuto = StringProperty()
    sourceNodeId = StringProperty(json_property="sourceid")
    targetNodeId = StringProperty(json_property="targetid")

    #Sezione di definizione delle relazioni
    haChiamatoList = RelationshipTo('Individuo', 'HaChiamato')
    #source = RelationshipTo("Individuo", start_node=True, rel_name="HA_CHIAMATO")
    #target = RelationshipTo("Individuo", end_node=True, rel_name="HA_CHIAMATO")