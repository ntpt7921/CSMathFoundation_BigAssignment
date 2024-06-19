import { useEffect } from 'react';

const HPolyLine = ({ map, coordinates, lineStyle }) => {
  useEffect(() => {
    if (!map || !coordinates || coordinates.length === 0) return;

    const lineString = new window.H.geo.LineString();
    
    coordinates.forEach(point => {
      lineString.pushPoint(point);
    });

    const polyline = new window.H.map.Polyline(lineString, {
      style: lineStyle
    });

    map.addObject(polyline);

    return () => {
      map.removeObject(polyline);
    };
  }, [map, coordinates, lineStyle]);

  return null;
};

export default HPolyLine;
