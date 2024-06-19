import numpy as np
np.random.seed(0)
import matplotlib.pyplot as plt
import osmnx as ox
print("OSMnx version: ", ox.__version__)
import networkx as nx
print("networkx version: ", nx.__version__)

import json     # import pre-processed data
import math     # for math.inf
import time     # perf timing

# parameter for the test
NUM_PATHS = [1, 10, 100, 1000]      # number of random path to test
DATA_PATH = "../osmnx-test/data/road_network.graphml"   # road network data
FW_PREDS = "./data/fw-preds.json"
FW_DISTS = "./data/fw-dists.json"

# loading the road network data and prepare it
rnet = ox.load_graphml(DATA_PATH)
rnet_proj = ox.project_graph(rnet)

# loading pre-processed Floyd-Warshall result from JSON file
# since JSON only take string dict key, change the dict to use int key
def jsonKeys2int(x):
    if isinstance(x, dict):
        return {int(k):v for k,v in x.items()}
    return x
preds = {}
dists = {}
with open(FW_PREDS) as f:
    preds = json.load(f, object_hook=jsonKeys2int)
with open(FW_DISTS) as f:
    dists = json.load(f, object_hook=jsonKeys2int)

def get_from_and_to_nodes(n):
    # randomly sample n points
    rand_froms = ox.utils_geo.sample_points(
        ox.convert.to_undirected(rnet_proj), n=n)
    rand_tos = ox.utils_geo.sample_points(
        ox.convert.to_undirected(rnet_proj), n=n)
    from_xs = rand_froms.x.values
    from_ys = rand_froms.y.values
    to_xs = rand_tos.x.values
    to_ys = rand_tos.y.values

    # find each nearest node to points
    # from_nodes[i] and to_nodes[i] defines a pair of start and end point
    from_nodes = ox.nearest_nodes(rnet_proj, from_xs, from_ys)
    to_nodes = ox.nearest_nodes(rnet_proj, to_xs, to_ys)

    return from_nodes, to_nodes

def run_dijkstra(froms, tos):
    start_time = time.perf_counter()

    path_d = []
    for orig, dest in zip(froms, tos):
        try:
            path_d.append(nx.dijkstra_path(rnet_proj, orig, dest, weight="length")) 
        except nx.NetworkXNoPath:
            path_d.append(None);

    elapsed_time = time.perf_counter() - start_time
    return path_d, elapsed_time

def run_bellman_ford(froms, tos):
    start_time = time.perf_counter()

    path_bf = []
    for orig, dest in zip(froms, tos):
        try:
            path_bf.append(nx.bellman_ford_path(rnet_proj, orig, dest, weight="length")) 
        except nx.NetworkXNoPath:
            path_bf.append(None);

    elapsed_time = time.perf_counter() - start_time
    return path_bf, elapsed_time

def run_floyd_warshall(froms, tos):
    start_time = time.perf_counter()

    path_fw = []
    for orig, dest in zip(froms, tos):
        if dists[orig][dest] != math.inf:
            path_fw.append(nx.reconstruct_path(orig, dest, preds)) 
        else:
            path_fw.append(None)
    elapsed_time = time.perf_counter() - start_time

    return path_fw, elapsed_time

def get_exec_time():
    etime = { 'Dijkstra': [], 'Bellman-Ford': [], 'Floyd-Warshall': []}
    for n in NUM_PATHS:
        froms, tos = get_from_and_to_nodes(n)
        dpath, dtime = run_dijkstra(froms, tos)
        bfpath, bftime = run_bellman_ford(froms, tos)
        fwpath, fwtime = run_floyd_warshall(froms, tos)

        if not (dpath == bfpath == fwpath):
            raise RuntimeError("Paths returned by 3 algos does not match")

        etime['Dijkstra'].append(dtime)
        etime['Bellman-Ford'].append(bftime)
        etime['Floyd-Warshall'].append(fwtime)
    return etime

def plot_time(etime):
    npaths = [str(i) for i in NUM_PATHS]

    x = np.arange(len(npaths))  # the label locations
    width = 0.25  # the width of the bars
    multiplier = 0

    fig, ax = plt.subplots(layout='constrained')

    for algo, times in etime.items():
        offset = width * multiplier
        rects = ax.bar(x + offset, times, width, label=algo)
        ax.bar_label(rects, padding=3)
        multiplier += 1

    # Add some text for labels, title and custom x-axis tick labels, etc.
    ax.set_xlabel('n')
    ax.set_ylabel('Time (s)')
    ax.set_title('Time taken to run for n randomly chosen pair')
    ax.set_xticks(x + width, npaths)
    ax.set_yscale('log')
    ax.legend(loc='upper left', ncols=3)

    plt.show()

plot_time(get_exec_time())
