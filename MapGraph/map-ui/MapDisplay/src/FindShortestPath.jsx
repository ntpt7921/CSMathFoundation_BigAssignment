import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import HereMap from './HereMap';
import { Toast } from 'primereact/toast';
import _ from 'lodash'

const FindShortestPath = ({ apiKey }) => {
  const [query, setQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [points, setPoints] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [startPosition, setStartPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('');

  const showToast = (message, severity) => {
    setToastMessage(message);
    setToastSeverity(severity);
    toast.current.show({ life: 5000 }); 
  };
  
  const toast = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async (query, setSuggestions) => {
      if (query.length > 2) {
        try {
          const response = await fetch(
            `https://autosuggest.search.hereapi.com/v1/autosuggest?at=10.775232,106.691397&q=${encodeURIComponent(query)}&limit=5&apiKey=${apiKey}`
          );
          const data = await response.json();
          setSuggestions(data.items || []);
        } catch (error) {
          console.error('Error fetching geocode suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions(query, setSuggestions);
  }, [query, apiKey]);

  useEffect(() => {
    const fetchSuggestions = async (query, setSuggestions) => {
      if (query.length > 2) {
        try {
          const response = await fetch(
            `https://autosuggest.search.hereapi.com/v1/autosuggest?at=10.775232,106.691397&q=${encodeURIComponent(query)}&limit=5&apiKey=${apiKey}`
          );
          const data = await response.json();
          setSuggestions(data.items || []);
        } catch (error) {
          console.error('Error fetching geocode suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions(destinationQuery, setDestinationSuggestions);
  }, [destinationQuery, apiKey]);

  const handleSelectStart = (e) => {
    const selectedItem = e.value;
    setQuery(selectedItem.title);
    setStartPosition(selectedItem.position);
  };

  const handleSelectDestination = async (e) => {
    const selectedItem = e.value;
    setDestinationQuery(selectedItem.title);
    setDestinationPosition(selectedItem.position);
  };

  useEffect(() => {
    const fetchRoute = async () => {
      if (startPosition && destinationPosition) {
        try {
          const routeResponse = await fetch(`http://localhost:5000/route/${startPosition.lat}/${startPosition.lng}/${destinationPosition.lat}/${destinationPosition.lng}`)
          const routeData = await routeResponse.json();
          const filterRouteData = _.map(routeData, (route) => 
            _.map(route.nodes, ({ lat, lng }) => ({ lat, lng }))
          );
          setPoints(filterRouteData);
                
        } catch (error) {
          showToast('Failed to fetch route. Please try again later.', 'error');
        }
      }
    };

    fetchRoute();
  }, [startPosition, destinationPosition, apiKey]);

  return (
    <div>
      <h1>Find Shortest Path</h1>
      <Toast ref={toast} />
      <div style={{display: 'flex', margin: '0 70px', alignItems: 'center'}}>
        <AutoComplete
          value={query}
          suggestions={suggestions}
          completeMethod={(e) => setQuery(e.query)}
          field="title"
          onChange={(e) => setQuery(e.value)}
          onSelect={handleSelectStart}
          placeholder="Nhập địa chỉ xuất phát..."
        />
        <AutoComplete
          style={{marginLeft: "40px"}}
          value={destinationQuery}
          suggestions={destinationSuggestions}
          completeMethod={(e) => setDestinationQuery(e.query)}
          field="title"
          onChange={(e) => setDestinationQuery(e.value)}
          onSelect={handleSelectDestination}
          placeholder="Nhập địa chỉ điểm đến..."
        />
      </div>
      <HereMap apikey={apiKey} pointsSet={points} />
    </div>
  );
};

export default FindShortestPath;
