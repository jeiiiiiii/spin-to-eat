/**
 * placesService.js - Repository Pattern
 * The ONLY file in the entire app that calls the OpenStreetMap Overpass API
 * All responses are normalized through toRestaurant() before returning
 */

import { toRestaurant } from './restaurantUtils';

// Overpass API endpoints - use multiple mirrors for fallback
const OVERPASS_APIS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

const PlacesRepository = {
  /**
   * Fetches nearby restaurants based on location and radius
   * @param {Object} params - Search parameters
   * @param {number} params.lat - Latitude
   * @param {number} params.lng - Longitude
   * @param {number} params.radius - Search radius in meters
   * @returns {Promise<Array>} Array of normalized Restaurant objects
   */
  async getNearbyRestaurants({ lat, lng, radius }) {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      // Build Overpass QL query for restaurants
      const query = `
        [out:json][timeout:15];
        (
          node["amenity"="restaurant"](around:${radius},${lat},${lng});
          way["amenity"="restaurant"](around:${radius},${lat},${lng});
        );
        out body;
      `;

      // Try each API endpoint until one succeeds
      let lastError = null;
      
      for (let i = 0; i < OVERPASS_APIS.length; i++) {
        const apiUrl = OVERPASS_APIS[i];
        
        try {
          console.log(`[Attempt ${retryCount + 1}/${maxRetries}] Trying Overpass API ${i + 1}/${OVERPASS_APIS.length}: ${apiUrl}`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();
          
          // Normalize all results through toRestaurant()
          const allNormalizedRestaurants = data.elements
            .filter(element => element.tags?.name) // Only include places with names
            .map(toRestaurant);
          
          console.log(`✓ Successfully fetched ${allNormalizedRestaurants.length} restaurants from ${apiUrl}`);
          
          // If we got restaurants, return them
          if (allNormalizedRestaurants.length > 0) {
            return {
              restaurants: allNormalizedRestaurants,
              totalCount: allNormalizedRestaurants.length
            };
          }
          
          // If no restaurants found, log and continue to retry
          console.warn(`⚠ No restaurants found in this attempt`);
          lastError = new Error('No restaurants found');
          break; // Break inner loop to retry all APIs again
        } catch (error) {
          const errorMsg = error.name === 'AbortError' ? 'Request timeout' : error.message;
          console.warn(`✗ Failed to fetch from ${apiUrl}: ${errorMsg}`);
          lastError = error;
          
          // Small delay before trying next endpoint (except for last one)
          if (i < OVERPASS_APIS.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }
      
      // Increment retry count
      retryCount++;
      
      // If we've exhausted all retries, throw error
      if (retryCount >= maxRetries) {
        console.error('All retry attempts exhausted');
        throw new Error('Unable to fetch restaurants after multiple attempts. All API servers are currently unavailable or no restaurants found. Please try again in a moment.');
      }
      
      // Wait before retrying all APIs again
      console.log(`Retrying in 1 second...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },

  /**
   * Fetches detailed information for a specific restaurant
   * @param {string} osmId - OpenStreetMap ID (format: "node/123" or "way/456")
   * @returns {Promise<Object>} Single normalized Restaurant object
   */
  async getRestaurantDetails(osmId) {
    const [type, id] = osmId.split('/');
    
    const query = `
      [out:json][timeout:15];
      ${type}(${id});
      out body;
    `;

    // Try each API endpoint until one succeeds
    let lastError = null;
    
    for (let i = 0; i < OVERPASS_APIS.length; i++) {
      const apiUrl = OVERPASS_APIS[i];
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          body: `data=${encodeURIComponent(query)}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.elements.length === 0) {
          throw new Error('Restaurant not found');
        }

        const normalizedRestaurant = toRestaurant(data.elements[0]);
        return normalizedRestaurant;
      } catch (error) {
        const errorMsg = error.name === 'AbortError' ? 'Request timeout' : error.message;
        console.warn(`Failed to fetch details from ${apiUrl}: ${errorMsg}`);
        lastError = error;
        
        // Small delay before trying next endpoint (except for last one)
        if (i < OVERPASS_APIS.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
    
    // If all endpoints failed, throw the last error
    console.error('All Overpass API endpoints failed for restaurant details');
    throw new Error('Unable to fetch restaurant details. Please try again in a moment.');
  },

  /**
   * Fallback manual search by area/query
   * @param {string} query - Search query (city or area name)
   * @returns {Promise<Array>} Array of normalized Restaurant objects
   */
  async searchByArea(query) {
    try {
      // Use Nominatim to geocode the query first
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      
      if (!geocodeResponse.ok) {
        throw new Error('Geocoding failed');
      }

      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.length === 0) {
        return [];
      }

      const { lat, lon } = geocodeData[0];
      
      // Search for restaurants in that area (5km radius)
      return this.getNearbyRestaurants({
        lat: parseFloat(lat),
        lng: parseFloat(lon),
        radius: 5000,
      });
    } catch (error) {
      console.error('Error searching by area:', error);
      throw error;
    }
  },
};

export default PlacesRepository;
