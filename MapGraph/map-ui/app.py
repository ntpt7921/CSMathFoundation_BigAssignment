# Routing backend code
# -------------------------------------------------------------
from networkx import NodeNotFound
from networkx import NetworkXNoPath 
import osmnx as ox
print("OSMnx version: ", ox.__version__)

road_network = ox.load_graphml('../osmnx-test/data/road_network.graphml')
road_network_projected = ox.project_graph(road_network)

def get_nearest_node_id(lat: float, lng: float):
    return ox.nearest_nodes(road_network, lng, lat, return_dist=False)

def get_k_shortest_path(from_id: int, to_id: int, k = 3):
    return ox.k_shortest_paths(road_network_projected, from_id, to_id, k, weight='length')

def get_node_list_from_path(path):
    last_node = None
    nodes = []
    for node in path:
        if last_node is None: # for the first node in path
            last_node = node
            nodes.append({'osm_id': node, 
                          'lat':road_network.nodes[node]['y'],
                          'lng':road_network.nodes[node]['x'],
                          'addr': None})
        else:
            current_node = node
            path_segment_info = road_network.get_edge_data(last_node, current_node, 0)
            nodes.append({'osm_id': last_node, 
                          'lat':road_network.nodes[last_node]['y'],
                          'lng':road_network.nodes[last_node]['x'],
                          'addr': None})
            last_node = current_node
            # if the current segment is composed of multiple nodes
            # going from last_node to current_node
            if 'geometry' in path_segment_info:
                path_segment_nodes = path_segment_info['geometry'].coords
                path_segment_name = path_segment_info['name'] if 'name' in path_segment_info else None
                print('PATH_SEGMENT_INFO: ', path_segment_info)
                # insert all node in the middle
                for lng, lat in path_segment_nodes[1:-1]:
                    nodes.append({'osm_id': None,
                                  'lat': lat,
                                  'lng': lng,
                                  'addr': path_segment_name
                                  })
    # add the last node 
    nodes.append({'osm_id': last_node, 
                  'lat':road_network.nodes[last_node]['y'],
                  'lng':road_network.nodes[last_node]['x']})
    return nodes


# Flask server code
# -------------------------------------------------------------
from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route("/match/<string:lat>/<string:lng>")
def match(lat, lng):
    node_id = get_nearest_node_id(float(lat), float(lng))
    res = {
        'osm_id': node_id, 
        'lat': road_network.nodes[node_id]['y'],
        'lng': road_network.nodes[node_id]['x'],
        'addr': None
    }
    print(res)
    return res


@app.route("/route/<string:from_lat>/<string:from_lng>/<string:to_lat>/<string:to_lng>")
def route(from_lat, from_lng, to_lat, to_lng):
    from_id = get_nearest_node_id(float(from_lat), float(from_lng))
    to_id = get_nearest_node_id(float(to_lat), float(to_lng))
    paths =  get_k_shortest_path(from_id, to_id)

    # debug plot
    # _, _ = ox.plot_graph_route(road_network, next(paths),
    #                            route_color='red', 
    #                            route_linewidth=1, node_size=0)

    try:
        res = []
        for i, path in enumerate(paths):
            nodes = get_node_list_from_path(path)
            res.append({'route_number': i, 'nodes': nodes})
        print(res)
        return res
    except NetworkXNoPath:
        return f"No route found between {from_id} and {to_id}", 400
    except NodeNotFound:
        return f"Origin or destination node not found in dataset", 400
