/**
 * WheelSlice - Represents a single restaurant slice on the wheel
 * This is a presentational component for individual wheel segments
 */
export function WheelSlice({ restaurant, color }) {
  return (
    <div
      className="wheel-slice"
      style={{ backgroundColor: color }}
      data-restaurant-id={restaurant.id}
    >
      <span className="wheel-slice-text">{restaurant.name}</span>
    </div>
  );
}
