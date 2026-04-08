import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Modal from '../../shared/components/Modal';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function RestaurantMap({ isOpen, onClose, restaurant }) {
  if (!restaurant || !restaurant.location) return null;

  const position = [restaurant.location.lat, restaurant.location.lng];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restaurant Location">
      <div className="h-96 w-full rounded-2xl overflow-hidden" data-testid="restaurant-map">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <strong className="text-lg text-[#1F2937]">{restaurant.name}</strong>
                <p className="text-sm text-[#6B7280] mt-1">{restaurant.address}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <div className="mt-4 text-center text-sm text-[#6B7280]">
        <p>📍 {restaurant.address}</p>
      </div>
    </Modal>
  );
}
