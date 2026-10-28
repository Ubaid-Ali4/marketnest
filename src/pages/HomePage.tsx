import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/ProductCard';
import { ShopCard } from '../components/ShopCard';
import {
  Search,
  MapPin,
  Compass,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Clock,
  Sparkles,
  TrendingUp,
  Store,
  Pill,
  Smartphone,
  ShoppingBag,
  Wrench,
  Car,
  BookOpen,
  Tv,
  Zap,
  Shirt,
  Cpu,
  Dumbbell,
  HeartHandshake,
  Package,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenLocationModal: () => void;
  onViewProduct: (productId: string) => void;
  onViewShop: (shopId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenLocationModal,
  onViewProduct,
  onViewShop,
}) => {
  const {
    selectedLocation,
    searchRadiusKm,
    performSearch,
    shops,
    setSearchQuery,
    recordSearchHistory,
    setSelectedCategorySlug,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchQuery(inputQuery.trim());
      recordSearchHistory(inputQuery.trim());
      onNavigate('search', inputQuery.trim());
    } else {
      onNavigate('search', '');
    }
  };

  const handleQuickSearch = (term: string) => {
    setInputQuery(term);
    setSearchQuery(term);
    recordSearchHistory(term);
    onNavigate('search', term);
  };

  const handleCategoryClick = (slug: string, id: string) => {
    setSelectedCategorySlug(slug);
    onNavigate('category', id);
  };

  // Get sample results for "Popular Near You"
  const popularResults = performSearch('', { maxDistanceKm: 15 }).slice(0, 4);

  // Get nearby approved shops
  const nearbyShops = shops.filter((s) => s.verificationStatus === 'approved').slice(0, 4);

  // Icon mapping helper
  const renderCategoryIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Pill': return <Pill {...props} className="w-6 h-6 text-emerald-600" />;
      case 'Smartphone': return <Smartphone {...props} className="w-6 h-6 text-blue-600" />;
      case 'ShoppingBag': return <ShoppingBag {...props} className="w-6 h-6 text-amber-600" />;
      case 'Wrench': return <Wrench {...props} className="w-6 h-6 text-slate-700" />;
      case 'Car': return <Car {...props} className="w-6 h-6 text-red-600" />;
      case 'BookOpen': return <BookOpen {...props} className="w-6 h-6 text-indigo-600" />;
      case 'Tv': return <Tv {...props} className="w-6 h-6 text-violet-600" />;
      case 'Zap': return <Zap {...props} className="w-6 h-6 text-yellow-600" />;
      case 'Shirt': return <Shirt {...props} className="w-6 h-6 text-pink-600" />;
      case 'Sparkles': return <Sparkles {...props} className="w-6 h-6 text-rose-500" />;
      case 'Cpu': return <Cpu {...props} className="w-6 h-6 text-cyan-600" />;
      case 'Dumbbell': return <Dumbbell {...props} className="w-6 h-6 text-teal-600" />;
      case 'HeartHandshake': return <HeartHandshake {...props} className="w-6 h-6 text-orange-600" />;
      case 'Package':
      default:
        return <Package {...props} className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-14 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50/70 via-slate-50/50 to-white pt-10 pb-14 border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold tracking-wide border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Hyperlocal Discovery • Your City. Your Shops. One Search.</span>
          </div>

          {/* Main Headline & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Find Anything. <span className="text-blue-600">Right Near You.</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Discover products, compare prices, and find nearby local shops — all in one place before stepping out.
            </p>
          </div>

          {/* Main Search Bar Card */}
          <div className="max-w-3xl mx-auto bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200 text-left">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
              {/* Product search input */}
              <div className="flex-1 relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="What are you looking for today? (e.g. mobile charger, paracetamol...)"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-transparent rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Location button */}
              <button
                type="button"
                onClick={onOpenLocationModal}
                className="flex items-center gap-2 px-3.5 py-2.5 sm:py-0 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold shrink-0 transition-colors"
                title="Change search location"
              >
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="text-left max-w-[130px] truncate">
                  <div className="truncate text-slate-900 font-bold">{selectedLocation.name.split(',')[0]}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{searchRadiusKm} km radius</div>
                </div>
              </button>

              {/* Search button */}
              <button
                type="submit"
                className="py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular Searches Pills */}
            <div className="pt-3 px-2 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs border-t border-slate-100 mt-2.5">
              <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                Popular:
              </span>
              {[
                'Mobile charger',
                'Paracetamol',
                'Laptop charger',
                'Bike engine oil',
                'Philips LED',
                'Classmate notebook',
              ].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleQuickSearch(term)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-medium text-[11px] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Quick value props */}
          <div className="pt-3 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Local Shopkeepers
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Real-time Stock Freshness
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-indigo-600" />
              Direct Call & WhatsApp
            </span>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Browse by Category</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Find essential supplies across 14 neighborhood retail sectors
            </p>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug, cat.id)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors mb-2.5">
                {renderCategoryIcon(cat.iconName)}
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {cat.name}
              </h4>
              <span className="text-[10px] text-slate-400 mt-1 font-medium">
                {cat.itemCount} items
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Search Showcase (Mobile Charger & Paracetamol) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30 uppercase tracking-wider inline-block">
              Immediate Local Needs
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need something urgently? Don&apos;t wait 3 days for shipping.
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Compare prices across electronics stores, pharmacies, hardware shops, and book stores within 5 km of you. Contact the shopkeeper directly to reserve it.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => handleQuickSearch('mobile charger')}
                className="px-4 py-2 bg-white text-slate-900 hover:bg-blue-50 font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Search &quot;Mobile Charger&quot;
              </button>
              <button
                onClick={() => handleQuickSearch('paracetamol')}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Search &quot;Paracetamol&quot; (Pharmacies)
              </button>
              <button
                onClick={() => onNavigate('explore-shops')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors border border-white/20"
              >
                Open Map View
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Near You */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Popular Near You</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Verified inventory at shops near {selectedLocation.name.split(',')[0]}
            </p>
          </div>
          <button
            onClick={() => onNavigate('search', '')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>See All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularResults.map((item) => (
            <ProductCard
              key={`${item.product.id}-${item.shop.id}`}
              item={item}
              onViewDetails={onViewProduct}
            />
          ))}
        </div>
      </section>

      {/* Nearby Verified Shops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Nearby Verified Shops</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Local retail partners verified for inventory accuracy
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore-shops')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Nearby Shops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {nearbyShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} onViewShop={onViewShop} />
          ))}
        </div>
      </section>

      {/* How MarketNest Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50 rounded-3xl border border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Simple & Transparent</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How MarketNest Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Connecting customers with physical offline shops in three quick steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-lg flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="text-base font-bold text-slate-900">Search Any Product</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Type the product name, brand, or model you need. Filter by distance from your current location or pin code.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-lg flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="text-base font-bold text-slate-900">Compare Prices & Stock</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              See which nearby shops have it in stock, compare prices in INR, and inspect stock freshness confirmation times.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-extrabold text-lg flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="text-base font-bold text-slate-900">Contact & Visit</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Call or message the shopkeeper on WhatsApp with one click to confirm or reserve, then tap &quot;Directions&quot; to visit.
            </p>
          </div>
        </div>
      </section>

      {/* Retailer CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Store className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                For Local Shopkeepers & Merchants
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Do customers in your locality know what you sell?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              List your retail shop on MarketNest for free. Get local customers walking into your store instead of ordering online.
            </p>
          </div>
          <button
            onClick={() => onNavigate('shopkeeper-register')}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>List Your Shop Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
