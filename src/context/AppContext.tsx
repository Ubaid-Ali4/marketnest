import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  CityLocation,
  Product,
  Shop,
  InventoryItem,
  Review,
  Favourite,
  SearchHistoryItem,
  Enquiry,
  Report,
  ProductSearchResult,
  AvailabilityStatus,
  UserRole,
} from '../types';
import {
  CITIES,
  DEMO_USERS,
  INITIAL_SHOPS,
  INITIAL_PRODUCTS,
  INITIAL_INVENTORY,
  INITIAL_REVIEWS,
  INITIAL_ENQUIRIES,
} from '../data/mockData';
import { calculateDistanceKm, isStockOutdated } from '../utils/geo';

interface AppContextType {
  // Auth & Roles
  currentUser: User | null;
  activeRole: UserRole | 'guest';
  switchDemoRole: (role: UserRole | 'guest') => void;
  loginUser: (email: string, role?: UserRole) => boolean;
  signupUser: (name: string, email: string, phone: string, role: UserRole) => boolean;
  logout: () => void;

  // Location
  selectedLocation: CityLocation;
  setSelectedLocation: (loc: CityLocation) => void;
  setUserCustomLocation: (lat: number, lng: number, name?: string) => void;
  searchRadiusKm: number;
  setSearchRadiusKm: (radius: number) => void;

  // Data
  products: Product[];
  shops: Shop[];
  inventory: InventoryItem[];
  reviews: Review[];
  favourites: Favourite[];
  searchHistory: SearchHistoryItem[];
  enquiries: Enquiry[];
  reports: Report[];

  // Search & Retrieval
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recordSearchHistory: (query: string) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  performSearch: (query?: string, filters?: SearchFilters) => ProductSearchResult[];
  getShop: (id: string) => Shop | undefined;
  getProduct: (id: string) => Product | undefined;
  getProductListings: (productId: string) => { shop: Shop; inventory: InventoryItem; distanceKm: number }[];
  getShopProducts: (shopId: string) => { product: Product; inventory: InventoryItem }[];

  // Actions
  toggleFavourite: (entityType: 'product' | 'shop', entityId: string) => void;
  isFavourite: (entityType: 'product' | 'shop', entityId: string) => boolean;
  sendEnquiry: (shopId: string, productId: string, message: string) => Promise<boolean>;
  respondToEnquiry: (enquiryId: string, response: string) => void;
  submitReport: (shopId: string, productId: string | undefined, issueType: Report['issueType'], description: string) => void;
  submitReview: (shopId: string, rating: number, comment: string) => void;

  // Shopkeeper Actions
  registerShop: (newShop: Omit<Shop, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'verificationStatus'>) => string;
  updateShopProfile: (shopId: string, updates: Partial<Shop>) => void;
  updateInventory: (inventoryId: string, updates: Partial<InventoryItem>) => void;
  quickUpdateStockAndPrice: (inventoryId: string, quantity: number, price: number, status: AvailabilityStatus) => void;
  addProductAndInventory: (
    productData: Omit<Product, 'id' | 'createdAt' | 'normalizedName'>,
    inventoryData: { price: number; quantity: number; availabilityStatus: AvailabilityStatus; notes?: string; sku?: string }
  ) => void;

  // Admin Actions
  adminApproveShop: (shopId: string, approve: boolean) => void;
  adminResolveReport: (reportId: string, resolution: 'resolved' | 'dismissed') => void;
  resetAllDemoData: () => void;
}

export interface SearchFilters {
  categoryId?: string;
  maxDistanceKm?: number;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  availability?: string; // 'all' | 'in_stock'
  sortBy?: 'nearest' | 'price_asc' | 'price_desc' | 'recently_updated' | 'rating';
}

const STORAGE_KEYS = {
  SHOPS: 'marketnest_demo_shops_v2',
  PRODUCTS: 'marketnest_demo_products_v2',
  INVENTORY: 'marketnest_demo_inventory_v2',
  REVIEWS: 'marketnest_demo_reviews_v2',
  FAVOURITES: 'marketnest_demo_favourites_v2',
  HISTORY: 'marketnest_demo_history_v2',
  ENQUIRIES: 'marketnest_demo_enquiries_v2',
  REPORTS: 'marketnest_demo_reports_v2',
  LOCATION: 'marketnest_selected_location_v2',
  CURRENT_USER: 'marketnest_current_user_v2',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEMO_USERS[0]; // Default to Customer (Rahul Sharma)
  });

  const activeRole: UserRole | 'guest' = currentUser ? currentUser.role : 'guest';

  // Location state
  const [selectedLocation, setSelectedLocationState] = useState<CityLocation>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCATION);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return CITIES[0]; // Default Indiranagar, Bengaluru
  });

  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Entities state with localStorage persistence
  const [shops, setShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOPS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_SHOPS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_PRODUCTS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_INVENTORY;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_REVIEWS;
  });

  const [favourites, setFavourites] = useState<Favourite[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      { id: 'fav-1', userId: 'user-cust-1', entityType: 'product', entityId: 'prod-charger-65w', createdAt: '2026-02-01T00:00:00Z' },
      { id: 'fav-2', userId: 'user-cust-1', entityType: 'shop', entityId: 'shop-elec-1', createdAt: '2026-02-01T00:00:00Z' },
    ];
  });

  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      { id: 'sh-1', query: 'mobile charger', selectedLocation: 'Indiranagar, Bengaluru', timestamp: '2026-10-28T06:00:00Z' },
      { id: 'sh-2', query: 'paracetamol', selectedLocation: 'Indiranagar, Bengaluru', timestamp: '2026-10-28T05:30:00Z' },
    ];
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_ENQUIRIES;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      {
        id: 'rep-1',
        reporterId: 'user-cust-1',
        reporterName: 'Rahul Sharma',
        shopId: 'shop-elec-4',
        shopName: 'Silicon Valley Gadget Spares',
        productId: 'prod-charger-65w',
        productName: '65W GaN Fast Charger Dual Port',
        issueType: 'inaccurate_availability',
        description: 'Listing states unconfirmed stock; visited store and owner mentioned they will restock only next month.',
        status: 'open',
        createdAt: '2026-10-27T14:00:00Z',
      },
    ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favourites));
  }, [favourites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const setSelectedLocation = (loc: CityLocation) => {
    setSelectedLocationState(loc);
    localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(loc));
  };

  const setUserCustomLocation = (latitude: number, longitude: number, name?: string) => {
    const customLoc: CityLocation = {
      id: `custom-loc-${Date.now()}`,
      name: name || 'My Current Location (GPS)',
      area: 'Local Neighborhood',
      city: 'Current City',
      state: 'Local Region',
      postalCode: '',
      latitude,
      longitude,
    };
    setSelectedLocation(customLoc);
  };

  // Role & Demo Account Switcher
  const switchDemoRole = (role: UserRole | 'guest') => {
    if (role === 'guest') {
      setCurrentUser(null);
      return;
    }
    const found = DEMO_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const loginUser = (email: string, role: UserRole = 'customer'): boolean => {
    const existing = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    // Create session user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const signupUser = (name: string, email: string, phone: string, role: UserRole): boolean => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Get single entities
  const getShop = (id: string) => shops.find((s) => s.id === id);
  const getProduct = (id: string) => products.find((p) => p.id === id);

  // Get all shops offering a product with real Haversine distance
  const getProductListings = (productId: string) => {
    const items = inventory.filter((inv) => inv.productId === productId);
    return items
      .map((inv) => {
        const shop = shops.find((s) => s.id === inv.shopId);
        if (!shop) return null;
        const distanceKm = calculateDistanceKm(
          { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude },
          { latitude: shop.latitude, longitude: shop.longitude }
        );
        return { shop, inventory: inv, distanceKm };
      })
      .filter((item): item is { shop: Shop; inventory: InventoryItem; distanceKm: number } => item !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  };

  const getShopProducts = (shopId: string) => {
    const shopInventories = inventory.filter((inv) => inv.shopId === shopId);
    return shopInventories
      .map((inv) => {
        const product = products.find((p) => p.id === inv.productId);
        if (!product) return null;
        return { product, inventory: inv };
      })
      .filter((item): item is { product: Product; inventory: InventoryItem } => item !== null);
  };

  // Standalone method to record search query on user action without render side-effects
  const recordSearchHistory = (query: string) => {
    const q = query.trim();
    if (!q || q.length < 2) return;
    setSearchHistory((prev) => {
      const exists = prev.some((item) => item.query.toLowerCase() === q.toLowerCase());
      if (!exists) {
        const newItem: SearchHistoryItem = {
          id: `sh-${Date.now()}`,
          userId: currentUser?.id,
          query: q,
          selectedLocation: selectedLocation.name,
          timestamp: new Date().toISOString(),
        };
        return [newItem, ...prev.slice(0, 9)];
      }
      return prev;
    });
  };

  // Core Search Engine: Product + Shops + Inventory matching + distance filtering (Pure computation)
  const performSearch = (queryOverride?: string, filters?: SearchFilters): ProductSearchResult[] => {
    const q = (queryOverride !== undefined ? queryOverride : searchQuery).trim().toLowerCase();
    const maxDist = filters?.maxDistanceKm || searchRadiusKm;
    const results: ProductSearchResult[] = [];

    // Filter products
    const matchedProducts = products.filter((prod) => {
      // Category filter
      if (filters?.categoryId && prod.categoryId !== filters.categoryId) {
        return false;
      }
      if (!q) return true; // Show all if no text query

      // Token match / normalized match
      const haystack = `${prod.name} ${prod.normalizedName} ${prod.brand} ${prod.model || ''} ${prod.description}`.toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);
      return tokens.every((token) => haystack.includes(token));
    });

    matchedProducts.forEach((product) => {
      // Find all inventories
      const productInvs = inventory.filter((inv) => inv.productId === product.id);

      productInvs.forEach((inv) => {
        const shop = shops.find((s) => s.id === inv.shopId);
        if (!shop) return;
        if (shop.verificationStatus !== 'approved') return;

        const distanceKm = calculateDistanceKm(
          { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude },
          { latitude: shop.latitude, longitude: shop.longitude }
        );

        // Distance filter
        if (maxDist && distanceKm > maxDist) return;

        // Price filter
        if (filters?.minPrice && inv.price < filters.minPrice) return;
        if (filters?.maxPrice && inv.price > filters.maxPrice) return;

        // Brand filter
        if (filters?.brand && product.brand.toLowerCase() !== filters.brand.toLowerCase()) return;

        // Availability filter
        if (filters?.availability === 'in_stock' && inv.availabilityStatus !== 'in_stock_confirmed') return;

        const outdated = isStockOutdated(inv.lastUpdatedAt);

        results.push({
          product,
          shop,
          inventory: inv,
          distanceKm,
          isOutdated: outdated,
        });
      });
    });

    // Sorting
    const sortBy = filters?.sortBy || 'nearest';
    results.sort((a, b) => {
      if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
      if (sortBy === 'price_asc') return a.inventory.price - b.inventory.price;
      if (sortBy === 'price_desc') return b.inventory.price - a.inventory.price;
      if (sortBy === 'rating') return b.shop.rating - a.shop.rating;
      if (sortBy === 'recently_updated') {
        return new Date(b.inventory.lastUpdatedAt).getTime() - new Date(a.inventory.lastUpdatedAt).getTime();
      }
      return 0;
    });

    return results;
  };

  // Favourites
  const toggleFavourite = (entityType: 'product' | 'shop', entityId: string) => {
    const userId = currentUser?.id || 'guest';
    setFavourites((prev) => {
      const existing = prev.find((f) => f.userId === userId && f.entityType === entityType && f.entityId === entityId);
      if (existing) {
        return prev.filter((f) => f.id !== existing.id);
      }
      const newFav: Favourite = {
        id: `fav-${Date.now()}`,
        userId,
        entityType,
        entityId,
        createdAt: new Date().toISOString(),
      };
      return [...prev, newFav];
    });
  };

  const isFavourite = (entityType: 'product' | 'shop', entityId: string) => {
    const userId = currentUser?.id || 'guest';
    return favourites.some((f) => f.userId === userId && f.entityType === entityType && f.entityId === entityId);
  };

  // Enquiries
  const sendEnquiry = async (shopId: string, productId: string, message: string): Promise<boolean> => {
    const shop = shops.find((s) => s.id === shopId);
    const prod = products.find((p) => p.id === productId);
    if (!shop || !prod) return false;

    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      customerId: currentUser?.id || 'guest-cust',
      customerName: currentUser?.name || 'Local Customer',
      customerPhone: currentUser?.phone || '+91 98765 43210',
      shopId,
      shopName: shop.name,
      productId,
      productName: prod.name,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);
    return true;
  };

  const respondToEnquiry = (enquiryId: string, response: string) => {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === enquiryId
          ? {
              ...e,
              response,
              status: 'responded',
              updatedAt: new Date().toISOString(),
            }
          : e
      )
    );
  };

  // Reports
  const submitReport = (
    shopId: string,
    productId: string | undefined,
    issueType: Report['issueType'],
    description: string
  ) => {
    const shop = shops.find((s) => s.id === shopId);
    const prod = productId ? products.find((p) => p.id === productId) : undefined;

    const newReport: Report = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser?.id || 'guest',
      reporterName: currentUser?.name || 'Anonymous User',
      shopId,
      shopName: shop?.name || 'Unknown Shop',
      productId,
      productName: prod?.name,
      issueType,
      description,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);
  };

  // Reviews
  const submitReview = (shopId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      shopId,
      userId: currentUser?.id || 'guest-reviewer',
      userName: currentUser?.name || 'Local Shopper',
      rating,
      comment,
      createdAt: new Date().toISOString(),
      verifiedVisit: true,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Update shop average rating
    setShops((prev) =>
      prev.map((s) => {
        if (s.id === shopId) {
          const shopReviews = [...reviews.filter((r) => r.shopId === shopId), newReview];
          const avg = shopReviews.reduce((sum, r) => sum + r.rating, 0) / shopReviews.length;
          return {
            ...s,
            rating: Math.round(avg * 10) / 10,
            reviewCount: shopReviews.length,
          };
        }
        return s;
      })
    );
  };

  // Shopkeeper Actions
  const registerShop = (newShopData: Omit<Shop, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'verificationStatus'>): string => {
    const shopId = `shop-${Date.now()}`;
    const newShop: Shop = {
      ...newShopData,
      id: shopId,
      verificationStatus: 'pending', // Starts in pending review by Admin!
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };

    setShops((prev) => [...prev, newShop]);

    // If current user is logged in, link shopId
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        shopId,
        role: 'shopkeeper',
      });
    }

    return shopId;
  };

  const updateShopProfile = (shopId: string, updates: Partial<Shop>) => {
    setShops((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, ...updates } : s))
    );
  };

  const updateInventory = (inventoryId: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === inventoryId
          ? { ...item, ...updates, lastUpdatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const quickUpdateStockAndPrice = (
    inventoryId: string,
    quantity: number,
    price: number,
    status: AvailabilityStatus
  ) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === inventoryId
          ? {
              ...item,
              quantity,
              price,
              availabilityStatus: status,
              lastUpdatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const addProductAndInventory = (
    productData: Omit<Product, 'id' | 'createdAt' | 'normalizedName'>,
    inventoryData: { price: number; quantity: number; availabilityStatus: AvailabilityStatus; notes?: string; sku?: string }
  ) => {
    const prodId = `prod-${Date.now()}`;
    const normalizedName = `${productData.name} ${productData.brand} ${productData.model || ''}`.toLowerCase();

    const newProduct: Product = {
      ...productData,
      id: prodId,
      normalizedName,
      createdAt: new Date().toISOString(),
    };

    const targetShopId = currentUser?.shopId || shops[0].id;

    const newInventory: InventoryItem = {
      id: `inv-${Date.now()}`,
      shopId: targetShopId,
      productId: prodId,
      price: inventoryData.price,
      currency: 'INR',
      quantity: inventoryData.quantity,
      availabilityStatus: inventoryData.availabilityStatus,
      lastUpdatedAt: new Date().toISOString(),
      notes: inventoryData.notes,
      sku: inventoryData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setInventory((prev) => [newInventory, ...prev]);
  };

  // Admin Actions
  const adminApproveShop = (shopId: string, approve: boolean) => {
    setShops((prev) =>
      prev.map((s) =>
        s.id === shopId ? { ...s, verificationStatus: approve ? 'approved' : 'rejected' } : s
      )
    );
  };

  const adminResolveReport = (reportId: string, resolution: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: resolution } : r))
    );
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setShops(INITIAL_SHOPS);
    setProducts(INITIAL_PRODUCTS);
    setInventory(INITIAL_INVENTORY);
    setReviews(INITIAL_REVIEWS);
    setEnquiries(INITIAL_ENQUIRIES);
    setCurrentUser(DEMO_USERS[0]);
    setSelectedLocationState(CITIES[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole,
        switchDemoRole,
        loginUser,
        signupUser,
        logout,
        selectedLocation,
        setSelectedLocation,
        setUserCustomLocation,
        searchRadiusKm,
        setSearchRadiusKm,
        products,
        shops,
        inventory,
        reviews,
        favourites,
        searchHistory,
        enquiries,
        reports,
        searchQuery,
        setSearchQuery,
        recordSearchHistory,
        selectedCategorySlug,
        setSelectedCategorySlug,
        performSearch,
        getShop,
        getProduct,
        getProductListings,
        getShopProducts,
        toggleFavourite,
        isFavourite,
        sendEnquiry,
        respondToEnquiry,
        submitReport,
        submitReview,
        registerShop,
        updateShopProfile,
        updateInventory,
        quickUpdateStockAndPrice,
        addProductAndInventory,
        adminApproveShop,
        adminResolveReport,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
