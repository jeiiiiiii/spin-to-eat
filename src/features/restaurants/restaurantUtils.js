/**
 * restaurantUtils.js - Facade Pattern
 * Normalizes raw OpenStreetMap/Overpass API responses into a consistent Restaurant shape
 * This is the ONLY place where raw API data is transformed
 */

/**
 * Converts raw OSM element to normalized Restaurant object
 * @param {Object} osmElement - Raw element from Overpass API
 * @returns {Object} Normalized restaurant object
 */
export const toRestaurant = (osmElement) => {
  const tags = osmElement.tags || {};
  
  // Get coordinates (handle both nodes and ways)
  let lat, lng;
  if (osmElement.lat && osmElement.lon) {
    // Node
    lat = osmElement.lat;
    lng = osmElement.lon;
  } else if (osmElement.center) {
    // Way with center
    lat = osmElement.center.lat;
    lng = osmElement.center.lon;
  } else {
    // Fallback
    lat = 0;
    lng = 0;
  }

  // Generate unique ID
  const id = `${osmElement.type}/${osmElement.id}`;

  // Extract cuisine type
  const cuisine = tags.cuisine || tags['cuisine:en'] || 'restaurant';

  // Map opening hours
  const isOpen = tags.opening_hours ? null : null; // OSM opening_hours is complex, simplified here
  
  // Generate URLs
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}`;
  
  return {
    id,
    place_id: id, // For compatibility with existing code
    name: tags.name || 'Unnamed Restaurant',
    photo: null, // OSM doesn't provide photos directly
    rating: 0, // OSM doesn't have ratings
    totalRatings: 0,
    user_ratings_total: 0, // For compatibility
    priceLevel: 0, // OSM doesn't have price levels
    price_level: 0, // For compatibility
    isOpen,
    hours: [],
    opening_hours: { isOpen: () => null }, // For compatibility
    address: tags['addr:street'] 
      ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}, ${tags['addr:city'] || ''}`.trim()
      : tags['addr:full'] || 'Address not available',
    vicinity: tags['addr:city'] || tags['addr:suburb'] || 'Unknown location',
    cuisine,
    types: [cuisine], // For compatibility
    location: {
      lat,
      lng,
    },
    geometry: {
      location: {
        lat: () => lat,
        lng: () => lng,
      },
    },
    menuUrl: tags.website || tags['contact:website'] || null,
    website: tags.website || tags['contact:website'] || null,
    mapsUrl,
    wazeUrl,
    reviews: [],
    phone: tags.phone || tags['contact:phone'] || null,
    email: tags.email || tags['contact:email'] || null,
  };
};
