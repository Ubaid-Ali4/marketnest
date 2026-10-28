import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { isStockOutdated, formatStockAge } from '../utils/geo';
import {
  ShieldCheck,
  Store,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Package,
  Layers,
  Search,
  Bell,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string, param?: string) => void;
  onViewShop: (shopId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onViewShop,
}) => {
  const {
    shops,
    products,
    inventory,
    reports,
    adminApproveShop,
    adminResolveReport,
    resetAllDemoData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'shops' | 'reports' | 'outdated' | 'categories'>('shops');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const pendingShops = shops.filter((s) => s.verificationStatus === 'pending');
  const approvedShops = shops.filter((s) => s.verificationStatus === 'approved');
  const openReports = reports.filter((r) => r.status === 'open' || r.status === 'investigating');

  // Find inventory items that are outdated (>48 hours)
  const outdatedItems = inventory
    .filter((inv) => isStockOutdated(inv.lastUpdatedAt))
    .map((inv) => {
      const shop = shops.find((s) => s.id === inv.shopId);
      const product = products.find((p) => p.id === inv.productId);
      return { inv, shop, product };
    })
    .filter((item): item is { inv: (typeof inventory)[0]; shop: (typeof shops)[0]; product: (typeof products)[0] } =>
      Boolean(item.shop && item.product)
    );

  const handleApprove = (shopId: string, approve: boolean) => {
    adminApproveShop(shopId, approve);
    showToast(approve ? 'Shop approved! Now visible to local shoppers.' : 'Shop registration rejected.');
  };

  const handleResolveReport = (reportId: string, resolution: 'resolved' | 'dismissed') => {
    adminResolveReport(reportId, resolution);
    showToast(`Report marked as ${resolution}.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              MarketNest Platform Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin & Moderation Console</h1>
          <p className="text-xs text-slate-400">
            Review merchant registrations, audit inventory accuracy, and inspect user complaints.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all demo state to fresh mock data?')) {
              resetAllDemoData();
              showToast('Demo data reset to original state.');
            }
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sample Database</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Approved Stores
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{approvedShops.length}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Live on platform</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Review
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingShops.length}</div>
          <span className="text-[11px] text-amber-600 font-medium">Awaiting verification</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Inaccuracy Reports
          </span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{openReports.length}</div>
          <span className="text-[11px] text-rose-600 font-medium">Pending investigation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Outdated Stock
          </span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{outdatedItems.length}</div>
          <span className="text-[11px] text-indigo-600 font-medium">&gt; 48 hours without update</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 text-xs font-bold uppercase tracking-wider overflow-x-auto">
        <button
          onClick={() => setActiveTab('shops')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'shops' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Shop Registrations ({pendingShops.length} pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reports' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Inaccuracy Reports ({openReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('outdated')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'outdated' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Outdated Inventory Monitor ({outdatedItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`py-3 px-1 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'categories' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({CATEGORIES.length})</span>
        </button>
      </div>

      {/* Tab 1: Shop Approvals Queue */}
      {activeTab === 'shops' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Pending Shop Review Queue ({pendingShops.length})
          </h3>

          {pendingShops.length > 0 ? (
            <div className="space-y-3">
              {pendingShops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">{shop.name}</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Pending
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Category: <strong>{shop.category}</strong> • City: {shop.city}, {shop.state}
                    </div>
                    <div className="text-xs text-slate-600">
                      Address: {shop.address} • Phone: {shop.phone}
                    </div>
                    {shop.licenseNumber && (
                      <div className="text-[11px] font-mono text-blue-700 bg-blue-50 py-0.5 px-2 rounded inline-block">
                        License / GSTIN: {shop.licenseNumber}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => handleApprove(shop.id, true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Shop</span>
                    </button>
                    <button
                      onClick={() => handleApprove(shop.id, false)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No pending shop applications in review queue. All shops verified!
            </div>
          )}

          {/* All approved shops list */}
          <div className="pt-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Approved Live Shops ({approvedShops.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {approvedShops.map((s) => (
                <div key={s.id} className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block truncate max-w-[190px]">{s.name}</span>
                    <span className="text-[11px] text-slate-500">{s.category}</span>
                  </div>
                  <button
                    onClick={() => onViewShop(s.id)}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Inaccuracy Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Reported Listing Inaccuracies
          </h3>

          {openReports.length > 0 ? (
            <div className="space-y-3">
              {openReports.map((rep) => (
                <div key={rep.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">Shop: {rep.shopName}</span>
                      {rep.productName && <p className="text-xs text-blue-600">Product: {rep.productName}</p>}
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase">
                      Issue: {rep.issueType.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    &quot;{rep.description}&quot;
                  </p>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleResolveReport(rep.id, 'dismissed')}
                      className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => handleResolveReport(rep.id, 'resolved')}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs"
                    >
                      Resolve & Update Store
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No active complaints or inaccurate reports.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Outdated Inventory Monitor */}
      {activeTab === 'outdated' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Outdated Inventory Detection
              </h3>
              <p className="text-xs text-slate-500">
                Items not re-confirmed by merchant counter in over 48 hours
              </p>
            </div>
          </div>

          {outdatedItems.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-3">Store</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Last Confirmed</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outdatedItems.map(({ inv, shop, product }) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{shop.name}</td>
                      <td className="p-3 text-slate-700">{product.name}</td>
                      <td className="p-3 text-amber-600 font-medium">{formatStockAge(inv.lastUpdatedAt)}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => showToast(`Automated WhatsApp ping queued to ${shop.name}!`)}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold"
                        >
                          Ping Storekeeper
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              All store inventories have fresh timestamps under 48 hours old.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Categories */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900 text-sm">{c.name}</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">{c.description}</p>
              <div className="text-blue-600 font-semibold pt-1">{c.itemCount} active sample listings</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
