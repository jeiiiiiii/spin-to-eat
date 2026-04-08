/**
 * RadiusSlider.jsx - Standalone radius control component
 * Used inside FilterPanel for radius filtering
 */

export function RadiusSlider({ value, onChange }) {
  const radiusOptions = [
    { value: 500, label: '500m ' },
    {},
    { value: 1000, label: '1km ' },
    { value: 2000, label: '2km ' },
    { value: 5000, label: '5km' },
  ];

  const currentIndex = radiusOptions.findIndex((opt) => opt.value === value);

  const handleChange = (e) => {
    const index = parseInt(e.target.value, 10);
    onChange(radiusOptions[index].value);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-[#1F2937] text-center flex-1">
          Search Radius
        </label>
        <span className="text-sm font-semibold text-[#0067A5]">
          {radiusOptions[currentIndex]?.label}
        </span>
      </div>
      
      <input
        type="range"
        min="0"
        max={radiusOptions.length - 1}
        step="1"
        value={currentIndex}
        onChange={handleChange}
        className="w-full h-2 bg-[#E6F2FA] rounded-full appearance-none cursor-pointer slider-thumb"
        style={{
          accentColor: '#0067A5'
        }}
      />
      
      <div className="flex justify-between text-xs text-[#6B7280]">
        {radiusOptions.map((opt, index) => (
          <span key={opt.value || index}>{opt.label}</span>
        ))}
      </div>
    </div>
  );
}
