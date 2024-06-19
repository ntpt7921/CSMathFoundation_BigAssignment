import osmnx as ox
print("OSMnx version: ", ox.__version__)

road_network = ox.load_graphml('./data/road_network.graphml')
road_network_projected = ox.project_graph(road_network)

# explore nodes and edges together in a single map
nodes, edges = ox.graph_to_gdfs(road_network_projected)
m = edges.explore(color="blue")
nodes.explore(m=m, color="red", marker_kwds={"radius": 4})
m.show_in_browser()
