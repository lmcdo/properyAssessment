
import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import SearchBar from './Searchbar';

const locations = [
  { lat: -33.865143, lng: 151.209900, name: 'Sydney Opera House' },
  { lat: -33.856667, lng: 151.215530, name: 'Circular Quay' },
];

const Propertyhomepage = () => {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


  return (
    <div>
      <header style={{ height: '60px', backgroundColor: '#f0f0f0', padding: '10px' }}>
        <h1>Sydney Landmarks</h1>
      </header>
      <SearchBar />
      <div style={{ height: '50vh', width: '50vw'  }}>
        <APIProvider apiKey={API_KEY}>
          <Map
            defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
            defaultZoom={13}
          >
            {locations.map((location, index) => (
              <AdvancedMarker key={index} position={location}>
                <Pin>{location.name}</Pin>
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default Propertyhomepage;