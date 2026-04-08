import { AppProvider, useAppContext } from './store/AppContext';
import { useLocation } from './features/location';
import { useRestaurants } from './features/restaurants';
import { useFilters } from './features/filters';
import { useShareLink } from './features/group';
import { FilterPanel } from './features/filters';
import { SpinWheel } from './features/wheel';
import { WinnerCard } from './features/result';
import './App.css';

function AppContent() {
  const { state } = useAppContext();
  const { locationError, isLocating, retry } = useLocation();
  const { restaurants, isLoading: isLoadingRestaurants, error: restaurantsError } = useRestaurants();
  useFilters();
  useShareLink();

  return (
    <div className="min-h-screen flex flex-col">
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
