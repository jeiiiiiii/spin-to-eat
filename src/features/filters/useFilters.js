/**
 * useFilters.js - Custom hook for filter management
 * Reads from AppContext, applies filters, and dispatches results
 */

import { useEffect, useCallback } from 'react';
import { useAppContext } from '../../store/AppContext';
import { actionTypes } from '../../store/AppReducer';
import { applyFilters } from './filterStrategies';

export function useFilters() {
  const { state, dispatch } = useAppContext();
  const { allRestaurants, activeFilters, userLocation } = state;

  // Apply filters whenever restaurants or filters change
  useEffect(() => {
    if (!allRestaurants || allRestaurants.length === 0) {
      dispatch({
        type: actionTypes.SET_FILTERED_RESTAURANTS,
        payload: [],
      });
      dispatch({
        type: actionTypes.SET_WHEEL_RESTAURANTS,
        payload: [],
      });
      return;
    }

    // Apply all active filters
    const filtered = applyFilters(allRestaurants, activeFilters, userLocation);

    // Update both filtered and wheel restaurants
    dispatch({
      type: actionTypes.SET_FILTERED_RESTAURANTS,
      payload: filtered,
    });

    dispatch({
      type: actionTypes.SET_WHEEL_RESTAURANTS,
      payload: filtered,
    });
  }, [allRestaurants, activeFilters, userLocation, dispatch]);

  // Set a single filter
  const setFilter = useCallback(
    (filterKey, value) => {
      dispatch({
        type: actionTypes.SET_FILTERS,
        payload: { [filterKey]: value },
      });
    },
    [dispatch]
  );

  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    dispatch({
      type: actionTypes.SET_FILTERS,
      payload: {
        priceLevel: null,
        radius: 1000,
        openNow: true,
      },
    });
  }, [dispatch]);

  return {
    filtered: state.filteredRestaurants,
    activeFilters,
    setFilter,
    resetFilters,
  };
}
