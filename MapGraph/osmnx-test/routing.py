import numpy as np
np.random.seed(0)
import osmnx as ox
print("OSMnx version: ", ox.__version__)

NUM_PATHS = 5 

road_network = ox.load_graphml('./data/road_network.graphml')
road_network_projected = ox.project_graph(road_network)

# randomly sample n points spatially-constrained to the network's geometry
froms = ox.utils_geo.sample_points(
    ox.convert.to_undirected(road_network_projected), n=NUM_PATHS)
tos = ox.utils_geo.sample_points(
    ox.convert.to_undirected(road_network_projected), n=NUM_PATHS)

from_xs = froms.x.values
from_ys = froms.y.values
to_xs = tos.x.values
to_ys = tos.y.values

# find each nearest node to several points, and optionally return distance
nearest_froms = ox.nearest_nodes(road_network_projected, from_xs, from_ys)
nearest_tos = ox.nearest_nodes(road_network_projected, to_xs, to_ys)

# find the shortest path (by distance) between these nodes then plot it
routes = ox.shortest_path(road_network_projected, 
                          nearest_froms, nearest_tos, weight="length")
path_colors = ox.plot.get_colors(NUM_PATHS, cmap="spring")
fig, ax = ox.plot_graph_routes(road_network_projected, list(routes), 
                               route_colors=path_colors, 
                               route_linewidth=1, node_size=0)

# or get k-shortest path between single pair of nodes
routes = list(ox.k_shortest_paths(road_network_projected, 
                                  nearest_froms[0], nearest_tos[0], 
                                  k=NUM_PATHS, weight="length"))
fig, ax = ox.plot_graph_routes(road_network_projected, routes, 
                               route_colors="red", route_linewidth=1, node_size=0)

# explore multiple routes together in a single map
nodes, edges = ox.graph_to_gdfs(road_network_projected)
gdfs = [ox.routing.route_to_gdf(road_network_projected, route, weight="length") for route in routes]
m = edges.explore(color="#222222", tiles="cartodbdarkmatter")
print(gdfs)
for route_edges in gdfs:
    m = route_edges.explore(m=m, color="cyan", style_kwds={"weight": 5, "opacity": 0.5})

m.show_in_browser()
