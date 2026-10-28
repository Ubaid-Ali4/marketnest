import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatDistance, calculateDistanceKm } from '../utils/geo';
import {
  Heart,
  Clock,
  MessageSquare,
  AlertTriangle,
  User,
  MapPin,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Store,
} from 'lucide-react';

interface CustomerDashboardProps {
  onNavigate: (view: string, param?: string) => void;
  onViewProduct: (productId: string) => void;
  onViewShop: (shopId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onNavigate,
  onViewProduct,
  onViewShop,
}) => {
  const {
    currentUser,
    favourites,
    toggleFavourite,
    products,
    shops,
    searchHistory,
    enquiries,
    reports,
    selectedLocation,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'favourites' | 'enquiries' | 'history' | 'reports'>('favourites');

  // Resolved entities in favourites
  const favProducts = favourites
    .filter((f) => f.entityType === 'product')
    .map((f) => products.find((p) => p.id === f.entityId))
    .filter((p): p is (typeof products)[0] => Boolean(p));

  const favShops = favourites
    .filter((f) => f.entityType === 'shop')
    .map((f) => shops.find((s) => s.id === f.entityId))
    .filter((s): s is (typeof shops)[0] => Boolean(s));

  const myEnquiries = enquiries.filter(
    (e) => !currentUser || e.customerId === currentUser.id || e.customerId === 'guest-cust'
  );

  const myReports = reports.filter(
    (r) => !currentUser || r.reporterId === currentUser.id || r.reporterId === 'guest'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-extrabold shadow-md shadow-blue-500/20">
            {currentUser?.name.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser?.name || 'Customer Account'}
              </h1>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                {currentUser?.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser?.email || 'customer@marketnest.demo'} • {currentUser?.phone || '+91 98450 12345'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('search', '')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
        >
          Discover New Products
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-xs font-bold uppercase tracking-wider overflow-x-auto">
        <button
          onClick={() => setActiveTab('favourites')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'favourites'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Favourites ({favProducts.length + favShops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'enquiries'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Enquiries ({myEnquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Search History</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Reported Inaccuracies ({myReports.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'favourites' && (
        <div className="space-y-6">
          {/* Saved Products */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
              Saved Products ({favProducts.length})
            </h3>
            {favProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-16 h-16 object-contain bg-slate-50 p-1.5 rounded-xl border border-slate-100"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase">{p.brand}</span>
                        <h4
                          onClick={() => onViewProduct(p.id)}
                          className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 hover:text-blue-600 cursor-pointer"
                        >
                          {p.name}
                        </h4>
                        <button
                          onClick={() => onViewProduct(p.id)}
                          className="text-[11px] font-semibold text-blue-600 hover:underline mt-1 block"
                        >
                          Compare Shops &rarr;
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavourite('product', p.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No products saved yet. Tap the heart icon on any product.</p>
            )}
          </div>

          {/* Saved Shops */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
              Saved Shops ({favShops.length})
            </h3>
            {favShops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favShops.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-100"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase">{s.category}</span>
                        <h4
                          onClick={() => onViewShop(s.id)}
                          className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 hover:text-blue-600 cursor-pointer"
                        >
                          {s.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 truncate max-w-[170px]">{s.address}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavourite('shop', s.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No shops saved yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Enquiries tab */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Messages you sent to nearby shops to confirm stock or pricing before travelling
          </p>

          {myEnquiries.length > 0 ? (
            <div className="space-y-3">
              {myEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{enq.shopName}</span>
                      <p className="text-xs text-slate-500">Regarding: {enq.productName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          enq.status === 'responded'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {enq.status === 'responded' ? 'Shop Responded' : 'Pending Shop Response'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-900 block mb-0.5">Your Question:</span>
                    {enq.message}
                  </div>

                  {enq.response ? (
                    <div className="text-xs text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      <span className="font-bold text-emerald-950 flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Shopkeeper Response:
                      </span>
                      {enq.response}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Waiting for shopkeeper to reply...</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              You haven&apos;t sent any availability enquiries yet.
            </div>
          )}
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Recent Local Searches
          </h3>
          {searchHistory.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {searchHistory.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="font-semibold text-slate-800 text-sm">{item.query}</span>
                      <span className="text-xs text-slate-400 block">{item.selectedLocation}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('search', item.query)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100"
                  >
                    Search Again
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No search history recorded yet.</p>
          )}
        </div>
      )}

      {/* Reports tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Reports you submitted regarding inaccurate prices or outdated inventory
          </p>
          {myReports.length > 0 ? (
            <div className="space-y-3">
              {myReports.map((rep) => (
                <div key={rep.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{rep.shopName}</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Status: {rep.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {rep.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No reports filed.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
