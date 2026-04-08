/**
 * Wheel Commands - Pure state transition logic using Command Pattern
 * All wheel state mutations are centralized here
 */

export const WheelCommands = {
  /**
   * Start spinning the wheel
   */
  spin: (state) => ({
    ...state,
    isSpinning: true,
    winner: null,
  }),

  /**
   * Set the winner after spin completes
   */
  setWinner: (state, restaurant) => ({
    ...state,
    isSpinning: false,
    winner: restaurant,
  }),

  /**
   * Remove a restaurant from the wheel
   */
  removeRestaurant: (state, id) => ({
    ...state,
    wheelRestaurants: state.wheelRestaurants.filter((r) => r.id !== id),
  }),

  /**
   * Respin the wheel with current restaurants
   */
  respin: (state) => ({
    ...state,
    winner: null,
    isSpinning: true,
  }),

  /**
   * Reset wheel to initial state
   */
  resetWheel: (state) => ({
    ...state,
    winner: null,
    isSpinning: false,
    vetoedIds: [],
  }),
};
