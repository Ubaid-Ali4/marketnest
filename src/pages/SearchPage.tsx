import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/ProductCard';
import { ShopMap } from '../components/ShopMap';
import { SearchFilters } from '../context/AppContext';
import {
  Search,
  Filter,
  MapPin,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Map as MapIcon,
  AlertTriangle,
  X,
  Compass,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';

interface SearchPageProps {
  onNavigate: (view: string, param?: string) => void;
  onViewProduct: (productId: string) => void;
  onViewShop: (shopId: string) => void;
  initialQuery?: string;
  initialCategory?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onNavigate,
  onViewProduct,
  onViewShop,
  initialQuery = '',
  initialCategory,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    recordSearchHistory,
    selectedLocation,
    searchRadiusKm,
    setSearchRadiusKm,
    performSearch,
    shops,
  } = useApp();

  const [queryInput, setQueryInput] = useState(initialQuery || searchQuery);
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory || '');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SearchFilters['sortBy']>('nearest');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category and query when navigated from outside
  useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCat(initialCategory);
    }
    if (initialQuery !== undefined) {
      setQueryInput(initialQuery);
    }
  }, [initialCategory, initialQuery]);

  // Execute search with all active filters
  const results = useMemo(() => {
    return performSearch(queryInput, {
      categoryId: selectedCat || undefined,
      maxDistanceKm: searchRadiusKm,
      minPrice,
      maxPrice,
      brand: selectedBrand || undefined,
      availability: availabilityOnly ? 'in_stock' : 'all',
      sortBy,
    });
  }, [
    performSearch,
    queryInput,
    selectedCat,
    searchRadiusKm,
    minPrice,
    maxPrice,
    selectedBrand,
    availabilityOnly,
    sortBy,
  ]);

  // Unique brands in matching results for brand filter dropdown
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    results.forEach((r) => brandSet.add(r.product.brand));
    return Array.from(brandSet);
  }, [results]);

  // Extract unique shops in results for the map view
  const mapShops = useMemo(() => {
    const shopMap = new Map<string, (typeof shops)[0]>();
    results.forEach((r) => {
      shopMap.set(r.shop.id, r.shop);
    });
    return Array.from(shopMap.values());
  }, [results, shops]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(queryInput);
    if (queryInput.trim()) {
      recordSearchHistory(queryInput);
    }
  };

  const handleResetFilters = () => {
    setSelectedCat('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedBrand('');
    setAvailabilityOnly(false);
    setSortBy('nearest');
    setSearchRadiusKm(10);
  };

  const isMedicineQuery =
    queryInput.toLowerCase().includes('para') ||
    queryInput.toLowerCase().includes('med') ||
    queryInput.toLowerCase().includes('dolo') ||
    queryInput.toLowerCase().includes('crocin') ||
    selectedCat === 'cat-med';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search product, brand, model, or keywords..."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* View mode switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg flex items-center gap-1 ${
                viewMode === 'grid' ? 'bg-white shadow-2xs font-bold text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white shadow-2xs font-bold text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-white shadow-2xs font-bold text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Map View"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SearchFilters['sortBy'])}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer"
            >
              <option value="nearest">Nearest First</option>
              <option value="price_asc">Lowest Price</option>
              <option value="price_desc">Highest Price</option>
              <option value="recently_updated">Recently Updated Stock</option>
              <option value="rating">Top Rated Shops</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Category Pills Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setSelectedCat('')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all text-xs ${
              !selectedCat
                ? 'bg-blue-600 text-white shadow-2xs font-bold'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 text-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Regulated Healthcare Product Notice Banner if user searches for medicines */}
      {isMedicineQuery && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-950 text-sm">
              Pharmacy & Healthcare Product Discovery Notice
            </h4>
            <p className="leading-relaxed text-amber-800">
              Listed medicines are from licensed neighborhood pharmacies for genuine OTC needs. MarketNest does not provide medical prescriptions, substitute medications, or process online pharmacy sales. For medical emergencies, immediately contact emergency services at <strong>112</strong> or <strong>108</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <div
          className={`md:block space-y-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs ${
            mobileFilterOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              Filter Results
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Distance Radius */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              Distance Radius
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-xs font-semibold">
              {[1, 3, 5, 10, 20].map((radius) => (
                <button
                  key={radius}
                  onClick={() => setSearchRadiusKm(radius)}
                  className={`py-1.5 px-1 text-center rounded-lg border transition-all text-[11px] ${
                    searchRadiusKm === radius
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {radius}k
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Currently searching within {searchRadiusKm} km of {selectedLocation.name.split(',')[0]}
            </p>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Price Range (INR ₹)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice !== undefined ? minPrice : ''}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice !== undefined ? maxPrice : ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Brands</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Availability only checkbox */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
              />
              <span>In Stock Only (Confirmed)</span>
            </label>
          </div>
        </div>

        {/* Results Area */}
        <div className="md:col-span-3 space-y-5">
          {/* Result summary */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing <strong className="text-slate-900">{results.length}</strong> available listing
              {results.length !== 1 ? 's' : ''} near <strong className="text-slate-900">{selectedLocation.name}</strong>
              {queryInput && <span> for &quot;<strong className="text-blue-600">{queryInput}</strong>&quot;</span>}
            </div>
          </div>

          {/* Map View Mode */}
          {viewMode === 'map' && (
            <div className="space-y-4">
              <ShopMap
                userLocation={selectedLocation}
                shops={mapShops}
                radiusKm={searchRadiusKm}
                onSelectShop={onViewShop}
                height="450px"
              />
              <p className="text-xs text-slate-500 text-center">
                Click any shop pin to view shop name, exact distance, and directions.
              </p>
            </div>
          )}

          {/* Results Grid / List */}
          {results.length > 0 ? (
            viewMode === 'list' ? (
              <div className="space-y-3">
                {results.map((item) => (
                  <div
                    key={`${item.product.id}-${item.shop.id}`}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-contain bg-slate-50 p-2 rounded-xl border border-slate-100 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                          {item.product.brand}
                        </span>
                        <h4
                          onClick={() => onViewProduct(item.product.id)}
                          className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer"
                        >
                          {item.product.name}
                        </h4>
                        <div className="text-xs text-slate-500 mt-0.5">
                          At <strong>{item.shop.name}</strong> • {item.distanceKm} km away
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between w-full sm:w-auto gap-2">
                      <div className="text-lg font-extrabold text-slate-900">
                        ₹{item.inventory.price.toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => onViewProduct(item.product.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                      >
                        Compare Shops
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((item) => (
                  <ProductCard
                    key={`${item.product.id}-${item.shop.id}`}
                    item={item}
                    onViewDetails={onViewProduct}
                  />
                ))}
              </div>
            )
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We couldn&apos;t find any confirmed store inventory matching &quot;{queryInput}&quot; within {searchRadiusKm} km of {selectedLocation.name}.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSearchRadiusKm(20)}
                  className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold"
                >
                  Expand Search Radius to 20 km
                </button>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={() => onNavigate('explore-shops')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
                >
                  Browse Nearby Shops
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
