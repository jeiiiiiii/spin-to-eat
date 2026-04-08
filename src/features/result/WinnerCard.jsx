import { useWheel } from '../wheel/useWheel';
import { useAppContext } from '../../store/AppContext';
import { formatRating, formatPriceLevel, formatDistance } from '../../shared/utils/formatters';

export default function WinnerCard({ winner: winnerProp, userLocation: userLocationProp }) {
  const { state } = useAppContext();
  
  // Use prop if provided (for testing), otherwise use context
  const winner = winnerProp || state.winner;
  const userLocation = userLocationProp || state.userLocation;

  if (!winner) return null;

  // Calculate distance if user location is available
  const distance = userLocation
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        winner.location.lat,
        winner.location.lng
      )
    : null;

  const openDirections = () => {
    window.open(winner.mapsUrl, '_blank');
  };

  const openWaze = () => {
    const wazeUrl = `https://waze.com/ul?ll=${winner.location.lat},${winner.location.lng}&navigate=yes`;
    window.open(wazeUrl, '_blank');
  };

  return (
    <>
      {/* Winner Card - Vibrant and Playful */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#FF6B35] animate-fade-in transform transition-all duration-500">
        {/* Celebration Banner */}
        <div className="bg-gradient-to-r from-[#FF6B35] via-[#FFB84D] to-[#FF6B35] py-4 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          <div className="relative flex items-center justify-center gap-3">
            <h3 className="text-white font-bold text-2xl tracking-wide">YOUR WINNER!</h3>
          </div>
        </div>

        {/* Hero Image */}
        {winner.photo && (
          <div className="w-full h-64 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
            <img
              src={winner.photo}
              alt={winner.name}
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Restaurant Name */}
          <h2 className="text-3xl font-bold text-[#1F2937] text-center leading-tight">
            {winner.name}
          </h2>

          {/* Distance */}
          {distance && (
            <div className="flex items-center justify-center gap-5 text-base flex-wrap">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border-2 border-blue-200">
                <span className="text-xl">📍</span>
                <span className="text-gray-700 font-semibold">{formatDistance(distance)}</span>
              </div>
            </div>
          )}

          {/* Open/Closed Status */}
          {winner.isOpen !== null && (
            <div className="flex justify-center">
              <span
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-bold border-2 ${
                  winner.isOpen
                    ? 'bg-green-50 text-green-700 border-green-300'
                    : 'bg-red-50 text-red-700 border-red-300'
                }`}
              >
                <span className="text-xl">{winner.isOpen ? '✓' : '✗'}</span>
                <span>{winner.isOpen ? 'Open Now' : 'Closed'}</span>
              </span>
            </div>
          )}

          {/* Address */}
          {winner.address && (
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
              <p className="text-gray-700 text-sm text-center font-medium flex items-center justify-center gap-2">
                <span className="text-lg">📍</span>
                <span>{winner.address}</span>
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="border-t-2 border-gray-200 my-5"></div>

          {/* Action Buttons - Side by side with spacing */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Directions Button */}
            <button
              onClick={openDirections}
              style={{
                padding: '8px 20px',
                backgroundColor: '#DBEAFE',
                color: '#0067A5',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#BFDBFE'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#DBEAFE'}
            >
              <span>Directions</span>
            </button>

            {/* Waze Button */}
            <button
              onClick={openWaze}
              style={{
                padding: '8px 20px',
                backgroundColor: '#33CCFF',
                color: 'white',
                borderRadius: '9999px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#00B8E6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#33CCFF'}
            >
              <span>Waze</span>
            </button>
          </div>
        </div>
      </div>

    </>
  );
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
