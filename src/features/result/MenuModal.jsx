import Modal from '../../shared/components/Modal';

export default function MenuModal({ isOpen, onClose, restaurant }) {
  if (!restaurant) return null;

  const hasMenu = restaurant.menuUrl;
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    restaurant.name + ' menu'
  )}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restaurant Menu">
      {hasMenu ? (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-[#1F2937] mb-4">
              View the menu for <strong>{restaurant.name}</strong>
            </p>
            <a
              href={restaurant.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[#0067A5] text-white rounded-full hover:bg-[#004F80] transition-all duration-200 font-semibold shadow-md min-h-[44px]"
              aria-label="Open Menu Website"
            >
              🔗 Open Menu Website
            </a>
          </div>

          {/* Optional: Embed iframe if the URL is embeddable */}
          <div className="mt-6 border-t border-[#E5E7EB] pt-4">
            <p className="text-sm text-[#6B7280] mb-3">
              Preview (if available):
            </p>
            <div className="w-full h-96 border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <iframe
                src={restaurant.menuUrl}
                title={`${restaurant.name} Menu`}
                className="w-full h-full"
                sandbox="allow-same-origin allow-scripts"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-[#1F2937] text-lg">
            Menu not available for <strong>{restaurant.name}</strong>
          </p>
          <p className="text-[#6B7280] text-sm">
            We couldn't find a direct menu link, but you can look for it online.
          </p>
          <a
            href={googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#0067A5] text-white rounded-full hover:bg-[#004F80] transition-all duration-200 font-semibold shadow-md mt-4 min-h-[44px]"
            aria-label="Search Menu on Google"
          >
            🔍 Search Menu on Google
          </a>
        </div>
      )}
    </Modal>
  );
}
