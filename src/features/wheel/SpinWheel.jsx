import { useEffect, useRef } from 'react';
import { Wheel } from 'spin-wheel';
import { useWheel } from './useWheel';
import { useAppContext } from '../../store/AppContext';

/**
 * SpinWheel - Interactive spinning wheel component
 * Core centerpiece of the app using spin-wheel library
 */
function SpinWheel() {
  const { state } = useAppContext();
  const { spin, isSpinning, wheelRestaurants } = useWheel();
  const wheelContainerRef = useRef(null);
  const wheelInstanceRef = useRef(null);

  // Initialize the wheel
  useEffect(() => {
    if (!wheelContainerRef.current) return;

    // Clear any existing wheel first
    if (wheelInstanceRef.current) {
      wheelInstanceRef.current = null;
    }
    
    // Clear the container
    wheelContainerRef.current.innerHTML = '';

    // If no restaurants, create a placeholder wheel
    const items = wheelRestaurants.length > 0 
      ? wheelRestaurants.map((restaurant, index) => {
          // Create vibrant gradient colors
          const colors = [
            '#0067A5', '#0088CC', '#5DADE2', '#48C9B0',
            '#3498DB', '#2E86C1', '#1F618D', '#5499C7'
          ];
          return {
            label: restaurant.name,
            backgroundColor: colors[index % colors.length],
            labelColor: '#FFFFFF',
          };
        })
      : [
          { label: 'Loading...', backgroundColor: '#0067A5', labelColor: '#FFFFFF' },
          { label: 'Please wait', backgroundColor: '#0088CC', labelColor: '#FFFFFF' },
          { label: 'Finding restaurants', backgroundColor: '#5DADE2', labelColor: '#FFFFFF' },
          { label: 'Near you', backgroundColor: '#48C9B0', labelColor: '#FFFFFF' },
        ];

    // Create wheel instance
    const wheel = new Wheel(wheelContainerRef.current, {
      items,
      borderWidth: 3,
      borderColor: '#FFFFFF',
      radius: 0.90,
      itemLabelRadius: 0.75,
      itemLabelRadiusMax: 0.3,
      itemLabelRotation: 0,
      itemLabelAlign: 'center',
      itemLabelBaselineOffset: 0,
      itemLabelFont: 'system-ui, -apple-system, sans-serif',
      itemLabelFontSizeMax: 60,
      itemBackgroundColors: items.map(item => item.backgroundColor),
      rotationSpeedMax: 600,
      rotationResistance: -100,
      lineWidth: 3,
      lineColor: '#FFFFFF',
      overlayImage: null,
    });

    wheelInstanceRef.current = wheel;

    // Force center the canvas after creation
    setTimeout(() => {
      const canvas = wheelContainerRef.current?.querySelector('canvas');
      if (canvas) {
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
      }
    }, 0);

    return () => {
      // Cleanup
      if (wheelInstanceRef.current) {
        wheelInstanceRef.current = null;
      }
      if (wheelContainerRef.current) {
        wheelContainerRef.current.innerHTML = '';
      }
    };
  }, [wheelRestaurants]);

  // Trigger wheel animation when spinning
  useEffect(() => {
    if (isSpinning && wheelInstanceRef.current && wheelRestaurants.length > 0) {
      // Calculate random rotation (3-5 full spins + random position)
      const fullSpins = 3 + Math.random() * 2; // 3-5 full rotations
      const randomPosition = Math.random(); // Random final position
      const totalRotation = (fullSpins + randomPosition) * 360;
      
      // Spin the wheel with calculated rotation
      wheelInstanceRef.current.spinToItem(
        Math.floor(Math.random() * wheelRestaurants.length),
        3000, // 3 second duration
        true, // Use easing
        2, // Number of revolutions
        1 // Easing function (1 = ease-out)
      );
    }
  }, [isSpinning, wheelRestaurants.length]);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100">
      {/* Location Badge - Top */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-[#0067A5] text-[#0067A5] rounded-full text-sm font-bold shadow-sm">
          <span className="w-2.5 h-2.5 bg-[#0067A5] rounded-full animate-pulse"></span>
        </div>
      </div>

      {/* Wheel Container with Arrow Pointer */}
      <div className="w-full flex justify-center mb-8 relative">
        <div className="relative">
          {/* Arrow Pointer - Fixed at top, pointing down - THIS IS THE WINNER INDICATOR */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-20">
            <div className="relative animate-bounce" style={{ animationDuration: '2s' }}>
              {/* Outer glow - larger and more visible */}
              <div className="absolute inset-0 blur-md">
                <div className="w-0 h-0 border-l-[28px] border-r-[28px] border-t-[45px] border-l-transparent border-r-transparent border-t-[#FF6B35]" />
              </div>
              {/* Main arrow - bigger and bolder */}
              <div className="relative w-0 h-0 border-l-[25px] border-r-[25px] border-t-[42px] border-l-transparent border-r-transparent border-t-[#FF6B35]"
                style={{
                  filter: 'drop-shadow(0 6px 10px rgba(255, 107, 53, 0.5))'
                }}
              />
              {/* Inner highlight */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[18px] border-l-transparent border-r-transparent border-t-[#FFD700]" />
              {/* Pulsing ring around arrow base */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-[#FF6B35] animate-ping opacity-75"></div>
            </div>
          </div>
          
          {/* Wheel with shadow and glow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-2xl"></div>
            <div
              ref={wheelContainerRef}
              className="wheel-container relative z-10"
              style={{
                filter: 'drop-shadow(0 10px 30px rgba(0, 103, 165, 0.3))'
              }}
            />
          </div>
        </div>
      </div>

      {/* Spin Button - Below Wheel */}
      <div className="flex justify-center mb-6">
        <button
          onClick={spin}
          disabled={isSpinning || wheelRestaurants.length === 0}
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            cursor: isSpinning || wheelRestaurants.length === 0 ? 'not-allowed' : 'pointer',
            backgroundColor: isSpinning || wheelRestaurants.length === 0 ? '#D1D5DB' : 'white',
            color: isSpinning || wheelRestaurants.length === 0 ? '#6B7280' : '#0067A5',
            border: isSpinning || wheelRestaurants.length === 0 ? 'none' : '2px solid #0067A5',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            minWidth: '100px'
          }}
          onMouseEnter={(e) => {
            if (!isSpinning && wheelRestaurants.length > 0) {
              e.target.style.backgroundColor = '#EFF6FF';
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSpinning && wheelRestaurants.length > 0) {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          {isSpinning ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span className="animate-spin"></span>
              Spinning...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              SPIN
            </span>
          )}
        </button>
      </div>

      {/* Ready Message - Below Button */}
      {!state.winner && (
        <div className="p-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-orange-50 rounded-2xl text-center border-2 border-blue-100">
          <div className="text-5xl mb-3 animate-bounce">🎯</div>
          <p className="text-[#0067A5] font-bold text-xl mb-2">
            Ready to spin!
          </p>
          <p className="text-[#0067A5]/70 text-sm font-medium">
            Tap the Spin button to find your next meal
          </p>
        </div>
      )}
    </div>
  );
}

export default SpinWheel;
