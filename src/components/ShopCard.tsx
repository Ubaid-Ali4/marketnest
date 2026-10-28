import React from 'react';
import { Shop } from '../types';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm, formatDistance, getDirectionsUrl, getWhatsAppUrl } from '../utils/geo';
import { MapPin, Phone, MessageSquare, Star, Clock, ShieldCheck, Heart, Store } from 'lucide-react';

interface ShopCardProps {
  shop: Shop;
  onViewShop: (shopId: string) => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, onViewShop }) => {
  const { selectedLocation, toggleFavourite, isFavourite } = useApp();
  const isFav = isFavourite('shop', shop.id);

  const distanceKm = calculateDistanceKm(
    { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude },
    { latitude: shop.latitude, longitude: shop.longitude }
  );

  const isPharmacy = shop.categoryId === 'cat-med';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Banner image */}
        <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Verification Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{isPharmacy ? 'Verified Pharmacy' : 'Verified Store'}</span>
          </div>

          {/* Favourite button */}
          <button
            onClick={() => toggleFavourite('shop', shop.id)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs transition-colors"
            title={isFav ? 'Remove from favourites' : 'Save to favourites'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Open / Closed pill */}
          <div className="absolute bottom-2 right-3">
            {shop.isOpen ? (
              <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase">
                Open Now
              </span>
            ) : (
              <span className="bg-rose-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase">
                Closed
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2.5">
          <div>
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
              {shop.category}
            </span>
            <h3
              onClick={() => onViewShop(shop.id)}
              className="text-base font-bold text-slate-900 leading-snug hover:text-blue-600 cursor-pointer transition-colors mt-0.5"
            >
              {shop.name}
            </h3>
          </div>

          {/* Distance and Rating */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {formatDistance(distanceKm)} from you
            </span>

            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="font-bold text-amber-900 text-xs">{shop.rating}</span>
              <span className="text-amber-700/70 text-[10px]">({shop.reviewCount})</span>
            </div>
          </div>

          {/* Address */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {shop.address}, {shop.city} - {shop.postalCode}
          </p>

          {/* Hours */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{shop.openingHours}</span>
          </div>

          {/* Drug license if pharmacy */}
          {shop.licenseNumber && isPharmacy && (
            <div className="text-[10px] text-slate-400 font-mono">
              Drug Lic: {shop.licenseNumber}
            </div>
          )}
        </div>
      </div>

      {/* Actions footer */}
      <div className="p-4 pt-2 border-t border-slate-100 space-y-2">
        <button
          onClick={() => onViewShop(shop.id)}
          className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Explore Shop Catalogue</span>
        </button>

        <div className="grid grid-cols-3 gap-1.5">
          <a
            href={`tel:${shop.phone}`}
            className="py-2 px-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>Call</span>
          </a>

          <a
            href={getWhatsAppUrl(shop.whatsapp, undefined, shop.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-1 bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <MessageSquare className="w-3 h-3 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <a
            href={getDirectionsUrl(shop.latitude, shop.longitude, shop.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <MapPin className="w-3 h-3 text-blue-600" />
            <span>Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
