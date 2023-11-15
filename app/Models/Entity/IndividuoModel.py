from neomodel import RelationshipFrom,StructuredNode, RelationshipTo, StringProperty, IntegerProperty, UniqueIdProperty, BooleanProperty
from django.db import models
from app.Models.Relationship.HaChiamatoModel import HaChiamato
from app.Models.Entity.ReatoModel import Reato
from app.Models.Entity.IntercettazioneAmbModel import IntercettazioneAmb

class Individuo(StructuredNode):

    # Valori Long
    idIndividuo = IntegerProperty(primary_key=True, generated_value=True)

    # Valori String
    nodeId = StringProperty(primary_key=True, json_property="nodeid")
    entityType = StringProperty()
    name = StringProperty()
    provinciaResidenza = StringProperty()
    luogoNascita = StringProperty()
    dataNascita = StringProperty()
    indirizzoResidenza = StringProperty()
    cognome = StringProperty()
    nome = StringProperty()
    #codice = StringProperty()
    capResidenza = StringProperty()
    cittaResidenza = StringProperty()
    nazioneResidenza = StringProperty()
    #pseudonimo = StringProperty()


    # Valori Interi
    mesiImputati=IntegerProperty()
    mesiTotali=IntegerProperty()
    lng = IntegerProperty()
    lat = IntegerProperty()
    community = IntegerProperty()

    # Valori Booleani
    isIndagato = BooleanProperty()

    
    # Sezione di definizione delle relazioni
    haChiamatoList = RelationshipTo('Individuo', 'HaChiamato', model=HaChiamato)
   
   #haChiamatoList = RelationshipFrom("Individuo", "HaChiamato")
        
    #Sezione di definizione delle relazioni con entity
    CondannatoList = RelationshipTo('Reato', 'Condannato',model=Condannato)

    #Sezione di definizione delle relazioni con entity
    ImputatoDiList = RelationshipTo('Reato', 'ImputatoDi',model=ImputatoDi)

    #Sezione di definizione delle relazioni con entity
    PresenteList=RelationshipTo('IntercettazioneAmb','Presente')



    

