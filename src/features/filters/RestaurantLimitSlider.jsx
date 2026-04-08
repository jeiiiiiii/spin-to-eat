/**
 * RestaurantLimitSlider.jsx - Restaurant limit control component
 * Only shown when more than 15 restaurants are fetched
 */

export function RestaurantLimitSlider({ value, onChange, totalCount }) {
  const limitOptions = [
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 25, label: '25' },
    { value: 30, label: '30' },
  ];

  const currentIndex = limitOptions.findIndex((opt) => opt.value === value);

  const handleChange = (e) => {
    const index = parseInt(e.target.value, 10);
    onChange(limitOptions[index].value);
  };

  return (
    <div className="space-y-3 pt-4 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-[#1F2937] text-center flex-1">
          Restaurant Limit
        </label>
        <span className="text-sm font-semibold text-[#0067A5]">
          {value} of {totalCount}
        </span>
      </div>
      
      <input
        type="range"
        min="0"
        max={limitOptions.length - 1}
        step="1"
        value={currentIndex}
        onChange={handleChange}
        className="w-full h-2 bg-[#E6F2FA] rounded-full appearance-none cursor-pointer slider-thumb"
        style={{
          accentColor: '#0067A5'
        }}
      />
      
      <div className="flex justify-between text-xs text-[#6B7280]">
        {limitOptions.map((opt) => (
          <span key={opt.value}>{opt.label}</span>
        ))}
      </div>
    </div>
  );
}
