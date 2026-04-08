import { WheelCommands } from '../features/wheel/wheelCommands';

// Action types
export const actionTypes = {
  SET_LOCATION: 'SET_LOCATION',
  SET_LOCATION_ERROR: 'SET_LOCATION_ERROR',
  SET_RESTAURANTS: 'SET_RESTAURANTS',
  SET_FILTERS: 'SET_FILTERS',
  SET_FILTERED_RESTAURANTS: 'SET_FILTERED_RESTAURANTS',
  SET_WHEEL_RESTAURANTS: 'SET_WHEEL_RESTAURANTS',
  SPIN: 'SPIN',
  SET_WINNER: 'SET_WINNER',
  REMOVE_RESTAURANT: 'REMOVE_RESTAURANT',
  TOGGLE_VETO_MODE: 'TOGGLE_VETO_MODE',
  VETO_RESTAURANT: 'VETO_RESTAURANT',
  RESPIN: 'RESPIN',
  RESET_WHEEL: 'RESET_WHEEL',
  SET_TOTAL_RESTAURANTS_COUNT: 'SET_TOTAL_RESTAURANTS_COUNT',
};

// Initial state
export const initialState = {
  userLocation: null,
  locationError: null,
  allRestaurants: [],
  filteredRestaurants: [],
  wheelRestaurants: [],
  activeFilters: {
    priceLevel: null,
    radius: 1000,
    openNow: false, // Changed to false since OSM doesn't provide opening hours
    restaurantLimit: 15, // Default limit for restaurants
  },
  totalRestaurantsCount: 0, // Total count of fetched restaurants before limiting
  winner: null,
  isSpinning: false,
  vetoMode: false,
  vetoedIds: [],
  isLoading: false,
  error: null,
};

// Reducer function - handlers will be implemented as features are built
export function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOCATION:
      return {
        ...state,
        userLocation: action.payload,
        locationError: null,
      };

    case actionTypes.SET_LOCATION_ERROR:
      return {
        ...state,
        locationError: action.payload,
      };

    case actionTypes.SET_RESTAURANTS:
      return {
        ...state,
        allRestaurants: action.payload,
        wheelRestaurants: action.payload,
        isLoading: false,
        error: null,
      };

    case actionTypes.SET_FILTERS:
      return {
        ...state,
        activeFilters: { ...state.activeFilters, ...action.payload },
      };

    case actionTypes.SET_FILTERED_RESTAURANTS:
      return {
        ...state,
        filteredRestaurants: action.payload,
      };

    case actionTypes.SET_WHEEL_RESTAURANTS:
      return {
        ...state,
        wheelRestaurants: action.payload,
      };

    case actionTypes.SPIN:
      return WheelCommands.spin(state);

    case actionTypes.SET_WINNER:
      return WheelCommands.setWinner(state, action.payload);

    case actionTypes.REMOVE_RESTAURANT:
      return WheelCommands.removeRestaurant(state, action.payload);

    case actionTypes.RESPIN:
      return WheelCommands.respin(state);

    case actionTypes.RESET_WHEEL:
      return WheelCommands.resetWheel(state);

    case actionTypes.TOGGLE_VETO_MODE:
      return {
        ...state,
        vetoMode: !state.vetoMode,
      };

    case actionTypes.VETO_RESTAURANT:
      return {
        ...state,
        vetoedIds: [...state.vetoedIds, action.payload],
      };

    case actionTypes.SET_TOTAL_RESTAURANTS_COUNT:
      return {
        ...state,
        totalRestaurantsCount: action.payload,
      };

    default:
      return state;
  }
}

// Export with capital A for backward compatibility
export { appReducer as AppReducer };
