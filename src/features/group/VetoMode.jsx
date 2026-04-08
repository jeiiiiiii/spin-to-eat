import { useAppContext } from '../../store/AppContext';
import { actionTypes } from '../../store/AppReducer';
import Button from '../../shared/components/Button';

/**
 * VetoMode component
 * - Toggle button to enter/exit veto mode
 * - Shows banner when active
 * - Allows removing restaurants from wheel
 * - "Done - Spin Now" button to exit and trigger spin
 */
export function VetoMode({ onSpinClick }) {
  const { state, dispatch } = useAppContext();
  const { vetoMode, wheelRestaurants, vetoedIds } = state;

  const toggleVetoMode = () => {
    dispatch({ type: actionTypes.TOGGLE_VETO_MODE });
  };

  const handleVeto = (restaurantId) => {
    // Remove from wheelRestaurants
    const updatedRestaurants = wheelRestaurants.filter(
      r => r.place_id !== restaurantId
    );
    
    dispatch({
      type: actionTypes.SET_WHEEL_RESTAURANTS,
      payload: updatedRestaurants,
    });
    
    // Track vetoed ID
    dispatch({
      type: actionTypes.VETO_RESTAURANT,
      payload: restaurantId,
    });
  };

  const handleDoneAndSpin = () => {
    // Exit veto mode
    dispatch({ type: actionTypes.TOGGLE_VETO_MODE });
    
    // Trigger spin only if there are restaurants and callback provided
    if (onSpinClick && wheelRestaurants.length > 0) {
      onSpinClick();
    }
  };

  return (
    <div className="space-y-3">
      {/* Veto mode banner */}
      {vetoMode && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
          <p className="text-orange-800 font-semibold mb-2">
            Veto Mode — each person tap one restaurant to remove it
          </p>
          <p className="text-sm text-orange-600">
            {wheelRestaurants.length} restaurant{wheelRestaurants.length !== 1 ? 's' : ''} remaining
          </p>
        </div>
      )}

      {/* Toggle veto mode button */}
      {!vetoMode ? (
        <Button
          onClick={toggleVetoMode}
          variant="secondary"
          className="w-full"
        >
          🚫 Enable Veto Mode
        </Button>
      ) : (
        <div className="space-y-2">
          {/* Restaurant list with veto buttons */}
          <div className="bg-white rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
            {wheelRestaurants.map((restaurant) => (
              <div
                key={restaurant.place_id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition"
              >
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-800 text-sm">
                    {restaurant.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {restaurant.vicinity}
                  </p>
                </div>
                <button
                  onClick={() => handleVeto(restaurant.place_id)}
                  className="ml-3 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  aria-label={`Veto ${restaurant.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Done and spin button */}
          <Button
            onClick={handleDoneAndSpin}
            variant="primary"
            className="w-full"
          >
            ✓ Done — Spin Now
          </Button>

          {/* Cancel button */}
          <Button
            onClick={toggleVetoMode}
            variant="secondary"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

export default VetoMode;
