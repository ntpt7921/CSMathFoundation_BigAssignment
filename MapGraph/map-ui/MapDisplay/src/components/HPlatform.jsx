import React, { useEffect, useRef, cloneElement } from 'react';

const HPlatform = ({ apikey, children }) => {
  const platformRef = useRef(null);

  useEffect(() => {
    platformRef.current = new window.H.service.Platform({
      apikey: apikey
    });
  }, [apikey]);

  return React.Children.map(children, child =>
    cloneElement(child, { platform: platformRef.current })
  );
};

export default HPlatform;

