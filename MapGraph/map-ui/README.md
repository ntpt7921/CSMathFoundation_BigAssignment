# User app for choosing point on the map and plot paths

## Routing back-end - `app.py`

This is the main back-end user app. It provides simple web API for:

- Nearest matching: given a coordinate, find the closest point (geographically) within the dataset
- Routing: given origin and destination point, return nodes making up the 3 shortest paths and their
  coordinate. 

> [!NOTE]
> Currently the dataset of node within the back-end only contains District 1 and 3, Ho Chi Minh. So
> try not to request point outside this region. The nearest matching would still work, the routing
> not so much.

This app use `OSMnx`, `networkx` and the `Flask` Python library. To run it in development mode and
have access to the API, run

```bash
flask run
# or to be specific of the app source file run
# flask --app app.py run
```

### Nearest matching

API address for accessing nearest matching functionality is at `/match/<lat>/<long>`
- `<lat>` is latitude, expressed as a floating point value
- `<long>` is latitude, expressed as a floating point value
- Example: If the server is running on local host, then addressing `http://localhost/match/0.0/0.0`
  will give you the nearest node within the data to the point (0.0, 0.0) on the map.

Below is an example returned JSON object from querying this API

```json
{
    "osm_id": 8348871140,
    "lat": 10.7903128,
    "long": 106.6888955
    "addr": null
}
```

### Routing

API address for accessing routing functionality is at `/route/<origin_lat>/<origin_long>/<dest_lat>/<dest_long>`

- `<origin_lat>`, `<origin_long>` is the coordinate of the starting point.
- `<dest_lat>`, `<dest_long>` is the coordinate of the ending point.
- Example: If the server is running on local host, then addressing
`http://localhost/route/0.0/0.0/1.0/1.0` will return the 3 shortest route from node with coordinate
(0, 0) and (1, 1) - granted the starting and ending node will be implicitly matched to the nearest
node within the dataset. Each route will include the set of nodes and their coordinates for drawing
the path on the map.

Below is an example returned JSON object from querying this API

```json
[
    {
        "route_number": 0,
        "nodes": [
            {
                "osm_id": 411923191,
                "lat": 10.7734336,
                "long": 106.6818314
                "addr": null
            },
            {
                "osm_id": 411923192,
                "lat": 10.7732105,
                "long": 106.6819136
                "addr": null
            },
            {
                "osm_id": 5811285104,
                "lat": 10.7561,
                "long": 106.6872507
                "addr": null
            }
        ]
    },
    {
        "route_number": 1,
        "nodes": [
            {
                "osm_id": 5762610098,
                "lat": 10.7693147,
                "long": 106.6822109
                "addr": null
            },
            {
                "osm_id": 5762610102,
                "lat": 10.7687975,
                "long": 106.681591
                "addr": null
            },
            {
                "osm_id": 8348871140,
                "lat": 10.7903128,
                "long": 106.6888955
                "addr": null
            }
        ]
    },
    {
        "route_number": 2,
        "nodes": [
            {
                "osm_id": 5762610098,
                "lat": 10.7693147,
                "long": 106.6822109
                "addr": null
            },
            {
                "osm_id": 5762610102,
                "lat": 10.7687975,
                "long": 106.681591
                "addr": null
            },
            {
                "osm_id": 8348871140,
                "lat": 10.7903128,
                "long": 106.6888955
                "addr": null
            }
        ]
    }
]
```
