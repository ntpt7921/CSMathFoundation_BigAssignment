import './App.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider } from 'primereact/api';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import FindNearestAddress from './FindNearestAddress';
import FindShortestPath from './FindShortestPath';

const App = () => {
  const apiKey = "TIAGlD6jic7l9Aa8Of8IFxo3EUemmcZlHm_agfAm6Ew";
  return (
    <div className="App">
      <PrimeReactProvider>
        <Router>
          <div style={{marginTop: "15px"}} className="navigation">
            <Link to="/find-nearest-address">
              <Button label="Find Nearest Address" icon="pi pi-map-marker" className="p-button-rounded p-button-outlined" />
            </Link>
            <Link to="/find-shortest-path">
              <Button label="Find Shortest Path" icon="pi pi-directions" className="p-button-rounded p-button-outlined" />
            </Link>
          </div>
          <Routes>
            <Route path="/find-nearest-address" element={<FindNearestAddress apiKey={apiKey} />} />
            <Route path="/find-shortest-path" element={<FindShortestPath apiKey={apiKey} />} />
            <Route path="/" element={<div>
              <h3>Welcome to the mapping app. Choose an option from the menu.</h3>              
            </div>} />
          </Routes>
        </Router>
      </PrimeReactProvider>
    </div>
  );
}

export default App;
