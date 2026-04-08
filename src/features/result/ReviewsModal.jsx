import { useState, useEffect } from 'react';
import Modal from '../../shared/components/Modal';
import { formatRating } from '../../shared/utils/formatters';
import PlacesRepository from '../restaurants/placesService';

export default function ReviewsModal({ isOpen, onClose, restaurant }) {
  const [reviews, setReviews] = useState(restaurant?.reviews || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && restaurant) {
      // If reviews are already in the restaurant object, use them
      if (restaurant.reviews && restaurant.reviews.length > 0) {
        setReviews(restaurant.reviews);
        setIsLoading(false);
      } else if (restaurant.reviews && restaurant.reviews.length === 0) {
        // Empty reviews array - don't fetch, just show empty state
        setReviews([]);
        setIsLoading(false);
      } else {
        // No reviews property - fetch them
        fetchReviews();
      }
    }
  }, [isOpen, restaurant]);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch detailed restaurant data which includes reviews
      const details = await PlacesRepository.getRestaurantDetails(restaurant.id);
      setReviews(details.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Unable to load reviews at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!restaurant) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Reviews">
      <div className="space-y-4">
        {/* Overall Rating */}
        <div className="text-center pb-4 border-b border-[#E5E7EB]">
          <div className="text-4xl font-bold text-[#0067A5]">
            {formatRating(restaurant.rating)}
          </div>
          <p className="text-[#6B7280] mt-1">
            Based on {restaurant.totalRatings} reviews
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0067A5]"></div>
            <p className="text-[#6B7280] mt-2">Loading reviews...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchReviews}
              className="mt-4 px-6 py-3 bg-[#0067A5] text-white rounded-full hover:bg-[#004F80] transition-all duration-200 min-h-[44px]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Reviews List */}
        {!isLoading && !error && reviews.length > 0 && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {reviews.map((review, index) => (
              <div key={index} className="border-b border-[#E5E7EB] pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-[#1F2937]">
                      {review.author_name || review.author || 'Anonymous'}
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      {review.relative_time_description || review.time || 'Recently'}
                    </p>
                  </div>
                  <span className="text-[#0067A5] font-semibold">
                    {formatRating(review.rating)}
                  </span>
                </div>
                {review.text && (
                  <p className="text-[#1F2937] text-sm leading-relaxed">
                    {review.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No Reviews */}
        {!isLoading && !error && reviews.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-[#6B7280]">No reviews available yet.</p>
            <p className="text-sm text-[#9CA3AF] mt-2">
              Be the first to visit and share your experience!
            </p>
          </div>
        )}

        {/* Link to Google Reviews */}
        <div className="text-center pt-4 border-t border-[#E5E7EB]">
          <a
            href={restaurant.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#0067A5] text-white rounded-full hover:bg-[#004F80] transition-all duration-200 text-sm font-semibold min-h-[44px]"
          >
            View All Reviews on Google Maps
          </a>
        </div>
      </div>
    </Modal>
  );
}
