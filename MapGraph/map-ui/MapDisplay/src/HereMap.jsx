import React, { useEffect, useRef } from 'react';
import _ from 'lodash';

const HereMap = ({ apikey, pointsSet }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const platform = new window.H.service.Platform({
      apikey: apikey
    });
    const defaultLayers = platform.createDefaultLayers();

    // Remove map if existed
    const mapElement = mapRef.current;
    let map;
    if (mapElement && mapElement.firstChild) {
      mapElement.removeChild(mapElement.firstChild);
    }

    map = new window.H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: { lat: 10.775232, lng: 106.691397 },
      zoom: 14,
      pixelRatio: window.devicePixelRatio || 1
    });

    if (_.isEmpty(pointsSet)) {
      return;
    }

    // Enable zooming with mouse wheel
    const ui = window.H.ui.UI.createDefault(map, defaultLayers);
    const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));

    const addPolyline = (points, color, offset = { lat: 0, lng: 0 }) => {
      const lineString = new window.H.geo.LineString();
      points.forEach(point => {
        lineString.pushPoint({ lat: point.lat + offset.lat, lng: point.lng + offset.lng });
      });

      const polyline = new window.H.map.Polyline(lineString, {
        style: { lineWidth: 4, strokeColor: color }
      });

      map.addObject(polyline);
    };

    const arrivalPoint = pointsSet[0][0];
    const arrivalMarkerIcon = '<div style="font-weight: bold; color: #ffffff; background-color: black; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">A</div>';
    const arrivalMarker = new window.H.map.DomMarker(arrivalPoint, {
      icon: new window.H.map.DomIcon(arrivalMarkerIcon)
    });
    map.addObject(arrivalMarker);

    const colors = ['rgba(0, 123, 255, 0.7)', 'rgba(255, 0, 0, 0.7)', 'rgba(40, 167, 69, 0.7)'];

    const offsets = [
      { lat: 0.00003, lng: 0.00003 },
      { lat: -0.00003, lng: -0.00003 },
      { lat: 0.00006, lng: 0.00006 }
    ];

    _.forEach(pointsSet, (points, index) => {
      addPolyline(points, colors[index], offsets[index]);
    });

    const destinationPoint = pointsSet[pointsSet.length - 1][pointsSet[pointsSet.length - 1].length - 1];
    const destinationMarkerIcon = `<div style="font-weight: bold; color: #ffffff; background-color: black; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center;">D</div>`;
    const destinationMarker = new window.H.map.DomMarker(destinationPoint, {
      icon: new window.H.map.DomIcon(destinationMarkerIcon)
    });
    map.addObject(destinationMarker);

    return () => {
      map.dispose();
    };
  }, [apikey, pointsSet]);

  return <div ref={mapRef} style={{ width: '1300px', height: '550px', margin: '15px auto' }} />;
};

export default HereMap;
