import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Shop, CityLocation } from '../types';
import { calculateDistanceKm, formatDistance, getDirectionsUrl } from '../utils/geo';

interface ShopMapProps {
  userLocation: CityLocation;
  shops: Shop[];
  radiusKm: number;
  selectedShopId?: string;
  onSelectShop?: (shopId: string) => void;
  height?: string;
}

export const ShopMap: React.FC<ShopMapProps> = ({
  userLocation,
  shops,
  radiusKm,
  selectedShopId,
  onSelectShop,
  height = '420px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet done
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.latitude, userLocation.longitude],
        zoom: radiusKm <= 3 ? 14 : radiusKm <= 10 ? 13 : 11,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    // Clear previous markers
    layerGroup.clearLayers();

    // 1. Add User Location Marker (Pulse icon)
    const userIcon = L.divIcon({
      className: 'custom-user-pin',
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          <div style="position: absolute; width: 24px; height: 24px; background: rgba(37, 99, 235, 0.3); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background: #2563eb; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(layerGroup);

    userMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
        <strong style="color: #1e293b; display: block; margin-bottom: 2px;">Your Location</strong>
        <span style="color: #64748b;">${userLocation.name}</span>
      </div>
    `);

    // 2. Add Search Radius Circle
    L.circle([userLocation.latitude, userLocation.longitude], {
      radius: radiusKm * 1000,
      color: '#3b82f6',
      fillColor: '#60a5fa',
      fillOpacity: 0.08,
      weight: 1.5,
      dashArray: '4, 4',
    }).addTo(layerGroup);

    // 3. Add Shop Markers
    shops.forEach((shop) => {
      const distance = calculateDistanceKm(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: shop.latitude, longitude: shop.longitude }
      );

      const isSelected = selectedShopId === shop.id;
      const isPharmacy = shop.categoryId === 'cat-med';
      const pinColor = isSelected ? '#1d4ed8' : isPharmacy ? '#16a34a' : '#0f172a';

      const shopIcon = L.divIcon({
        className: 'custom-shop-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${pinColor};
            color: white;
            padding: 5px 8px;
            border-radius: 14px;
            font-size: 11px;
            font-weight: 700;
            box-shadow: 0 3px 8px rgba(0,0,0,0.25);
            border: 2px solid white;
            white-space: nowrap;
            cursor: pointer;
            transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            transition: transform 0.2s;
          ">
            <span>${isPharmacy ? '💊 ' : '🏪 '}${formatDistance(distance)}</span>
          </div>
        `,
        iconSize: [60, 28],
        iconAnchor: [30, 14],
      });

      const marker = L.marker([shop.latitude, shop.longitude], { icon: shopIcon }).addTo(layerGroup);

      const directionsUrl = getDirectionsUrl(shop.latitude, shop.longitude, shop.name);

      const popupHtml = `
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4; min-width: 190px;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px;">
              ${shop.category}
            </span>
            ${shop.isOpen ? '<span style="font-size: 10px; font-weight: 700; color: #16a34a;">● OPEN</span>' : '<span style="font-size: 10px; color: #ef4444;">● CLOSED</span>'}
          </div>
          <strong style="color: #0f172a; font-size: 14px; display: block; margin: 4px 0 2px 0;">${shop.name}</strong>
          <div style="color: #64748b; font-size: 12px; margin-bottom: 6px;">${shop.address}</div>
          <div style="color: #0284c7; font-weight: 600; font-size: 12px; margin-bottom: 8px;">
            📍 ${formatDistance(distance)} from your location
          </div>
          <div style="display: flex; gap: 6px; margin-top: 6px;">
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="
              display: inline-block;
              background: #2563eb;
              color: white;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 11px;
              text-decoration: none;
              font-weight: 600;
            ">Get Directions</a>
            <button id="btn-view-shop-${shop.id}" style="
              background: #f1f5f9;
              color: #1e293b;
              border: 1px solid #cbd5e1;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
            ">View Shop</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-view-shop-${shop.id}`);
        if (btn && onSelectShop) {
          btn.onclick = () => onSelectShop(shop.id);
        }
      });

      marker.on('click', () => {
        if (onSelectShop) {
          onSelectShop(shop.id);
        }
      });
    });

    // Center map on user location
    map.setView([userLocation.latitude, userLocation.longitude], radiusKm <= 3 ? 14 : radiusKm <= 10 ? 13 : 11);
  }, [userLocation, shops, radiusKm, selectedShopId, onSelectShop]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} style={{ height, width: '100%', zIndex: 10 }} />
      <div className="absolute bottom-2 left-2 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-600 shadow-sm border border-slate-200 flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          You
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
          Shops
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block"></span>
          Pharmacies
        </span>
      </div>
    </div>
  );
};
