import numpy as np
np.random.seed(0)
import osmnx as ox
print("OSMnx version: ", ox.__version__)
import networkx as nx
print("networkx version: ", nx.__version__)

import json     # for serializing result
import time     # perf timing

DATA_PATH = "../osmnx-test/data/road_network.graphml"   # road network data

# loading the data and prepare it
rnet = ox.load_graphml(DATA_PATH)
rnet_proj = ox.project_graph(rnet)

# prepare floyd-warshall data
print(len(rnet_proj.nodes), len(rnet_proj.edges))
start_time = time.perf_counter()
preds, dists = nx.floyd_warshall_predecessor_and_distance(rnet_proj, weight="length")
elapsed_time = time.perf_counter() - start_time

with open("./data/fw-preds.json", "w") as pred_data_file:
    json.dump(preds, pred_data_file);
with open("./data/fw-dists.json", "w") as dist_data_file:
    json.dump(dists, dist_data_file);

print("Take", elapsed_time, "seconds")
