import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AvailabilityBadge } from '../components/AvailabilityBadge';
import {
  formatDistance,
  formatINR,
  getDirectionsUrl,
  getWhatsAppUrl,
  isStockOutdated,
} from '../utils/geo';
import {
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Heart,
  Store,
  Clock,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface ProductDetailsPageProps {
  productId: string;
  onNavigate: (view: string, param?: string) => void;
  onViewShop: (shopId: string) => void;
  onOpenEnquiry: (shopId: string, productId: string) => void;
  onOpenReport: (shopId: string, productId: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  productId,
  onNavigate,
  onViewShop,
  onOpenEnquiry,
  onOpenReport,
}) => {
  const { getProduct, getProductListings, toggleFavourite, isFavourite } = useApp();

  const product = getProduct(productId);
  const listings = getProductListings(productId);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for does not exist or has been unlisted.</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isFav = isFavourite('product', product.id);
  const isMed = product.categoryId === 'cat-med';

  // Find lowest price
  const lowestPrice = listings.length > 0 ? Math.min(...listings.map((l) => l.inventory.price)) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('search', '')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Results</span>
        </button>

        <button
          onClick={() => toggleFavourite('product', product.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
            isFav
              ? 'border-rose-200 bg-rose-50 text-rose-600'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{isFav ? 'Saved in Favourites' : 'Save to Favourites'}</span>
        </button>
      </div>

      {/* Regulated medicine warning banner */}
      {isMed && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h4 className="font-bold text-amber-950 text-sm">
              Healthcare & Pharmacy Compliance Advisory
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              {product.regulatedWarning ||
                'This product is listed by verified local licensed pharmacies. MarketNest does not prescribe medicines or endorse automatic chemical substitution. For life-threatening emergencies, call 112 or 108.'}
            </p>
          </div>
        </div>
      )}

      {/* Product Overview Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-3">
            <div className="h-72 sm:h-96 w-full bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center justify-center overflow-hidden">
              <img
                src={product.images[selectedImgIndex] || product.images[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-slate-50 overflow-hidden ${
                      selectedImgIndex === idx ? 'border-blue-600' : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <span>{product.brand}</span>
                {product.model && <span>• Model: {product.model}</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price highlight */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Starting nearby at</span>
                <span className="text-3xl font-extrabold text-slate-900">
                  {lowestPrice ? formatINR(lowestPrice) : 'Check with shop'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  {listings.length} local shop{listings.length !== 1 ? 's' : ''} have this
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Specifications</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 p-2.5 bg-white hover:bg-slate-50">
                      <span className="font-semibold text-slate-500 col-span-1">{key}</span>
                      <span className="text-slate-800 col-span-2">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hyperlocal Price Comparison Table across Local Shops */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Where to Buy Near You (Price Comparison)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Compare prices, confirmed stock status, and distance across {listings.length} neighborhood shops
            </p>
          </div>
        </div>

        {listings.length > 0 ? (
          <div className="space-y-3">
            {listings.map(({ shop, inventory, distanceKm }) => {
              const outdated = isStockOutdated(inventory.lastUpdatedAt);
              return (
                <div
                  key={shop.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  {/* Shop Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        onClick={() => onViewShop(shop.id)}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                      >
                        {shop.name}
                      </h3>
                      {shop.verificationStatus === 'approved' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {formatDistance(distanceKm)} away
                      </span>
                      <span>•</span>
                      <span className="text-slate-600">{shop.address}</span>
                      <span>•</span>
                      <span>{shop.openingHours}</span>
                    </div>

                    {inventory.notes && (
                      <p className="text-xs text-amber-700 bg-amber-50/70 py-1 px-2 rounded-lg border border-amber-100 max-w-xl">
                        Shop note: {inventory.notes}
                      </p>
                    )}
                  </div>

                  {/* Price & Stock Badge */}
                  <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0">
                    <div className="text-2xl font-extrabold text-slate-900">
                      {formatINR(inventory.price)}
                    </div>
                    <AvailabilityBadge
                      status={inventory.availabilityStatus}
                      lastUpdatedAt={inventory.lastUpdatedAt}
                      isOutdated={outdated}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                      onClick={() => onOpenEnquiry(shop.id, product.id)}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Enquire</span>
                    </button>

                    <a
                      href={getWhatsAppUrl(shop.whatsapp, product.name, shop.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${shop.phone}`}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition-colors"
                      title={`Call ${shop.name}`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <a
                      href={getDirectionsUrl(shop.latitude, shop.longitude, shop.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl text-xs transition-colors"
                      title="Directions on Google Maps"
                    >
                      <MapPin className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => onOpenReport(shop.id, product.id)}
                      className="p-2 text-slate-400 hover:text-amber-600 rounded-xl transition-colors"
                      title="Report incorrect price or availability"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <Store className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No nearby shops are currently listing this product.</p>
            <p className="text-xs text-slate-500">Try expanding your search distance in the top location selector.</p>
          </div>
        )}
      </div>
    </div>
  );
};
