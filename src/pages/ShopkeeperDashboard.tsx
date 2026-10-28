import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { AvailabilityStatus, Product } from '../types';
import { formatINR, formatStockAge, isStockOutdated } from '../utils/geo';
import { AvailabilityBadge } from '../components/AvailabilityBadge';
import {
  Store,
  Package,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  MessageSquare,
  Upload,
  FileSpreadsheet,
  X,
  Edit2,
  Sliders,
  DollarSign,
} from 'lucide-react';

interface ShopkeeperDashboardProps {
  onNavigate: (view: string, param?: string) => void;
  onViewProduct: (productId: string) => void;
}

export const ShopkeeperDashboard: React.FC<ShopkeeperDashboardProps> = ({
  onNavigate,
  onViewProduct,
}) => {
  const {
    currentUser,
    shops,
    products,
    inventory,
    enquiries,
    updateShopProfile,
    quickUpdateStockAndPrice,
    addProductAndInventory,
    respondToEnquiry,
  } = useApp();

  // Find this shopkeeper's shop (or fall back to first shop in demo)
  const currentShopId = currentUser?.shopId || shops[0].id;
  const shop = shops.find((s) => s.id === currentShopId) || shops[0];

  const shopInventories = inventory.filter((inv) => inv.shopId === shop.id);

  // States
  const [activeTab, setActiveTab] = useState<'inventory' | 'enquiries' | 'profile' | 'bulk'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Enquiry response modal state
  const [replyingEnqId, setReplyingEnqId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Add Product Form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdModel, setNewProdModel] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(shop.categoryId || 'cat-elec');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(499);
  const [newProdQuantity, setNewProdQuantity] = useState<number>(10);
  const [newProdStatus, setNewProdStatus] = useState<AvailabilityStatus>('in_stock_confirmed');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80');

  // Enquiries for this shop
  const shopEnquiries = enquiries.filter((e) => e.shopId === shop.id);

  // Stats
  const totalItems = shopInventories.length;
  const inStockCount = shopInventories.filter((i) => i.availabilityStatus === 'in_stock_confirmed').length;
  const outdatedCount = shopInventories.filter((i) => isStockOutdated(i.lastUpdatedAt)).length;
  const pendingEnquiriesCount = shopEnquiries.filter((e) => e.status === 'pending').length;

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleQuickUpdate = (
    invId: string,
    qty: number,
    price: number,
    status: AvailabilityStatus
  ) => {
    quickUpdateStockAndPrice(invId, qty, price, status);
    showToast('Inventory updated! Stock freshness timestamp refreshed.');
  };

  const handleMarkAllConfirmedToday = () => {
    shopInventories.forEach((inv) => {
      quickUpdateStockAndPrice(inv.id, inv.quantity, inv.price, inv.availabilityStatus);
    });
    showToast('All products marked as freshly confirmed today!');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdBrand) return;

    addProductAndInventory(
      {
        name: newProdName,
        brand: newProdBrand,
        model: newProdModel,
        categoryId: newProdCategory,
        description: newProdDesc || 'Brand new genuine product available in store.',
        images: [newProdImage],
        specifications: { 'Listed by': shop.name },
      },
      {
        price: newProdPrice,
        quantity: newProdQuantity,
        availabilityStatus: newProdStatus,
      }
    );

    setIsAddModalOpen(false);
    // Reset form
    setNewProdName('');
    setNewProdBrand('');
    setNewProdModel('');
    showToast('New product added to store catalogue!');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingEnqId || !replyText.trim()) return;
    respondToEnquiry(replyingEnqId, replyText.trim());
    setReplyingEnqId(null);
    setReplyText('');
    showToast('Customer enquiry response sent!');
  };

  // Filtered inventory
  const filteredInventory = shopInventories.filter((inv) => {
    const prod = products.find((p) => p.id === inv.productId);
    if (!prod) return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      prod.name.toLowerCase().includes(q) ||
      prod.brand.toLowerCase().includes(q) ||
      inv.sku?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Alert */}
      {statusMessage && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Profile Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-indigo-500/20">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{shop.name}</h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  shop.verificationStatus === 'approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {shop.verificationStatus === 'approved' ? 'Verified Store' : 'Pending Verification'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {shop.address}, {shop.city} • Owner: <strong>{currentUser?.name || 'Ramesh Patel'}</strong>
            </p>
          </div>
        </div>

        {/* Live open toggle and add product button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => updateShopProfile(shop.id, { isOpen: !shop.isOpen })}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              shop.isOpen
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {shop.isOpen ? '● Counter Open Now' : '● Counter Closed'}
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Products
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalItems}</div>
          <span className="text-[11px] text-blue-600 font-medium">In Store Catalogue</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Confirmed In Stock
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{inStockCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Ready for walk-ins</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Outdated Stock Info
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{outdatedCount}</div>
          <span className="text-[11px] text-amber-600 font-medium">&gt; 48 hours without update</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Customer Inquiries
          </span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{pendingEnquiriesCount}</div>
          <span className="text-[11px] text-indigo-600 font-medium">Pending replies</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'inventory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Manage Inventory ({shopInventories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'enquiries' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Customer Inquiries ({shopEnquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'bulk' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>CSV Bulk Upload</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Shop Profile</span>
        </button>
      </div>

      {/* Tab 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Filter by product name, brand, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleMarkAllConfirmedToday}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Mark All Confirmed Today</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Price (INR ₹)</th>
                    <th className="p-3.5">Counter Qty</th>
                    <th className="p-3.5">Stock Status</th>
                    <th className="p-3.5">Last Verified</th>
                    <th className="p-3.5 text-right">Quick Save</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((inv) => {
                    const prod = products.find((p) => p.id === inv.productId);
                    if (!prod) return null;
                    const outdated = isStockOutdated(inv.lastUpdatedAt);

                    return (
                      <InventoryRow
                        key={inv.id}
                        inv={inv}
                        product={prod}
                        isOutdated={outdated}
                        onSave={handleQuickUpdate}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredInventory.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No inventory items match &quot;{searchTerm}&quot;.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Customer inquiries submitted by nearby shoppers looking for products at your store.
          </p>

          {shopEnquiries.length > 0 ? (
            <div className="space-y-3">
              {shopEnquiries.map((enq) => (
                <div key={enq.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{enq.customerName}</span>
                      <span className="text-xs text-slate-500 ml-2">Phone: {enq.customerPhone}</span>
                      <div className="text-xs text-blue-600 font-semibold mt-0.5">Product: {enq.productName}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          enq.status === 'responded'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {enq.status === 'responded' ? 'Answered' : 'Awaiting Reply'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-900 block mb-0.5">Customer Message:</span>
                    {enq.message}
                  </div>

                  {enq.response ? (
                    <div className="text-xs text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      <span className="font-bold text-emerald-950 block mb-0.5">Your Sent Reply:</span>
                      {enq.response}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setReplyingEnqId(enq.id);
                        setReplyText('Hello! Yes, this item is currently available in stock at our store. You can visit us today.');
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                    >
                      Reply to Customer
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No inquiries received yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: CSV Bulk Upload */}
      {activeTab === 'bulk' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bulk Product & Inventory Upload (CSV)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Easily import your entire shop catalogue using standard spreadsheet format (.csv)
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3 bg-slate-50 hover:bg-blue-50/40 transition-colors">
            <Upload className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">Drag and drop your store inventory CSV file</p>
              <p className="text-[11px] text-slate-500">
                Supports SKU, Product Name, Category, Brand, Price, and Quantity columns
              </p>
            </div>
            <button
              onClick={() => showToast('Sample CSV upload validated! 15 items simulated.')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs"
            >
              Upload Sample CSV
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-800 block">Sample CSV Format:</span>
            <pre className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 overflow-x-auto font-mono">
              sku,name,brand,price,quantity,status{'\n'}
              TH-CHG-65W,65W GaN Fast Charger,Portronics,1099,14,in_stock_confirmed{'\n'}
              TH-CHG-20W,20W USB-C Adapter,Ambrane,499,25,in_stock_confirmed
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Shop Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-5 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900">Store Profile Settings</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Operating Hours</label>
              <input
                type="text"
                defaultValue={shop.openingHours}
                onBlur={(e) => updateShopProfile(shop.id, { openingHours: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Store Phone Number</label>
              <input
                type="tel"
                defaultValue={shop.phone}
                onBlur={(e) => updateShopProfile(shop.id, { phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp Business Number</label>
              <input
                type="tel"
                defaultValue={shop.whatsapp}
                onBlur={(e) => updateShopProfile(shop.id, { whatsapp: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-emerald-700 font-semibold">
                ✓ Changes save automatically to store listing.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Product Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Add Product to Store</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 65W Fast GaN Charger"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Portronics"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Model (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Adapto 65"
                    value={newProdModel}
                    onChange={(e) => setNewProdModel(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdQuantity}
                    onChange={(e) => setNewProdQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status *
                  </label>
                  <select
                    value={newProdStatus}
                    onChange={(e) => setNewProdStatus(e.target.value as AvailabilityStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="in_stock_confirmed">In Stock</option>
                    <option value="low_stock_confirmed">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="unconfirmed">Unconfirmed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Save Product to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reply to Enquiry */}
      {replyingEnqId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Reply to Customer</h3>
            <form onSubmit={handleSendReply} className="space-y-3">
              <textarea
                rows={3}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplyingEnqId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                >
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent for interactive inline inventory row
const InventoryRow: React.FC<{
  inv: any;
  product: Product;
  isOutdated: boolean;
  onSave: (id: string, qty: number, price: number, status: AvailabilityStatus) => void;
}> = ({ inv, product, isOutdated, onSave }) => {
  const [qty, setQty] = useState(inv.quantity);
  const [price, setPrice] = useState(inv.price);
  const [status, setStatus] = useState<AvailabilityStatus>(inv.availabilityStatus);
  const [dirty, setDirty] = useState(false);

  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      <td className="p-3.5">
        <div className="flex items-center gap-2.5">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-10 h-10 object-contain rounded-lg border border-slate-100 bg-white p-1 shrink-0"
          />
          <div>
            <div className="font-bold text-slate-900 line-clamp-1">{product.name}</div>
            <div className="text-[10px] text-slate-400">
              {product.brand} • SKU: {inv.sku || 'N/A'}
            </div>
          </div>
        </div>
      </td>

      <td className="p-3.5">
        <div className="flex items-center gap-1">
          <span className="text-slate-400">₹</span>
          <input
            type="number"
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
              setDirty(true);
            }}
            className="w-20 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
          />
        </div>
      </td>

      <td className="p-3.5">
        <input
          type="number"
          value={qty}
          onChange={(e) => {
            const val = Number(e.target.value);
            setQty(val);
            if (val === 0) setStatus('out_of_stock');
            else if (val < 5) setStatus('low_stock_confirmed');
            else setStatus('in_stock_confirmed');
            setDirty(true);
          }}
          className="w-16 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
        />
      </td>

      <td className="p-3.5">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as AvailabilityStatus);
            setDirty(true);
          }}
          className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
        >
          <option value="in_stock_confirmed">In Stock (Confirmed)</option>
          <option value="low_stock_confirmed">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="unconfirmed">Unconfirmed</option>
        </select>
      </td>

      <td className="p-3.5 whitespace-nowrap">
        <AvailabilityBadge
          status={inv.availabilityStatus}
          lastUpdatedAt={inv.lastUpdatedAt}
          isOutdated={isOutdated}
          compact
        />
      </td>

      <td className="p-3.5 text-right">
        <button
          onClick={() => {
            onSave(inv.id, qty, price, status);
            setDirty(false);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            dirty
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs animate-pulse'
              : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600'
          }`}
          title="Save stock & refresh verification timestamp"
        >
          {dirty ? 'Save' : 'Confirm'}
        </button>
      </td>
    </tr>
  );
};
