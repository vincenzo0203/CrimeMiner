from neomodel import RelationshipFrom,StructuredNode, RelationshipTo, StringProperty, IntegerProperty, UniqueIdProperty, BooleanProperty
from django.db import models
from app.Models.Relationship.HaChiamatoModel import HaChiamato
from app.Models.Relationship.CondannatoModel import Condannato
from app.Models.Relationship.ImputatoDiModel import ImputatoDi
from app.Models.Entity.ReatoModel import Reato
from app.Models.Entity.IntercettazioneAmbModel import IntercettazioneAmb
from app.Models.Relationship.PresenteModel import Presente

class Individuo(StructuredNode):

    # Valori Long, primary_key=True per indicare una chiave primaria e generated_value per generare il valore in automatico
    idIndividuo = IntegerProperty(primary_key=True, generated_value=True)

    # Valori String, json_property per indicare una proprietà json
    nodeId = StringProperty(primary_key=True, json_property="nodeid")
    entityType = StringProperty()
    name = StringProperty()
    provinciaResidenza = StringProperty()
    luogoNascita = StringProperty()
    dataNascita = StringProperty()
    indirizzoResidenza = StringProperty()
    cognome = StringProperty()
    nome = StringProperty()
    capResidenza = StringProperty()
    cittaResidenza = StringProperty()
    nazioneResidenza = StringProperty()


    # Valori Interi
    mesiCondanna = IntegerProperty()
    mesiImputati=IntegerProperty()
    mesiTotali=IntegerProperty()
    lng = IntegerProperty()
    lat = IntegerProperty()
    community = IntegerProperty()

    # Valori Booleani
    isIndagato = BooleanProperty()

    
    # Sezione di definizione delle relazioni
    haChiamatoList = RelationshipTo('Individuo', 'HaChiamato', model=HaChiamato)
 
    CondannatoList = RelationshipTo('Reato', 'Condannato',model=Condannato)

    ImputatoDiList = RelationshipTo('Reato', 'ImputatoDi',model=ImputatoDi)

    PresenteList=RelationshipTo('IntercettazioneAmb','Presente', model= Presente)



    

