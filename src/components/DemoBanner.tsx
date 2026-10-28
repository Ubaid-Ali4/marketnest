import React from 'react';
import { useApp } from '../context/AppContext';
import { Info, UserCheck, Store, ShieldCheck, RefreshCw } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { currentUser, switchDemoRole, resetAllDemoData } = useApp();

  return (
    <aside aria-label="Demo notice and role switcher" className="bg-slate-900 text-slate-200 text-xs py-2 px-3 sm:px-6 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center md:text-left">
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded text-[11px] border border-amber-500/30">
            <Info className="w-3.5 h-3.5" />
            DEMO MODE
          </span>
          <span className="text-slate-300">
            Sample data active. All shops, prices, and stock statuses are fictional demonstrations.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-slate-400 font-medium hidden lg:inline">Switch Demo Role:</span>

          <button
            onClick={() => switchDemoRole('customer')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors font-medium ${
              currentUser?.role === 'customer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Act as Customer (Rahul)"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Customer (Rahul)</span>
          </button>

          <button
            onClick={() => switchDemoRole('shopkeeper')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors font-medium ${
              currentUser?.role === 'shopkeeper'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Act as Shopkeeper (Ramesh Patel - TechnoHub)"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Shopkeeper (Ramesh)</span>
          </button>

          <button
            onClick={() => switchDemoRole('admin')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors font-medium ${
              currentUser?.role === 'admin'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Act as Platform Admin (Priya)"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin (Priya)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset sample data to initial state?')) {
                resetAllDemoData();
              }
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset to default mock data"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
