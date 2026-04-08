/**
 * useRestaurants.js - The ONLY way components interact with restaurant data
 * Manages restaurant fetching and integrates with AppContext
 */

import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../../store/AppContext';
import { actionTypes } from '../../store/AppReducer';
import PlacesRepository from './placesService';

export function useRestaurants(locationOverride = null) {
  const { state, dispatch } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [allFetchedRestaurants, setAllFetchedRestaurants] = useState([]); // Store all fetched restaurants
  const hasFetchedRef = useRef(false);

  // Use override location if provided, otherwise use context location
  const location = locationOverride || state.userLocation;

  // Fetch restaurants when location becomes available
  useEffect(() => {
    // Only fetch if we have a location and haven't fetched yet
    if (!location || hasFetchedRef.current) {
      return;
    }

    const fetchRestaurants = async () => {
      hasFetchedRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const { lat, lng } = location;
        const radius = state.activeFilters?.radius || 1000;

        // Fetch restaurants from API
        const { restaurants: fetchedRestaurants, totalCount } = await PlacesRepository.getNearbyRestaurants({
          lat,
          lng,
          radius,
        });

        // Store all fetched restaurants
        setAllFetchedRestaurants(fetchedRestaurants);

        // Dispatch total count to AppContext (only if using context location)
        if (!locationOverride) {
          dispatch({
            type: actionTypes.SET_TOTAL_RESTAURANTS_COUNT,
            payload: totalCount,
          });
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError(err.message);
        setRestaurants([]);
        setAllFetchedRestaurants([]);
        
        // Dispatch empty array on error (only if using context location)
        if (!locationOverride) {
          dispatch({
            type: actionTypes.SET_RESTAURANTS,
            payload: [],
          });
          dispatch({
            type: actionTypes.SET_TOTAL_RESTAURANTS_COUNT,
            payload: 0,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [location, state.activeFilters?.radius, dispatch, locationOverride]);

  // Apply limit when it changes (without re-fetching)
  useEffect(() => {
    if (allFetchedRestaurants.length === 0) {
      return;
    }

    const limit = state.activeFilters?.restaurantLimit || 15;
    const limitedRestaurants = allFetchedRestaurants.slice(0, limit);

    // Update local state
    setRestaurants(limitedRestaurants);

    // Dispatch to AppContext (only if using context location)
    if (!locationOverride) {
      dispatch({
        type: actionTypes.SET_RESTAURANTS,
        payload: limitedRestaurants,
      });

      // Also set wheel restaurants
      dispatch({
        type: actionTypes.SET_WHEEL_RESTAURANTS,
        payload: limitedRestaurants,
      });
    }
  }, [allFetchedRestaurants, state.activeFilters?.restaurantLimit, dispatch, locationOverride]);

  const refetch = async () => {
    if (!location) return;

    hasFetchedRef.current = false;
    setIsLoading(true);
    setError(null);

    try {
      const { lat, lng } = location;
      const radius = state.activeFilters?.radius || 1000;

      const { restaurants: fetchedRestaurants, totalCount } = await PlacesRepository.getNearbyRestaurants({
        lat,
        lng,
        radius,
      });

      // Store all fetched restaurants
      setAllFetchedRestaurants(fetchedRestaurants);

      if (!locationOverride) {
        dispatch({
          type: actionTypes.SET_TOTAL_RESTAURANTS_COUNT,
          payload: totalCount,
        });
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError(err.message);
      setRestaurants([]);
      setAllFetchedRestaurants([]);
      
      if (!locationOverride) {
        dispatch({
          type: actionTypes.SET_RESTAURANTS,
          payload: [],
        });
        dispatch({
          type: actionTypes.SET_TOTAL_RESTAURANTS_COUNT,
          payload: 0,
        });
      }
    } finally {
      setIsLoading(false);
      hasFetchedRef.current = true;
    }
  };

  return {
    restaurants: locationOverride ? restaurants : state.allRestaurants,
    isLoading,
    error,
    refetch,
  };
}
