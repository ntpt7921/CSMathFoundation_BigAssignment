import React, { useEffect, useRef, useState } from 'react';

const HMap = ({ platform, children }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!platform) return;

    const defaultLayers = platform.createDefaultLayers();

    const newMap = new window.H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: { lat: 10.7769, lng: 106.7009 },
      zoom: 13,
      pixelRatio: window.devicePixelRatio || 1
    });

    const ui = window.H.ui.UI.createDefault(map, defaultLayers);
    // Enable zooming with mouse wheel
    const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));

    setMap(newMap);

    window.addEventListener('resize', () => newMap.getViewPort().resize());

    return () => {
      window.removeEventListener('resize', () => newMap.getViewPort().resize());
      newMap.dispose();
    };
  }, [platform]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '500px' }}>
      {map && React.Children.map(children, child =>
        React.cloneElement(child, { map }) 
      )}
    </div>
  );
};

export default HMap;
