from neomodel import StructuredNode
from django.db import models

class AggravanteModel(StructuredNode):

   class Aggravante:
    def __init__(self, name, descrizione):
        self.name = name                        #campo name del model 
        self.descrizione = descrizione          #campo descrizione del model

    def get_name(self):                         #restituisce il nome dell'aggravante
        return self.name

    def get_descrizione(self):                  #restituisce la descrizione dell'aggravante
        return self.descrizione

    def set_name(self, name):                   #setta il nome dell'aggravante
        self.name = name

    def set_descrizione(self, descrizione):     #setta la descrizione dell'aggravante
        self.descrizione = descrizione