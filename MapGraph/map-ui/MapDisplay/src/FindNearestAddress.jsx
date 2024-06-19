import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { decode } from '@here/flexpolyline';
import { Message } from 'primereact/message';
import HereMap from './HereMap';

const FindNearestAddress = ({ apiKey }) => {
  const [query, setQuery] = useState('');
  const [points, setPoints] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [matchAddress, setMatchAddress] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        try {
          const response = await fetch(
            `https://autosuggest.search.hereapi.com/v1/autosuggest?at=10.775232,106.691397&q=${encodeURIComponent(query)}&limit=5&apiKey=${apiKey}`
          );
          const data = await response.json();
          setSuggestions(data.items || []);
        } catch (error) {
          console.error('Error fetching autosuggest suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query, apiKey]);

  const handleSelect = async (e) => {
    const selectedItem = e.value;
    setQuery(selectedItem.title);

    try {
      const matchResponse = await fetch(
        `http://localhost:5000/match/${selectedItem.position.lat}/${selectedItem.position.lng}`
      );
      const matchData = await matchResponse.json();

      const routeResponse = await fetch(
        `https://router.hereapi.com/v8/routes?transportMode=car&origin=${selectedItem.position.lat},${selectedItem.position.lng}&destination=${matchData.lat},${matchData.lng}&return=polyline,summary&apikey=${apiKey}`
      );
      const routeData = await routeResponse.json();
      const decodedPolyline = decode(routeData.routes[0].sections[0].polyline);

      setPoints([decodedPolyline.polyline.map(([lat, lng]) => ({ lat, lng }))]);

      // Fetch reverse geocoded address for matchData
      const matchAddressResponse = await fetch(
        `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${matchData.lat},${matchData.lng}&apikey=${apiKey}`
      );
      const matchAddressData = await matchAddressResponse.json();
      if (matchAddressData.items && matchAddressData.items.length > 0) {
        setMatchAddress(matchAddressData.items[0].address.label);
      } else {
        setMatchAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching route or reverse geocode:', error);
    }
  };

  return (
    <div>
      <h1>Find Nearest Address</h1>
      <div style={{display: 'flex', margin: '0 70px', alignItems: 'center'}}>
        <AutoComplete
          value={query}
          suggestions={suggestions}
          completeMethod={(e) => setQuery(e.query)}
          field="title"
          onChange={(e) => setQuery(e.value)}
          onSelect={handleSelect}
          placeholder="Nhập địa chỉ ..."
        />
        {matchAddress && <div style={{marginLeft: '30px'}}><Message severity="success" text={`Nearest Address: ${matchAddress}`} /></div>}
      </div>
      <HereMap apikey={apiKey} pointsSet={points} />
    </div>
  );
};

export default FindNearestAddress;
