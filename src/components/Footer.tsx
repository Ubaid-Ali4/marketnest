import React from 'react';
import { ShieldCheck, HeartHandshake, AlertCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Medicine & Healthcare Safety Notice Banner */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-slate-300">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-slate-300">
              <strong className="text-white">Healthcare & Medicine Discovery Advisory:</strong> MarketNest facilitates discovery of OTC products from verified licensed pharmacies. We never substitute medicines or prescribe drugs. For life-threatening medical emergencies, please dial <strong className="text-amber-400">112 (National Emergency)</strong> or <strong className="text-amber-400">108 (Ambulance)</strong> immediately.
            </p>
          </div>
          <button
            onClick={() => onNavigate('terms')}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold underline whitespace-nowrap"
          >
            Safety Guidelines
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="text-lg font-bold text-white tracking-tight">MarketNest</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              &quot;Find Anything. Right Near You.&quot; — MarketNest connects neighborhood shoppers across India with physical retail stores, enabling instant local product discovery, price transparency, and stock verification.
            </p>
            <div className="flex items-center gap-4 text-slate-300 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Verified Local Shops
              </span>
              <span className="inline-flex items-center gap-1 text-[11px]">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                Supporting Offline Retail
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-white transition-colors">
                  All Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore-shops')} className="hover:text-white transition-colors">
                  Explore Nearby Shops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">
                  How MarketNest Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('favourites')} className="hover:text-white transition-colors">
                  Saved Favourites
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: For Retailers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Shopkeepers</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('shopkeeper-register')} className="text-amber-400 hover:text-amber-300 font-semibold">
                  List Your Shop Free
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shopkeeper-dashboard')} className="hover:text-white transition-colors">
                  Shopkeeper Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">
                  Inventory Freshness Rules
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-white transition-colors">
                  Admin Verification Queue
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Trust & Legal</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy (DPDP Act)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} MarketNest Technologies India. Built for hyperlocal commerce.
          </div>
          <div className="flex items-center gap-4">
            <span>Prices in INR (₹)</span>
            <span>•</span>
            <span className="text-amber-400/90 font-medium">Demonstration Platform Version 1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
