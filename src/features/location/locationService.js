/**
 * LocationService - Clean wrapper around browser Geolocation API
 * This is the ONLY file that directly interacts with navigator.geolocation
 */

const LocationService = {
  /**
   * Get current position once
   * @returns {Promise<{lat: number, lng: number}>}
   */
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'An unknown error occurred';
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  },

  /**
   * Watch position for live tracking (optional feature)
   * @param {Function} callback - Called with {lat, lng} on position updates
   * @returns {number} watchId - Use with stopWatching()
   */
  watchPosition(callback) {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser');
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Watch position error:', error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  },

  /**
   * Stop watching position
   * @param {number} watchId - ID returned from watchPosition()
   */
  stopWatching(watchId) {
    if (navigator.geolocation && watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  },
};

export default LocationService;
