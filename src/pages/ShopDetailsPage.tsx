import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AvailabilityBadge } from '../components/AvailabilityBadge';
import {
  calculateDistanceKm,
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
  Clock,
  ShieldCheck,
  Star,
  Search,
  ArrowLeft,
  Heart,
  AlertCircle,
  ExternalLink,
  Store,
  CheckCircle2,
} from 'lucide-react';

interface ShopDetailsPageProps {
  shopId: string;
  onNavigate: (view: string, param?: string) => void;
  onViewProduct: (productId: string) => void;
  onOpenReport: (shopId: string) => void;
}

export const ShopDetailsPage: React.FC<ShopDetailsPageProps> = ({
  shopId,
  onNavigate,
  onViewProduct,
  onOpenReport,
}) => {
  const {
    getShop,
    getShopProducts,
    selectedLocation,
    reviews,
    submitReview,
    currentUser,
    toggleFavourite,
    isFavourite,
  } = useApp();

  const shop = getShop(shopId);
  const items = getShopProducts(shopId);

  const [inShopSearch, setInShopSearch] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!shop) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Shop Not Found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isFav = isFavourite('shop', shop.id);
  const isPharmacy = shop.categoryId === 'cat-med';

  const distanceKm = calculateDistanceKm(
    { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude },
    { latitude: shop.latitude, longitude: shop.longitude }
  );

  const shopReviews = reviews.filter((r) => r.shopId === shop.id);

  // Filter catalogue
  const filteredItems = items.filter(
    (item) =>
      item.product.name.toLowerCase().includes(inShopSearch.toLowerCase()) ||
      item.product.brand.toLowerCase().includes(inShopSearch.toLowerCase())
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    submitReview(shop.id, reviewRating, reviewComment.trim());
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('explore-shops')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Nearby Shops</span>
        </button>

        <button
          onClick={() => toggleFavourite('shop', shop.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
            isFav
              ? 'border-rose-200 bg-rose-50 text-rose-600'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{isFav ? 'Saved in Favourites' : 'Save Shop'}</span>
        </button>
      </div>

      {/* Shop Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="h-44 sm:h-60 w-full relative bg-slate-900">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

          <div className="absolute bottom-4 left-4 sm:left-8 right-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 text-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  {shop.category}
                </span>
                {shop.verificationStatus === 'approved' && (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Local Store
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold">{shop.name}</h1>
            </div>

            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{shop.rating} Rating</span>
              <span className="opacity-70">({shop.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Shop Info & Action Bar */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100 text-xs">
            {/* Address */}
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block">Store Address</span>
              <div className="flex items-start gap-1.5 text-slate-800 font-medium">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{shop.address}, {shop.city} - {shop.postalCode}</span>
              </div>
              <p className="text-blue-600 font-bold pl-5">
                {formatDistance(distanceKm)} from your current shopping area
              </p>
            </div>

            {/* Operating Hours */}
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block">Operating Hours</span>
              <div className="flex items-start gap-1.5 text-slate-800 font-medium">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{shop.openingHours}</span>
              </div>
              <span className={`inline-block font-bold pl-5 ${shop.isOpen ? 'text-emerald-600' : 'text-rose-600'}`}>
                {shop.isOpen ? '● Open right now' : '● Currently Closed'}
              </span>
            </div>

            {/* Contact Actions */}
            <div className="space-y-2">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block">Direct Contact</span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${shop.phone}`}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Store</span>
                </a>
                <a
                  href={getWhatsAppUrl(shop.whatsapp, undefined, shop.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={getDirectionsUrl(shop.latitude, shop.longitude, shop.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          </div>

          {/* Travel disclaimer warning */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Important visit disclaimer:</strong> Physical inventory and counter stock can change rapidly throughout the business day. We strongly encourage customers to tap <strong>Call</strong> or <strong>WhatsApp</strong> before travelling.
            </p>
          </div>
        </div>
      </div>

      {/* In-Shop Catalogue */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Products Available at this Store ({items.length})
            </h2>
            <p className="text-xs text-slate-500">Live listed catalogue with recent inventory updates</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search inside this store..."
              value={inShopSearch}
              onChange={(e) => setInShopSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(({ product, inventory }) => {
              const outdated = isStockOutdated(inventory.lastUpdatedAt);
              return (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-contain bg-slate-50 p-1.5 rounded-xl border border-slate-100 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                        {product.brand}
                      </span>
                      <h4
                        onClick={() => onViewProduct(product.id)}
                        className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-blue-600 cursor-pointer"
                      >
                        {product.name}
                      </h4>
                      <div className="text-base font-extrabold text-slate-900 mt-1">
                        {formatINR(inventory.price)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <AvailabilityBadge
                      status={inventory.availabilityStatus}
                      lastUpdatedAt={inventory.lastUpdatedAt}
                      isOutdated={outdated}
                      compact
                    />
                    <button
                      onClick={() => onViewProduct(product.id)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            No products in this shop match &quot;{inShopSearch}&quot;.
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Verified Customer Reviews</h3>
            <p className="text-xs text-slate-500">Feedback from shoppers who visited this store</p>
          </div>
          <button
            onClick={() => onOpenReport(shop.id)}
            className="text-xs text-slate-400 hover:text-amber-600 font-medium"
          >
            Report Store Issue
          </button>
        </div>

        {/* Existing reviews */}
        <div className="space-y-3">
          {shopReviews.length > 0 ? (
            shopReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{rev.userName}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-slate-700">{rev.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                {rev.verifiedVisit && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Store Visit
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No reviews submitted yet for this store.</p>
          )}
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Leave a Review</h4>
          {reviewSuccess && (
            <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              Thank you! Your verified review has been published.
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setReviewRating(star)}
                className="p-1 text-amber-400 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-4 h-4 ${reviewRating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                />
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            placeholder="Share your store experience, stock accuracy, or service..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
            >
              Post Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
