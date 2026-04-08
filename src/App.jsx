import { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import { useLocation } from './features/location';
import { useRestaurants } from './features/restaurants';
import { useFilters } from './features/filters';
import { useShareLink } from './features/group';
import { FilterPanel } from './features/filters';
import { SpinWheel } from './features/wheel';
import { WinnerCard } from './features/result';
import Modal from './shared/components/Modal';
import './App.css';

function AppContent() {
  const { state } = useAppContext();
  const [showLocationModal, setShowLocationModal] = useState(true);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const { locationError, isLocating, retry } = useLocation(hasRequestedLocation);
  const { restaurants, isLoading: isLoadingRestaurants, error: restaurantsError } = useRestaurants();
  useFilters();
  useShareLink();

  // Check if location permission was already granted on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          setShowLocationModal(false);
          setHasRequestedLocation(true);
        }
      }).catch(() => {
        // If permissions API not supported, show modal
      });
    }
  }, []);

  const handleAllowLocation = () => {
    setShowLocationModal(false);
    setHasRequestedLocation(true);
  };

  const handleDenyLocation = () => {
    setShowLocationModal(false);
    setHasRequestedLocation(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Location Permission Modal */}
      <Modal
        isOpen={showLocationModal}
        onClose={handleDenyLocation}
        title="Location Permission"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📍</div>
          <h3 className="text-xl font-semibold text-[#1F2937] mb-3">
            Allow Location Access
          </h3>
          <p className="text-[#6B7280] mb-6">
            Spin2Eat needs your location to find nearby restaurants. 
            We'll only use your location while you're using the app.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleDenyLocation}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              Not Now
            </button>
            <button
              onClick={handleAllowLocation}
              className="px-6 py-3 bg-gradient-to-r from-[#0067A5] to-[#0088CC] text-white rounded-full font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Allow Location
            </button>
          </div>
        </div>
      </Modal>

      {/* Header with Icon and Title */}
      <header className="bg-gradient-to-r from-[#0067A5] to-[#0088CC] text-white py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Spin2Eat
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Error States */}
        {locationError && !isLocating && (
          <div className="p-6 bg-white rounded-3xl shadow-lg mb-6 text-center border-2 border-red-200">
            <div className="text-5xl mb-3">⚠️</div>
            <p className="text-red-600 font-semibold mb-4 text-lg">{locationError}</p>
            <button
              onClick={retry}
              className="px-8 py-3 bg-gradient-to-r from-[#0067A5] to-[#0088CC] text-white rounded-full font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        )}

        {restaurantsError && !isLoadingRestaurants && (
          <div className="p-6 bg-white rounded-3xl shadow-lg mb-6 text-center border-2 border-red-200">
            <div className="text-5xl mb-3">😕</div>
            <p className="text-red-600 font-semibold mb-2 text-lg">Error loading restaurants</p>
            <p className="text-sm text-gray-600">{restaurantsError}</p>
          </div>
        )}

        {/* Main Content */}
        {!locationError && (
          <div className="space-y-6">
            {/* Location Display */}
            <FilterPanel />
            
            {/* Spinning Wheel */}
            <SpinWheel />
            
            {/* Winner Card */}
            {state.winner && <WinnerCard />}
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
