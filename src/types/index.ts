export type UserRole = 'customer' | 'shopkeeper' | 'admin';

export type AvailabilityStatus =
  | 'in_stock_confirmed'      // In Stock — Recently Confirmed
  | 'low_stock_confirmed'     // Low Stock — Recently Confirmed
  | 'out_of_stock'            // Out of Stock
  | 'unconfirmed'             // Availability Unconfirmed
  | 'outdated';               // Stock Information Outdated

export type VerificationStatus = 'approved' | 'pending' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  shopId?: string; // If role is shopkeeper
  createdAt: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CityLocation {
  id: string;
  name: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  normalizedName: string;
  brand: string;
  model?: string;
  categoryId: string;
  description: string;
  images: string[];
  specifications: Record<string, string>;
  isPrescriptionRequired?: boolean;
  regulatedWarning?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  shopId: string;
  productId: string;
  price: number;
  currency: string; // 'INR'
  quantity: number;
  availabilityStatus: AvailabilityStatus;
  lastUpdatedAt: string; // ISO string
  notes?: string;
  sku?: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  whatsapp: string;
  openingHours: string;
  verificationStatus: VerificationStatus;
  isOpen: boolean;
  is24x7?: boolean;
  rating: number;
  reviewCount: number;
  image: string;
  licenseNumber?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  shopId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedVisit?: boolean;
}

export interface Favourite {
  id: string;
  userId: string;
  entityType: 'product' | 'shop';
  entityId: string;
  createdAt: string;
}

export interface SearchHistoryItem {
  id: string;
  userId?: string;
  query: string;
  selectedLocation: string;
  timestamp: string;
}

export interface Enquiry {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shopId: string;
  shopName: string;
  productId: string;
  productName: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  response?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  shopId: string;
  shopName: string;
  productId?: string;
  productName?: string;
  issueType: 'incorrect_price' | 'inaccurate_availability' | 'shop_closed' | 'counterfeit' | 'other';
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}

// Product search item combining product details with matching shop inventory
export interface ProductSearchResult {
  product: Product;
  shop: Shop;
  inventory: InventoryItem;
  distanceKm: number;
  isOutdated: boolean;
}
