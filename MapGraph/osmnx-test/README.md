# osmnx-test

This contains all test Python script for running related functionalities of the OSMnx package.

> [!NOTE]
> The road network data will be stored as a GraphML file in the `data` folder. Future use can
> utilize this data without re-constructing their own to save bandwidth for OSM.

## `retrieve_graph.py`

> [!WARNING]
> The Open Street Map (OSM) data is free for every one to use, but the hosting is not. So use the
> Overpass API with discretion (and remember that you will be rate-limited).

Running this file will fetch data from the Overpass API for District 1 and 3 of HCM. The road map is
then constructed through various step (showing useless point, simplify by discarding useless point).
Then finally the road network is saved into a GraphML file for use later.

Plot will be showed in this order:
- Road network before simplify
- Road network after simplify
- Road network with one-way street highlighted

## `routing.py`

This script showcases the routing capabilities of the OSMnx library. Road network data is imported
from `data` folder. The script attempt to:

- Select `NUM_PATHS` pair of start and end point, then run routing on each pair and plot them all on
  the map using matplotlib. 
- Find the `NUM_PATHS` shortest path and plot them on the map using matplotlib. Also use Leaflet to
  plot the path with browser UI.

## `map_show_in_browser.py`

This shows OSMnx's ability to display the current road network as an overlay on top of Leaflet map
UI.
