import React, { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';

function LocationSelector({ onLocationSelect, isOpen, onClose }) {
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useManual, setUseManual] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const detectLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLng(longitude);
          // In a real app, you'd reverse geocode these coordinates to get city name
          fetchCityFromCoordinates(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          alert('Failed to detect location: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  const fetchCityFromCoordinates = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      if (data.address) {
        setCity(data.address.city || data.address.county || data.address.state || 'Unknown');
        setPincode(data.postcode || '');
        setSelectedLocation({
          city: data.address.city || data.address.county || data.address.state || 'Unknown',
          pincode: data.postcode || '',
          latitude,
          longitude
        });
      }
    } catch (error) {
      console.error('Failed to fetch city:', error);
    }
  };

  const handleManualSubmit = () => {
    if (city.trim() === '') {
      alert('Please enter a city name');
      return;
    }

    setSelectedLocation({
      city,
      pincode,
      latitude: null,
      longitude: null
    });

    onLocationSelect({
      city,
      pincode,
      latitude: null,
      longitude: null
    });
    onClose();
  };

  const handleAutoLocationSubmit = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Select Delivery Location</h2>
          <p className="text-gray-600 text-sm mt-1">See items available in your area</p>
        </div>

        {!useManual ? (
          <div className="space-y-4">
            {/* Auto Location Detection */}
            <button
              onClick={detectLocation}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              <MapPin size={20} />
              {loading ? 'Detecting location...' : 'Detect my location'}
            </button>

            {selectedLocation && (
              <div className="bg-gray-100 border border-black rounded-lg p-4">
                <p className="text-sm font-semibold text-black">City: <span className="text-gray-700">{selectedLocation.city}</span></p>
                {selectedLocation.pincode && (
                  <p className="text-sm font-semibold text-black">Pincode: <span className="text-gray-700">{selectedLocation.pincode}</span></p>
                )}
                <button
                  onClick={handleAutoLocationSubmit}
                  className="w-full mt-3 bg-black hover:bg-gray-800 text-white py-2 rounded-lg font-semibold transition"
                >
                  Confirm Location
                </button>
              </div>
            )}

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <button
              onClick={() => setUseManual(true)}
              className="w-full border-2 border-black hover:border-gray-800 text-white py-3 rounded-lg font-semibold transition bg-black hover:bg-gray-800"
            >
              Enter Pincode / City
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">City/Town</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">Pincode (Optional)</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter your pincode"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
              />
            </div>

            <button
              onClick={handleManualSubmit}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition"
            >
              Save Location
            </button>

            <button
              onClick={() => {
                setUseManual(false);
                setCity('');
                setPincode('');
              }}
              className="w-full border-2 border-black hover:border-gray-800 text-white py-3 rounded-lg font-semibold transition bg-black hover:bg-gray-800"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationSelector;
