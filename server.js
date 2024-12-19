const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/cadastre-tile', async (req, res) => {
    const { bbox, layers = 'show:0,1,2' } = req.query;
    
    try {
        const response = await axios.get(
            'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Cadastre/MapServer/export',
            {
                params: {
                    dpi: 96,
                    transparent: true,
                    format: 'png32',
                    layers,
                    bbox,
                    bboxSR: 3857,
                    imageSR: 3857,
                    size: '256,256',
                    f: 'image'
                },
                responseType: 'arraybuffer'
            }
        );
        
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error('Cadastre export proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch cadastre tile' });
    }
});

app.get('/api/zoning-tile', async (req, res) => {
    const { bbox, zoom } = req.query;
    
    try {
        console.log(`Requesting zoning tile: bbox=${bbox}, zoom=${zoom}`);
        const response = await axios.get(
            'https://api.apps1.nsw.gov.au/planning/arcgis/V1/rest/services/ePlanning/Planning_Portal_Principal_Planning/MapServer/export',
            {
                params: {
                    dpi: 96,
                    transparent: true,
                    format: 'png32',
                    layers: 'show:19',  // Land Zoning Map layer
                    bbox,
                    bboxSR: 102100,
                    imageSR: 102100,
                    size: '256,256',
                    f: 'image'
                },
                responseType: 'arraybuffer'
            }
        );
        
        console.log('Zoning tile fetched successfully');
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error('Zoning export proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch zoning tile' });
    }
});

app.get('/api/property', async (req, res) => {
    const { lat, lng } = req.query;
    
    try {
        const cadastreResponse = await axios.get(
            'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Cadastre/MapServer/0/query',
            {
                params: {
                    f: 'json',
                    geometry: JSON.stringify({
                        x: lng,
                        y: lat,
                        spatialReference: { wkid: 4326 }
                    }),
                    geometryType: 'esriGeometryPoint',
                    spatialRel: 'esriSpatialRelIntersects',
                    outFields: 'lot_number,dp_plan_number,area_sqm,address',
                    returnGeometry: false
                }
            }
        );

        const zoningResponse = await axios.get(
            'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Planning_Portal/LEP/MapServer/1/query',
            {
                params: {
                    f: 'json',
                    geometry: JSON.stringify({
                        x: lng,
                        y: lat,
                        spatialReference: { wkid: 4326 }
                    }),
                    geometryType: 'esriGeometryPoint',
                    spatialRel: 'esriSpatialRelIntersects',
                    outFields: '*',
                    returnGeometry: false
                }
            }
        );
        
        res.json({
            cadastre: cadastreResponse.data,
            zoning: zoningResponse.data
        });
    } catch (error) {
        console.error('Property lookup error:', error);
        res.status(500).json({ error: 'Failed to fetch property data' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});