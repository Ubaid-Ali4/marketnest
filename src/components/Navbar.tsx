import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Heart,
  Store,
  Menu,
  X,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenLocationModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenLocationModal,
  onOpenAuthModal,
}) => {
  const { selectedLocation, searchRadiusKm, favourites, currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const favCount = favourites.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
          >
            {/* Custom Brand Icon: Pin + Basket + Nest hybrid */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                {/* Location Pin Head */}
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                {/* Shopping basket cradle inside */}
                <circle cx="12" cy="9" r="2.5" fill="white" stroke="none" />
                <path d="M9 13.5h6l-1 3.5h-4z" fill="white" stroke="none" opacity="0.8" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Market<span className="text-blue-600">Nest</span>
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  India
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Find Anything. Right Near You.
              </p>
            </div>
          </div>

          {/* Location Selector Pill */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium transition-all max-w-[210px] sm:max-w-xs truncate"
            title="Change shopping area and radius"
          >
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="truncate text-left leading-tight">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                Near ({searchRadiusKm} km)
              </span>
              <span className="font-bold truncate text-slate-800">{selectedLocation.name.split(',')[0]}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-blue-600 transition-colors ${
                currentView === 'home' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('categories')}
              className={`hover:text-blue-600 transition-colors ${
                currentView === 'categories' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => onNavigate('explore-shops')}
              className={`hover:text-blue-600 transition-colors ${
                currentView === 'explore-shops' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Explore Shops
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className={`hover:text-blue-600 transition-colors ${
                currentView === 'how-it-works' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              How It Works
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Favourites */}
            <button
              onClick={() => onNavigate('favourites')}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Saved Items & Shops"
            >
              <Heart className="w-5 h-5" />
              {favCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </button>

            {/* List Your Shop CTA */}
            <button
              onClick={() => onNavigate('shopkeeper-register')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>List Your Shop</span>
            </button>

            {/* User Account / Role dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-800"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] uppercase">
                        Role: {currentUser.role}
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigate('customer-dashboard')}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Customer Dashboard</span>
                    </button>

                    <button
                      onClick={() => onNavigate('shopkeeper-dashboard')}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Store className="w-4 h-4 text-indigo-500" />
                      <span>Shopkeeper Dashboard</span>
                    </button>

                    <button
                      onClick={() => onNavigate('admin-dashboard')}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Admin Dashboard</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('favourites')}
              className="relative p-2 rounded-lg text-slate-600"
            >
              <Heart className="w-5 h-5" />
              {favCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-2 font-medium text-sm text-slate-700">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('categories');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Categories
            </button>
            <button
              onClick={() => {
                onNavigate('explore-shops');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Explore Nearby Shops
            </button>
            <button
              onClick={() => {
                onNavigate('how-it-works');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                onNavigate('shopkeeper-register');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg bg-amber-50 text-amber-900 font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              List Your Shop
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('customer-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700"
                >
                  Customer Dashboard ({currentUser.name})
                </button>
                <button
                  onClick={() => {
                    onNavigate('shopkeeper-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-xs font-semibold text-indigo-700"
                >
                  Shopkeeper Dashboard
                </button>
                <button
                  onClick={() => {
                    onNavigate('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-xs font-semibold text-emerald-700"
                >
                  Admin Console
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-3 rounded-lg text-rose-600 text-xs font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onOpenAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
