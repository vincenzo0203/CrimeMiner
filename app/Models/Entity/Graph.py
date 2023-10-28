class Graph:

    def __init__(self):
        self.nodes = {}
        self.edge = {}

    def get_node_list(self):
        return self.nodes
    
    def get_edge_list(self):
        return self.edge
    
    def set_node_List(nodes,self):
        self.nodes = nodes

    def set_edge_List(edge,self):
        self.edge = edge

    def set_node(self, id, node):
        self.nodes[id] = node

    def set_edge(self, id, edge):
        self.edges[id] = edge

    def get_node(self, id):
        return self.nodes.get(id)

    def get_edge(self, id):
        return self.edges.get(id)

    def __str__(self):
        return f"graph n:{self.nodes.values()} e:{self.edges.values()}"
