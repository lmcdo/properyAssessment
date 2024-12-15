export const getPropertyDetails = async (address) => {
    try {
        // Step 1: Get Property ID
        const searchResponse = await fetch(`https://api.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/address?a=${encodeURIComponent(address)}&noOfRecords=1`, {
            headers: {
                'Origin': 'https://www.planningportal.nsw.gov.au',
                'Referer': 'https://www.planningportal.nsw.gov.au/'
            }
        });
        
        const searchData = await searchResponse.json();
        
        if (!searchData || searchData.length === 0) {
            throw new Error('No matching property found');
        }

        const propertyId = searchData[0].propId;

        // Step 2: Get Zoning Details
        const zoningResponse = await fetch(`https://api.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/layerintersect?type=property&id=${propertyId}&layers=epi`, {
            headers: {
                'Origin': 'https://www.planningportal.nsw.gov.au',
                'Referer': 'https://www.planningportal.nsw.gov.au/'
            }
        });

        return await zoningResponse.json();
    } catch (error) {
        throw error;
    }
};
