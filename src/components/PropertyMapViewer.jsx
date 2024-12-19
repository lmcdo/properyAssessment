import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCRcdazfHza58ewhoMrzBRzL2npCK5ZWL8';
const NSW_CENTER = { lat: -33.8688, lng: 151.2093 };

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly"
});

const project = (latLng) => {
  const siny = Math.sin((latLng.lat * Math.PI) / 180);
  const x = latLng.lng * 20037508.34 / 180;
  let y = Math.log((1 + siny) / (1 - siny)) * 20037508.34 / (2 * Math.PI);
  y = Math.max(-20037508.34, Math.min(y, 20037508.34));
  return { x, y };
};

const PropertyMapViewer = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [mapLayers, setMapLayers] = useState({ cadastre: null, zoning: null });
  const [layerVisibility, setLayerVisibility] = useState({
    cadastre: true,
    zoning: false
  });

  const createLayers = (google, mapInstance) => {
    console.log('Creating map layers...');
    
    const cadastreLayer = new google.maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        console.log('Requesting cadastre tile:', { coord, zoom });
        const scale = 1 << zoom;
        const worldSize = 256 * scale;
        
        const pixelX = coord.x * 256;
        const pixelY = coord.y * 256;
        
        const worldX1 = (pixelX / worldSize) * 40075016.68 - 20037508.34;
        const worldX2 = ((pixelX + 256) / worldSize) * 40075016.68 - 20037508.34;
        const worldY1 = 20037508.34 - (pixelY / worldSize) * 40075016.68;
        const worldY2 = 20037508.34 - ((pixelY + 256) / worldSize) * 40075016.68;
        
        const neBound = project({ lat: -28.0, lng: 154.0 });
        const swBound = project({ lat: -38.0, lng: 141.0 });
        
        if (worldX2 < swBound.x || worldX1 > neBound.x || 
            worldY2 > neBound.y || worldY1 < swBound.y) {
          return null;
        }

        const bbox = `${worldX1},${worldY2},${worldX2},${worldY1}`;
        return `http://localhost:3001/api/cadastre-tile?bbox=${bbox}&layers=show:0,1,2&zoom=${zoom}`;
      },
      tileSize: new google.maps.Size(256, 256),
      minZoom: 0,
      maxZoom: 19,
      opacity: 0.7,
      name: 'Cadastre'
    });

    const zoningLayer = new google.maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        console.log('Requesting zoning tile:', { coord, zoom });
        const scale = 1 << zoom;
        const worldSize = 256 * scale;
        
        const pixelX = coord.x * 256;
        const pixelY = coord.y * 256;
        
        const worldX1 = (pixelX / worldSize) * 40075016.68 - 20037508.34;
        const worldX2 = ((pixelX + 256) / worldSize) * 40075016.68 - 20037508.34;
        const worldY1 = 20037508.34 - (pixelY / worldSize) * 40075016.68;
        const worldY2 = 20037508.34 - ((pixelY + 256) / worldSize) * 40075016.68;

        const bbox = `${worldX1},${worldY2},${worldX2},${worldY1}`;
        return `http://localhost:3001/api/zoning-tile?bbox=${bbox}&zoom=${zoom}`;
      },
      tileSize: new google.maps.Size(256, 256),
      minZoom: 0,
      maxZoom: 19,
      opacity: 0.5,
      name: 'Zoning'
    });

    setMapLayers({ cadastre: cadastreLayer, zoning: zoningLayer });
    
    // Initialize layers based on visibility state
    const overlays = mapInstance.overlayMapTypes;
    overlays.clear();
    
    if (layerVisibility.zoning) {
      overlays.push(zoningLayer);
    }
    if (layerVisibility.cadastre) {
      overlays.push(cadastreLayer);
    }
  };

  useEffect(() => {
    if (!mapInstanceRef.current || !mapLayers.cadastre || !mapLayers.zoning) return;

    console.log('Updating layer visibility:', layerVisibility);
    
    // Clear existing overlays
    const overlays = mapInstanceRef.current.overlayMapTypes;
    overlays.clear();
    
    // Add layers in specific order
    if (layerVisibility.zoning) {
      overlays.push(mapLayers.zoning);
    }
    if (layerVisibility.cadastre) {
      overlays.push(mapLayers.cadastre);
    }
  }, [layerVisibility, mapLayers]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    console.log('Initializing map...');
    
    loader.load()
      .then((google) => {
        console.log('Google Maps loaded');
        
        const mapInstance = new google.maps.Map(mapContainerRef.current, {
          center: NSW_CENTER,
          zoom: 18,
          mapTypeId: 'satellite',
          tilt: 0,
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
          }
        });
        
        mapInstanceRef.current = mapInstance;

        createLayers(google, mapInstance);

        mapInstance.addListener('click', async (e) => {
          try {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            
            console.log('Map clicked:', { lat, lng });
            
            const response = await fetch(
              `http://localhost:3001/api/property?lat=${lat}&lng=${lng}`
            );
            const data = await response.json();
            
            console.log('Property data received:', data);
            
            if (data?.cadastre?.features?.length > 0) {
              const property = data.cadastre.features[0].attributes;
              const zoning = data.zoning?.features?.[0]?.attributes;
              
              setSelectedProperty({
                lotDp: property.lot_number ? 
                  `${property.lot_number}/${property.dp_plan_number}` : 
                  'Lot/DP not available',
                area: property.area_sqm,
                address: property.address || 'Address not available',
                zone: zoning?.zone_name || 'Zone information not available',
                council: zoning?.lga_name || 'Council information not available'
              });
            } else {
              setSelectedProperty(null);
            }
          } catch (error) {
            console.error('Error fetching property info:', error);
            setSelectedProperty(null);
          }
        });
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
        setMapError('Failed to load map. Please try refreshing the page.');
      });

    return () => {
      if (mapInstanceRef.current && window.google?.maps) {
        window.google.maps.event.clearInstanceListeners(mapInstanceRef.current);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', padding: '20px' }}>
      <div style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '16px', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'}}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Property Map View</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={layerVisibility.cadastre}
                onChange={(e) => setLayerVisibility(prev => ({
                  ...prev,
                  cadastre: e.target.checked
                }))}
              />
              Cadastre
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={layerVisibility.zoning}
                onChange={(e) => setLayerVisibility(prev => ({
                  ...prev,
                  zoning: e.target.checked
                }))}
              />
              Zoning
            </label>
          </div>
        </div>
        <div style={{ 
          width: '100%', 
          height: 'calc(100% - 65px)',
          position: 'relative' 
        }}>
          {mapError ? (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'red',
              textAlign: 'center'
            }}>
              {mapError}
            </div>
          ) : (
            <div 
              ref={mapContainerRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: '#f0f0f0'
              }}
            />
          )}
          {selectedProperty && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'white',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              maxWidth: '300px',
              zIndex: 1
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                Property Details
              </h3>
              <p><strong>Lot/DP:</strong> {selectedProperty.lotDp}</p>
              {selectedProperty.address && (
                <p><strong>Address:</strong> {selectedProperty.address}</p>
              )}
              {selectedProperty.area && (
                <p><strong>Area:</strong> {selectedProperty.area.toFixed(2)} m²</p>
              )}
              <p><strong>Zone:</strong> {selectedProperty.zone}</p>
              <p><strong>Council:</strong> {selectedProperty.council}</p>
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                Note: Please consult council documentation for detailed development controls and setbacks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyMapViewer;