import networkx as nx
import matplotlib.pyplot as plt


G = nx.read_gexf("graph.gexf")

centrality = nx.betweenness_centrality(G)
colors = list(centrality.values())

nx.draw_networkx(
    G,
    nx.spring_layout(G),
    node_size=50,
    node_color=colors,
    edge_color="g",
    with_labels=False,
)

plt.axis("off")
plt.show()
