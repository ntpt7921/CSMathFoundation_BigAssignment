# User app for choosing starting and ending point, drawing 3 shortest path on the map

## General architecture

The app will be using web UI (utilizing the browser and web tech stacks) for implementing
functionalities. The will provide the user with:

- A way to choose starting and ending point pair on the map.
- Send request to a back-end server to process the routing (server is also run locally).
- Display 3 shortest path for user-designated start and end point.

The system will composed of 2 parts: client app and back-end server. The use cases and
communications between the client and the server are as followed:

1. The user choose a point on the map. The client send that point's coordinate to the nearest
   matching API of the server to find the node within the data set nearest to the user chosen
   coordinate.
2. The client will receive that nearest node. What to do with that information is left the
   discretion of the user.
3. Step 1 and 2 is repeated to get the other nodes. At this point the client would have a pair of
   nodes acting as starting and ending point.
4. The client send those node ID value (which is sent back from the nearest matching API) to the
   routing API. Back-end will invoke k-shortest routing, implemented as the Yen's algorithm within
   the OSMnx library, sending back the results.
5. Client receive the results, rendering paths on the UI.

## Routing back-end - `app.py`

This is the main back-end user app. It provides simple web API for:

- Nearest matching: given a coordinate, find the closest point (geographically) within the dataset
- Routing: given origin and destination point, return nodes making up the 3 shortest paths and their
  coordinate. 

> **NOTE**
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

```{.json .numberLines}
{
    "osm_id": 8348871140,
    "lat": 10.7903128,
    "long": 106.6888955
    "addr": null
}
```

### Routing

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


```{.json .numberLines}
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

## Client