const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getPropertyDetails = async (address) => {
    let attempts = 0;
    
    while (attempts < MAX_RETRIES) {
        try {
            // Step 1: Get Property ID
            const searchResponse = await fetch(
                `https://api.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/address?a=${encodeURIComponent(address)}&noOfRecords=1`,
                {
                    headers: {
                        'Origin': 'https://www.planningportal.nsw.gov.au',
                        'Referer': 'https://www.planningportal.nsw.gov.au/'
                    }
                }
            );
            
            if (!searchResponse.ok) {
                throw new Error(`Address search failed: ${searchResponse.status}`);
            }
            
            const searchData = await searchResponse.json();
            console.log('Search Data:', searchData);
            
            if (!searchData || searchData.length === 0) {
                throw new Error('No matching property found');
            }

            const propertyId = searchData[0].propId;

            // Step 2: Get Zoning Details with retry
            let zoningResponse = await fetch(
                `https://api.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/layerintersect?type=property&id=${propertyId}&layers=epi`,
                {
                    headers: {
                        'Origin': 'https://www.planningportal.nsw.gov.au',
                        'Referer': 'https://www.planningportal.nsw.gov.au/'
                    }
                }
            );

            if (!zoningResponse.ok) {
                throw new Error(`Zoning data fetch failed: ${zoningResponse.status}`);
            }

            const zoningData = await zoningResponse.json();
            console.log('Zoning Data:', zoningData);
            
            // Validate data completeness
            if (!zoningData || zoningData.length === 0) {
                if (attempts < MAX_RETRIES - 1) {
                    console.log(`Incomplete data received, attempt ${attempts + 1} of ${MAX_RETRIES}`);
                    await sleep(RETRY_DELAY);
                    attempts++;
                    continue;
                }
                throw new Error('Incomplete property data received');
            }

            return zoningData;

        } catch (error) {
            if (attempts < MAX_RETRIES - 1) {
                console.error(`Attempt ${attempts + 1} failed:`, error);
                await sleep(RETRY_DELAY);
                attempts++;
            } else {
                throw error;
            }
        }
    }
};