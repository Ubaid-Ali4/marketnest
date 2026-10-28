import React from 'react';
import { ProductSearchResult } from '../types';
import { AvailabilityBadge } from './AvailabilityBadge';
import { formatDistance, formatINR, getDirectionsUrl, getWhatsAppUrl } from '../utils/geo';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, MessageSquare, ExternalLink, Heart, Store } from 'lucide-react';

interface ProductCardProps {
  item: ProductSearchResult;
  onViewDetails: (productId: string) => void;
  onOpenEnquiry?: (shopId: string, productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onViewDetails, onOpenEnquiry }) => {
  const { toggleFavourite, isFavourite } = useApp();
  const { product, shop, inventory, distanceKm, isOutdated } = item;

  const isFav = isFavourite('product', product.id);
  const isMed = product.categoryId === 'cat-med';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Top Banner / Image Area */}
      <div className="relative bg-slate-100 h-48 w-full overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite('product', product.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs transition-colors"
          title={isFav ? 'Remove from favourites' : 'Save to favourites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Distance badge */}
        <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-xs">
          <MapPin className="w-3 h-3 text-blue-400" />
          <span>{formatDistance(distanceKm)} away</span>
        </div>

        {/* Regulated medicine indicator */}
        {isMed && (
          <div className="absolute bottom-2 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
            Verified Pharmacy Item
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-blue-600 uppercase tracking-wider">{product.brand}</span>
            {product.model && <span className="text-slate-400 truncate max-w-[120px]">{product.model}</span>}
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(product.id)}
            className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors mb-2"
          >
            {product.name}
          </h3>

          {/* Price & Stock Badge */}
          <div className="flex flex-wrap items-baseline gap-2 mb-3">
            <span className="text-xl font-extrabold text-slate-900">
              {formatINR(inventory.price)}
            </span>
            <span className="text-xs text-slate-400 font-normal">at nearby shop</span>
          </div>

          <div className="mb-3">
            <AvailabilityBadge
              status={inventory.availabilityStatus}
              lastUpdatedAt={inventory.lastUpdatedAt}
              isOutdated={isOutdated}
            />
          </div>

          {/* Shop information */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Store className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{shop.name}</span>
            </div>
            <div className="text-[11px] text-slate-500 truncate mt-0.5 pl-5">
              {shop.address}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => onViewDetails(product.id)}
            className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>View Details & Compare Shops</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="grid grid-cols-3 gap-1.5">
            {/* Call */}
            <a
              href={`tel:${shop.phone}`}
              className="py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
              title={`Call ${shop.name}`}
            >
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>Call</span>
            </a>

            {/* WhatsApp */}
            <a
              href={getWhatsAppUrl(shop.whatsapp, product.name, shop.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3 h-3 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Directions */}
            <a
              href={getDirectionsUrl(shop.latitude, shop.longitude, shop.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
              title="Open Google Maps Directions"
            >
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>Map</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
