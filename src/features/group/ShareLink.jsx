import { useState } from 'react';
import { useShareLink } from './useShareLink';
import Button from '../../shared/components/Button';

/**
 * ShareLink component
 * - Generates shareable URL with encoded wheel state
 * - Copies URL to clipboard
 * - Shows confirmation toast
 * - Displays banner if viewing shared session
 */
export function ShareLink() {
  const { generateShareUrl, isSharedSession } = useShareLink();
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const url = generateShareUrl();
    
    if (!url) {
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
      
      // Hide toast after 2 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="space-y-3">
      {/* Shared session banner */}
      {isSharedSession && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <p className="text-purple-800 font-semibold">
            🎉 You're viewing a shared wheel
          </p>
        </div>
      )}

      {/* Share button */}
      <Button
        onClick={handleShare}
        variant="secondary"
        className="w-full"
      >
        📤 Share Wheel
      </Button>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ✓ Copied to clipboard!
        </div>
      )}
    </div>
  );
}

export default ShareLink;
