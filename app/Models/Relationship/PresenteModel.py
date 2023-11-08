from neomodel import StructuredNode, StringProperty, RelationshipTo, RelationshipFrom, IntegerProperty, DateTimeProperty, UniqueIdProperty

class PresenteModel(StructuredNode):
    id = UniqueIdProperty()
    edgeId = StringProperty(required=True)
    sourceNodeId = StringProperty(required=True)
    targetNodeId = StringProperty(required=True)
    entityType = StringProperty(default='Presente')
    name = StringProperty(required=True)
    data = StringProperty()
    ora = StringProperty()
    contenuto = StringProperty()
    timestamp = IntegerProperty()

    # Definizione delle relazioni
    source = RelationshipFrom('Individuo', 'Presente')
    target = RelationshipTo('IntercettazioneAmb', 'Presente')

    # Metodi Getter
    def get_edge_id(self):
        return self.edgeId

    def get_source_node_id(self):
        return self.sourceNodeId

    def get_target_node_id(self):
        return self.targetNodeId

    def get_entity_type(self):
        return self.entityType

    def get_name(self):
        return self.name

    def get_data(self):
        return self.data

    def get_ora(self):
        return self.ora

    def get_contenuto(self):
        return self.contenuto

    def get_timestamp(self):
        return self.timestamp

    # Metodi Setter
    def set_edge_id(self, edge_id):
        self.edgeId = edge_id

    def set_source_node_id(self, source_node_id):
        self.sourceNodeId = source_node_id

    def set_target_node_id(self, target_node_id):
        self.targetNodeId = target_node_id

    def set_entity_type(self):
        self.entityType = 'Presente'

    def set_name(self, name):
        self.name = name

    def set_data(self, data):
        self.data = data

    def set_ora(self, ora):
        self.ora = ora

    def set_contenuto(self, contenuto):
        self.contenuto = contenuto

    def set_timestamp(self, timestamp):
        self.timestamp = timestamp