import { useEffect, useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { actionTypes } from '../../store/AppReducer';
import { encodeWheelState, decodeWheelState } from '../../shared/utils/urlEncoder';

/**
 * Hook for managing share link functionality
 * - Checks URL on mount for shared session
 * - Generates shareable URLs with encoded wheel state
 * - Restores shared sessions automatically
 */
export function useShareLink() {
  const { state, dispatch } = useAppContext();
  const [isSharedSession, setIsSharedSession] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // On mount, check for encoded state in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedState = params.get('state');
    
    if (encodedState) {
      const decodedState = decodeWheelState(encodedState);
      
      if (decodedState) {
        // Restore the shared session
        dispatch({
          type: actionTypes.SET_RESTAURANTS,
          payload: decodedState.restaurants,
        });
        
        dispatch({
          type: actionTypes.SET_FILTERS,
          payload: decodedState.filters,
        });
        
        setIsSharedSession(true);
      }
    }
  }, [dispatch]);

  /**
   * Generates a shareable URL with current wheel state
   * @returns {string} Full URL with encoded wheel state
   */
  const generateShareUrl = () => {
    const encoded = encodeWheelState({
      restaurants: state.wheelRestaurants,
      filters: state.activeFilters,
    });
    
    if (!encoded) {
      return '';
    }
    
    const baseUrl = window.location.origin + window.location.pathname;
    const url = `${baseUrl}?state=${encoded}`;
    setShareUrl(url);
    return url;
  };

  return {
    shareUrl,
    generateShareUrl,
    isSharedSession,
  };
}
