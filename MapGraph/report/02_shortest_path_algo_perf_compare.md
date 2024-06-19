# Comparing Dijkstra, Bellman-Ford and Floyd-Warshall performance on map data

## Algorithm implementation

All three algorithm required is already implemented in either the `OSMnx` library or the `networkx`
library. Due to time constraints and difficulties in working with the group (multiple members did
not participate in this exercise), we elected to using these library instead of implement these
algorithms ourselves.

If the intention of the exercise is for student to implement these algorithms, we apologize for not
being able to accomplish this objective.

This section is dedicated to the specifics of our use of these three algorithms (implemented in
those aforementioned library) and comparison of their performance (time taken to route some number
of randomly chosen pair of origins and destinations).

## Floyd-Warshall and the need to use pre-processed result

Floyd-Warshall algorithm finds the shortest path between every pair of vertices within the graph. It
works with directed/undirected graph and tolerates negative edge weight, with the ability to detect
negative cycles. For our purpose (road network with only non-negative weight), we will not care
about negative cycles.

This algorithm has time complexity of $O(V^3)$, meaning that for every doubling in vertex count, the
time taken to run increases by 8 times. This means that this algorithm is unsuitable for very large
graph, or dynamic graph in which the weight changes frequently.

Since only one run of this algorithm is sufficient in determining every possible route within the
dataset. I see that it is more fair for Floyd-Warshall to be run once beforehand (pre-process), and
that every subsequent run of the algorithm need only reference the pre-processed result.

Pre-processing of the routing result in performed by Python script `floyd-warshall-preprocess.py`.
It saves the predecessors and distances result into JSON files (`data/fw-dists.json` and
`data/fw-preds.json`). This takes very long on my machine for the road network of District 1 +
District 3 (~9700 seconds). So unless necessary, I recommend using the pre-processed result within
the JSON files for the performance test.

> **NOTE**
> The pre-processed result is quite big (total to about 900 MB), so it will be provided within a ZIP
> compressed file (`data/fw-preds-dists.zip`) to decrease capacity usage for GitHub.

## Timing (performance) result of three algorithms

Runtime measurement of three algorithms is done by the script `algo-stats.py`. It uses `matplotlib`
to render the result image.

![Timing result for running the algorithms with different number of start-end node
pairs](../perf-test/img/timing_result.svg){width=80%}

Take note that the Floyd-Warshall algorithm is running on pre-processed result, and thus is the
fastest of the bunch. Dijkstra comes in second place and is still pretty fast. The slowest is
Bellman-Ford, with its application for this specific type of graph (non-negative weight graph)
resulting in its losing out to Dijkstra.

The take-away is clear, Dijkstra is generally the fastest for graph with non-negative weight. If
there is a chance of negative cycle, then use Bellman-Ford. Floyd-Warshall is reserved for very
small graphs or graphs that change very infrequently, due to its slower nature (thus the need for
pre-processing).

We can perform simple calculation to determine the amount of routing needed to amortize
pre-processing time of Floyd-Warshall. Given that Floyd-Warshall pre-processing takes about 9700s,
and the time save each 1000 routing between Floyd-Warshall and Dijkstra is about 

$$
9.34 - 0.015 = 9.325(s),
$$

the number of routing request that could have been done by Dijkstra such that total processing time
is equal to Floyd-Warshall pre-processing time is

$$
\frac{9700}{9.325} * 1000 \approx 1.04 * 10^6.
$$

So, if you expect that routing on the data set is done rarely (at least fewer than _1 million_ time
for this specific dataset), do not even bother trying the run with Floyd-Warshall since you would
only be wasting time.

