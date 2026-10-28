import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CITIES } from '../data/mockData';
import { CityLocation } from '../types';
import { MapPin, Navigation, Search, Check, X, Compass } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const {
    selectedLocation,
    setSelectedLocation,
    setUserCustomLocation,
    searchRadiusKm,
    setSearchRadiusKm,
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCities = CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.area.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.postalCode.includes(searchFilter) ||
      c.city.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const { latitude, longitude } = position.coords;
        setUserCustomLocation(latitude, longitude, 'Your GPS Location');
        onClose();
      },
      (error) => {
        setGeoLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location permission was denied. Please pick a locality from the list below.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Location information is unavailable. Please select your city manually.');
            break;
          case error.TIMEOUT:
            setGeoError('Location request timed out. Please select from the list below.');
            break;
          default:
            setGeoError('Unable to detect location. Please choose a city below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelect = (city: CityLocation) => {
    setSelectedLocation(city);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Choose Your Shopping Area
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              MarketNest finds inventory at stores within your selected radius
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* GPS Button */}
          <div>
            <button
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-semibold text-sm transition-all shadow-xs disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 ${geoLoading ? 'animate-spin' : ''}`} />
              {geoLoading ? 'Detecting your coordinates...' : 'Use My Current Location (GPS)'}
            </button>
            {geoError && (
              <p className="mt-2 text-xs text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                {geoError}
              </p>
            )}
          </div>

          {/* Search Radius Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              Search Radius
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 3, 5, 10, 20].map((radius) => (
                <button
                  key={radius}
                  onClick={() => setSearchRadiusKm(radius)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                    searchRadiusKm === radius
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {radius} km
                </button>
              ))}
            </div>
          </div>

          {/* Search localities */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Popular Cities & Neighborhoods (India)
            </label>
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by area, city, or PIN code..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {filteredCities.map((city) => {
                const isSelected = selectedLocation.id === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => handleSelect(city)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-200 text-blue-900 font-semibold'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">{city.name}</div>
                      <div className="text-xs text-slate-500">
                        {city.area} • PIN: {city.postalCode}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}

              {filteredCities.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No preset found for &quot;{searchFilter}&quot;. Try selecting Bengaluru, Mumbai, Delhi, or use GPS.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Active: <strong className="text-slate-800">{selectedLocation.name}</strong> ({searchRadiusKm} km)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Apply Location
          </button>
        </div>
      </div>
    </div>
  );
};
