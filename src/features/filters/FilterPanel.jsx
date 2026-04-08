/**
 * FilterPanel.jsx - Simple radius filter UI
 * Mobile-first, styled with Tailwind
 */

import { useFilters } from './useFilters';
import { RadiusSlider } from './RadiusSlider';
import { RestaurantLimitSlider } from './RestaurantLimitSlider';
import { useAppContext } from '../../store/AppContext';

export default function FilterPanel() {
  const { activeFilters, setFilter } = useFilters();
  const { state } = useAppContext();

  // Only show the restaurant limit slider if more than 15 restaurants were fetched
  const showLimitSlider = state.totalRestaurantsCount > 15;

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-blue-100 p-6">
      <RadiusSlider
        value={activeFilters.radius}
        onChange={(value) => setFilter('radius', value)}
      />
      
      {showLimitSlider && (
        <RestaurantLimitSlider
          value={activeFilters.restaurantLimit}
          onChange={(value) => setFilter('restaurantLimit', value)}
          totalCount={state.totalRestaurantsCount}
        />
      )}
    </div>
  );
}
