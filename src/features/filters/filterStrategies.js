/**
 * filterStrategies.js - Strategy Pattern
 * Pure functions for filtering restaurants
 * Each strategy is independent and composable
 */

/**
 * Haversine formula to calculate distance between two coordinates
 * @param {Object} locationA - { lat, lng }
 * @param {Object} locationB - { lat, lng }
 * @returns {number} Distance in meters
 */
export const getDistance = (locationA, locationB) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (locationA.lat * Math.PI) / 180;
  const φ2 = (locationB.lat * Math.PI) / 180;
  const Δφ = ((locationB.lat - locationA.lat) * Math.PI) / 180;
  const Δλ = ((locationB.lng - locationA.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Filter strategies - each is a pure function
 * Same input always produces same output
 */
export const filterStrategies = {
  openNow: (restaurants) => restaurants.filter((r) => {
    // If isOpen is null (unknown), include the restaurant
    // Only filter out if explicitly closed (false)
    return r.isOpen !== false;
  }),

  priceLevel: (restaurants, level) =>
    restaurants.filter((r) => r.priceLevel === level),

  radius: (restaurants, maxMeters, userLocation) =>
    restaurants.filter((r) => {
      if (!userLocation || !r.location) return true;
      return getDistance(r.location, userLocation) <= maxMeters;
    }),
};

/**
 * Applies all active filters to a restaurant list
 * @param {Array} restaurants - List of restaurants to filter
 * @param {Object} activeFilters - Object with filter keys and values
 * @param {Object} userLocation - User's current location { lat, lng }
 * @returns {Array} Filtered restaurant list
 */
export const applyFilters = (restaurants, activeFilters, userLocation) =>
  Object.entries(activeFilters).reduce((results, [key, value]) => {
    // Skip if no value or strategy doesn't exist
    if (!value || !filterStrategies[key]) return results;
    
    // Skip openNow filter if value is false (don't filter by opening hours)
    if (key === 'openNow' && value === false) return results;
    
    // Apply the filter strategy
    return filterStrategies[key](results, value, userLocation);
  }, restaurants);
