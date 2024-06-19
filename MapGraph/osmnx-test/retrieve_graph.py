import osmnx as ox
print("OSMnx version: ", ox.__version__)

target_places = [
    "Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
    "Quận 3, Thành phố Hồ Chí Minh, Việt Nam",
]

# create a network without simplify it first
road_network = ox.graph_from_place(target_places, 
                                   network_type="drive_service", simplify=False,
                                   retain_all=False, truncate_by_edge=True)

# set different color for node that will be pruned after simplifying
# discarded nodes are yellow, else nodes are red
nc = ["r" if ox.simplification._is_endpoint(road_network, node, None) else "y" 
    for node in road_network.nodes()]
fig, ax = ox.plot_graph(road_network, node_color=nc)

# simplify the network
road_network = ox.simplify_graph(road_network)
fig, ax = ox.plot_graph(road_network, node_color="r")

# consolidate intersections and rebuild graph topology
# this reconnects edge geometries to the new consolidated nodes
# road_network = ox.consolidate_intersections(ox.project_graph(road_network), 
#                                             rebuild_graph=True, tolerance=10, dead_ends=False)
# fig, ax = ox.plot_graph(road_network, node_color="r")

# show the simplified network with edges colored by length
ec = ox.plot.get_edge_colors_by_attr(road_network, attr="length", cmap="plasma_r")
fig, ax = ox.plot_graph(
    road_network, node_color="w", node_edgecolor="k", node_size=50, 
    edge_color=ec, edge_linewidth=3
)

# highlight all one-way edges
ec = ["r" if data["oneway"] else "w" 
    for _, _, _, data in road_network.edges(keys=True, data=True)]
fig, ax = ox.plot_graph(road_network, node_size=0, 
                        edge_color=ec, edge_linewidth=1.5, edge_alpha=0.7)

# save street network as GraphML file to work with later
ox.save_graphml(road_network, filepath="./data/road_network.graphml")

# calculate basic street network metrics and display average circuity
stats = ox.basic_stats(road_network)
print(stats)
