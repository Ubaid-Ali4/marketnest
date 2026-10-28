import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { ShopCard } from '../components/ShopCard';
import { ShopMap } from '../components/ShopMap';
import { calculateDistanceKm } from '../utils/geo';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Compass,
  LayoutGrid,
  Map as MapIcon,
} from 'lucide-react';

interface NearbyShopsPageProps {
  onNavigate: (view: string, param?: string) => void;
  onViewShop: (shopId: string) => void;
  onOpenLocationModal: () => void;
}

export const NearbyShopsPage: React.FC<NearbyShopsPageProps> = ({
  onNavigate,
  onViewShop,
  onOpenLocationModal,
}) => {
  const { selectedLocation, searchRadiusKm, setSearchRadiusKm, shops } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'cards'>('both');

  // Filter approved shops within search radius or matching text
  const filteredShops = useMemo(() => {
    return shops
      .filter((s) => s.verificationStatus === 'approved')
      .map((shop) => {
        const distance = calculateDistanceKm(
          { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude },
          { latitude: shop.latitude, longitude: shop.longitude }
        );
        return { shop, distance };
      })
      .filter(({ shop, distance }) => {
        if (distance > searchRadiusKm) return false;
        if (selectedCat && shop.categoryId !== selectedCat) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            shop.name.toLowerCase().includes(q) ||
            shop.category.toLowerCase().includes(q) ||
            shop.address.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [shops, selectedLocation, searchRadiusKm, selectedCat, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Hyperlocal Discovery
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Nearby Shops
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified local retail stores within {searchRadiusKm} km of {selectedLocation.name}
          </p>
        </div>

        {/* Change Area Button */}
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-800 text-xs font-bold transition-colors self-start md:self-center shadow-2xs"
        >
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>Change Shopping Area ({selectedLocation.name.split(',')[0]})</span>
        </button>
      </div>

      {/* Filter and View Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search shops by name, category, or road..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category dropdown */}
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Shop Types</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Radius selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <Compass className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          {[1, 3, 5, 10, 20].map((radius) => (
            <button
              key={radius}
              onClick={() => setSearchRadiusKm(radius)}
              className={`px-2 py-1 rounded-lg font-semibold text-[11px] ${
                searchRadiusKm === radius
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {radius}k
            </button>
          ))}
        </div>

        {/* View toggles */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('both')}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] ${
              viewMode === 'both' ? 'bg-white shadow-2xs text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] ${
              viewMode === 'map' ? 'bg-white shadow-2xs text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            Map Only
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] ${
              viewMode === 'cards' ? 'bg-white shadow-2xs text-blue-600 font-bold' : 'text-slate-500'
            }`}
          >
            List Only
          </button>
        </div>
      </div>

      {/* Main Layout */}
      {viewMode === 'map' ? (
        <div className="space-y-2">
          <ShopMap
            userLocation={selectedLocation}
            shops={filteredShops.map((f) => f.shop)}
            radiusKm={searchRadiusKm}
            onSelectShop={onViewShop}
            height="550px"
          />
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShops.map(({ shop }) => (
            <ShopCard key={shop.id} shop={shop} onViewShop={onViewShop} />
          ))}
        </div>
      ) : (
        /* Split view: Map on top / left, cards below / right */
        <div className="space-y-6">
          <ShopMap
            userLocation={selectedLocation}
            shops={filteredShops.map((f) => f.shop)}
            radiusKm={searchRadiusKm}
            onSelectShop={onViewShop}
            height="380px"
          />

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Found {filteredShops.length} Stores near {selectedLocation.name}
            </h3>
            {filteredShops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredShops.map(({ shop }) => (
                  <ShopCard key={shop.id} shop={shop} onViewShop={onViewShop} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No shops match your criteria within {searchRadiusKm} km. Try increasing the search distance above.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
