import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  Layers,
  Map as MapIcon,
  Heart,
  X,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Navigation,
} from 'lucide-react';

interface MobileQuickBarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenLocationModal: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  currentView,
  onNavigate,
  onOpenLocationModal,
}) => {
  const {
    selectedLocation,
    searchRadiusKm,
    searchQuery,
    setSearchQuery,
    recordSearchHistory,
    favourites,
    setUserCustomLocation,
  } = useApp();

  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);
  const [quickInput, setQuickInput] = useState(searchQuery || '');
  const [geoLocating, setGeoLocating] = useState(false);

  const favCount = favourites.length;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      setSearchQuery(quickInput.trim());
      recordSearchHistory(quickInput.trim());
      setIsSearchSheetOpen(false);
      onNavigate('search', quickInput.trim());
    } else {
      setIsSearchSheetOpen(false);
      onNavigate('search', '');
    }
  };

  const handleQuickPill = (term: string) => {
    setQuickInput(term);
    setSearchQuery(term);
    recordSearchHistory(term);
    setIsSearchSheetOpen(false);
    onNavigate('search', term);
  };

  const handleQuickGps = () => {
    if (!navigator.geolocation) return;
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        setUserCustomLocation(pos.coords.latitude, pos.coords.longitude, 'Your GPS Location');
      },
      () => {
        setGeoLocating(false);
        onOpenLocationModal();
      },
      { timeout: 8000 }
    );
  };

  return (
    <>
      {/* 1. Quick Search Modal Drawer (Expands on Mobile Search Tap) */}
      {isSearchSheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-in fade-in flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl border-t border-slate-200 p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Instant Product Search</h3>
                  <p className="text-[11px] text-slate-500">
                    Within {searchRadiusKm} km of {selectedLocation.name.split(',')[0]}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSearchSheetOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleQuickSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                autoFocus
                placeholder="Search mobile charger, paracetamol, etc..."
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                className="w-full pl-10 pr-20 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
              >
                Search
              </button>
            </form>

            {/* Location & GPS shortcut */}
            <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsSearchSheetOpen(false);
                  onOpenLocationModal();
                }}
                className="flex items-center gap-1.5 text-slate-700 font-semibold hover:text-blue-600 truncate max-w-[190px]"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{selectedLocation.name.split(',')[0]}</span>
                <span className="text-[10px] text-slate-400">({searchRadiusKm}km)</span>
              </button>

              <button
                type="button"
                onClick={handleQuickGps}
                disabled={geoLocating}
                className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 text-[11px]"
              >
                <Navigation className={`w-3 h-3 ${geoLocating ? 'animate-spin' : ''}`} />
                <span>{geoLocating ? 'Locating...' : 'Use GPS'}</span>
              </button>
            </div>

            {/* Popular 1-Tap Search Terms */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                Popular Quick Searches:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Mobile charger',
                  'Paracetamol',
                  'Laptop charger',
                  'Prestige mixer',
                  'Bike engine oil',
                  'Philips LED',
                  'Yoga mat',
                  'Dog food',
                ].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleQuickPill(term)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium text-xs transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Mobile Footer Navigation & Quick Action Dock */}
      <nav aria-label="Mobile navigation bar" className="md:hidden fixed bottom-2 inset-x-3 z-40">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/10 rounded-2xl px-2 py-1.5 flex items-center justify-around gap-1">
          {/* Quick Search Action */}
          <button
            onClick={() => setIsSearchSheetOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isSearchSheetOpen || currentView === 'search'
                ? 'text-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Search className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Search</span>
          </button>

          {/* Location Action */}
          <button
            onClick={onOpenLocationModal}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-600 hover:text-blue-600 transition-all max-w-[70px]"
            title="Change shopping locality"
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] mt-0.5 font-medium truncate w-full text-center">
              {selectedLocation.name.split(',')[0]}
            </span>
          </button>

          {/* Center Prominent Map & Explore Action */}
          <button
            onClick={() => onNavigate('explore-shops')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              currentView === 'explore-shops'
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-bold">Nearby</span>
          </button>

          {/* Categories Tab */}
          <button
            onClick={() => onNavigate('categories')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentView === 'categories'
                ? 'text-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-medium">Categories</span>
          </button>

          {/* Saved Favourites */}
          <button
            onClick={() => onNavigate('favourites')}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              currentView === 'favourites'
                ? 'text-rose-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Heart className={`w-4 h-4 ${favCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {favCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Saved</span>
          </button>
        </div>
      </nav>
    </>
  );
};
