import { Coordinates } from '../types';

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 * @returns distance in kilometers
 */
export function calculateDistanceKm(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Formats distance nicely for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Checks if stock update is outdated (older than 48 hours)
 */
export function isStockOutdated(lastUpdatedIso: string, thresholdHours: number = 48): boolean {
  try {
    const updated = new Date(lastUpdatedIso).getTime();
    const now = new Date('2026-10-28T07:43:33-07:00').getTime(); // Use current context time or Date.now()
    const diffHours = (now - updated) / (1000 * 60 * 60);
    return diffHours > thresholdHours;
  } catch {
    return true;
  }
}

/**
 * Format relative time for stock confirmation
 */
export function formatStockAge(lastUpdatedIso: string): string {
  try {
    const updated = new Date(lastUpdatedIso).getTime();
    const now = new Date('2026-10-28T07:43:33-07:00').getTime();
    const diffHours = Math.floor((now - updated) / (1000 * 60 * 60));

    if (diffHours < 1) {
      const diffMins = Math.max(1, Math.floor((now - updated) / (1000 * 60)));
      return `${diffMins} min ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  } catch {
    return 'Recently';
  }
}

/**
 * Build external Google Maps navigation link
 */
export function getDirectionsUrl(lat: number, lng: number, shopName: string): string {
  const query = encodeURIComponent(`${shopName}, ${lat},${lng}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${query}`;
}

/**
 * Build WhatsApp click to chat URL with pre-filled enquiry
 */
export function getWhatsAppUrl(phone: string, productName?: string, shopName?: string): string {
  // Strip non-numeric characters
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const indianPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.replace(/^0+/, '')}`;

  let message = `Hello`;
  if (shopName) {
    message += ` ${shopName}`;
  }
  message += `, I found your shop on MarketNest.`;
  if (productName) {
    message += ` Is "${productName}" currently in stock, and what is the best price?`;
  } else {
    message += ` I'd like to enquire about product availability at your store.`;
  }

  return `https://wa.me/${indianPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Currency formatter for Indian Rupee (INR)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
