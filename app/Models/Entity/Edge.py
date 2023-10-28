class Edge:

    def __init__(self, id):
        self.id = id
        self.attrs = {}

    def get_attributes(self):
        return self.attrs

    def set_attributes(self, attrs):
        self.attrs = attrs

    def get_attribute(self, name):
        return self.attrs.get(name)

    def set_attribute(self, name, value):
        self.attrs[name] = value

    def __str__(self):
        return f"(id: {self.id} {self.attrs})"