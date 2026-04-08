import { useCallback } from 'react';
import { useAppContext } from '../../store/AppContext';
import { actionTypes } from '../../store/AppReducer';
import { playSpinSound } from '../../shared/utils/soundManager';

const SPIN_DURATION = 3000; // 3 seconds animation

/**
 * Custom hook for wheel spin logic
 * Manages spin state, winner selection, and sound effects
 */
export function useWheel() {
  const { state, dispatch } = useAppContext();
  const { wheelRestaurants, isSpinning, winner } = state;

  /**
   * Start spinning the wheel and select a random winner
   */
  const spin = useCallback(() => {
    if (isSpinning) return;

    // Play spin sound
    playSpinSound();

    // Start spinning
    dispatch({ type: actionTypes.SPIN });

    // After animation completes, pick a random winner
    setTimeout(() => {
      if (wheelRestaurants.length > 0) {
        const randomIndex = Math.floor(Math.random() * wheelRestaurants.length);
        const selectedWinner = wheelRestaurants[randomIndex];
        
        console.log('🎉 Winner selected:', selectedWinner);
        
        dispatch({
          type: actionTypes.SET_WINNER,
          payload: selectedWinner,
        });
      } else {
        // No restaurants available, just stop spinning
        dispatch({
          type: actionTypes.SET_WINNER,
          payload: null,
        });
      }
    }, SPIN_DURATION);
  }, [dispatch, isSpinning, wheelRestaurants]);

  /**
   * Respin the wheel with current restaurants
   */
  const respin = useCallback(() => {
    if (isSpinning || wheelRestaurants.length === 0) return;

    // Play spin sound
    playSpinSound();

    // Start respinning
    dispatch({ type: actionTypes.RESPIN });

    // After animation completes, pick a random winner
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * wheelRestaurants.length);
      const selectedWinner = wheelRestaurants[randomIndex];
      
      console.log('🎉 Winner selected (respin):', selectedWinner);
      
      dispatch({
        type: actionTypes.SET_WINNER,
        payload: selectedWinner,
      });
    }, SPIN_DURATION);
  }, [dispatch, isSpinning, wheelRestaurants]);

  /**
   * Remove a restaurant from the wheel
   */
  const remove = useCallback(
    (id) => {
      dispatch({
        type: actionTypes.REMOVE_RESTAURANT,
        payload: id,
      });
    },
    [dispatch]
  );

  /**
   * Reset the wheel to initial state
   */
  const reset = useCallback(() => {
    dispatch({ type: actionTypes.RESET_WHEEL });
  }, [dispatch]);

  return {
    spin,
    respin,
    remove,
    reset,
    isSpinning,
    winner,
    wheelRestaurants,
  };
}
