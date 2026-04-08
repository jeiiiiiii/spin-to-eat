/**
 * Format distance in meters to readable string
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance (e.g., "500m" or "1.2km")
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Format price level to peso symbols
 * @param {number} level - Price level (1-3)
 * @returns {string} Peso symbols (e.g., "₱", "₱₱", "₱₱₱")
 */
export function formatPriceLevel(level) {
  if (!level || level < 1) return '₱';
  if (level > 3) return '₱₱₱';
  return '₱'.repeat(level);
}

/**
 * Format rating with star symbol
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Formatted rating (e.g., "4.5 ★")
 */
export function formatRating(rating) {
  if (rating === null || rating === undefined) return 'No rating';
  // For whole numbers, don't show decimal
  if (Number.isInteger(rating)) return `${rating} ★`;
  return `${rating.toFixed(1)} ★`;
}

/**
 * Format opening hours from weekday text array
 * @param {string[]} weekdayText - Array of weekday hour strings
 * @returns {string} Readable hours string
 */
export function formatHours(weekdayText) {
  if (!weekdayText || weekdayText.length === 0) {
    return 'Hours not available';
  }
  
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1; // Convert Sunday=0 to Monday=0
  
  return weekdayText[dayIndex] || weekdayText[0];
}
