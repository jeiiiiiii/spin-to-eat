/**
 * URL encoder/decoder for sharing wheel state
 * Encodes restaurants and filters into URL-safe string
 */

/**
 * Encodes wheel state into URL-safe string
 * @param {Object} state - The wheel state to encode
 * @param {Array} state.restaurants - Array of restaurant objects
 * @param {Object} state.filters - Active filters object
 * @returns {string} URL-safe encoded string
 */
export function encodeWheelState({ restaurants, filters }) {
  try {
    const stateObj = {
      restaurants: restaurants,
      filters: filters,
    };
    
    const jsonString = JSON.stringify(stateObj);
    const base64 = btoa(encodeURIComponent(jsonString));
    return base64;
  } catch (error) {
    console.error('Failed to encode wheel state:', error);
    return '';
  }
}

/**
 * Decodes URL-safe string back to wheel state
 * @param {string} encodedString - The encoded string from URL
 * @returns {Object|null} Decoded state with restaurants and filters, or null if invalid
 */
export function decodeWheelState(encodedString) {
  try {
    if (!encodedString) return null;
    
    const jsonString = decodeURIComponent(atob(encodedString));
    const stateObj = JSON.parse(jsonString);
    
    // Validate structure
    if (!stateObj.restaurants || !Array.isArray(stateObj.restaurants)) {
      return null;
    }
    
    return {
      restaurants: stateObj.restaurants,
      filters: stateObj.filters || {},
    };
  } catch (error) {
    console.error('Failed to decode wheel state:', error);
    return null;
  }
}
