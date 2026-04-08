import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../../store/AppContext';
import { actionTypes } from '../../store/AppReducer';
import LocationService from './locationService';

/**
 * useLocation - The ONLY way components interact with location logic
 * Manages location state and integrates with AppContext
 */
export function useLocation() {
  const { state, dispatch } = useAppContext();
  const [isLocating, setIsLocating] = useState(false);

  const requestLocation = useCallback(async () => {
    setIsLocating(true);

    try {
      const position = await LocationService.getCurrentPosition();
      
      // Dispatch success to AppContext
      dispatch({
        type: actionTypes.SET_LOCATION,
        payload: position,
      });
    } catch (error) {
      console.error('Location error:', error);
      
      // Dispatch failure - set location to null and update error
      dispatch({
        type: actionTypes.SET_LOCATION,
        payload: null,
      });
      
      // Update locationError in state (handled by reducer)
      dispatch({
        type: actionTypes.SET_LOCATION_ERROR,
        payload: error.message,
      });
    } finally {
      setIsLocating(false);
    }
  }, [dispatch]);

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location: state.userLocation,
    locationError: state.locationError,
    isLocating,
    retry: requestLocation,
  };
}
