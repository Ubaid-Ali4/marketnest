/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';
import { EnquiryModal } from './components/EnquiryModal';
import { ReportModal } from './components/ReportModal';
import { MobileQuickBar } from './components/MobileQuickBar';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ShopDetailsPage } from './pages/ShopDetailsPage';
import { NearbyShopsPage } from './pages/NearbyShopsPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { ShopkeeperRegisterPage } from './pages/ShopkeeperRegisterPage';
import { ShopkeeperDashboard } from './pages/ShopkeeperDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import {
  CategoriesPage,
  HowItWorksPage,
  AboutUsPage,
  ContactUsPage,
  PrivacyPolicyPage,
  TermsPage,
  NotFoundPage,
} from './pages/StaticPages';

const MainContent: React.FC = () => {
  const { setSearchQuery } = useApp();

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [searchParamQuery, setSearchParamQuery] = useState<string>('');
  const [searchParamCategory, setSearchParamCategory] = useState<string | undefined>(undefined);

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [enquiryModalTarget, setEnquiryModalTarget] = useState<{ shopId: string; productId: string } | null>(null);
  const [reportModalTarget, setReportModalTarget] = useState<{ shopId: string; productId?: string } | null>(null);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProductId, selectedShopId]);

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'search') {
      setSearchParamQuery(param || '');
      setSearchParamCategory(undefined);
      setCurrentView('search');
    } else if (view === 'category') {
      setSearchParamQuery('');
      setSearchParamCategory(param);
      setCurrentView('search');
    } else if (view === 'product-details' && param) {
      setSelectedProductId(param);
      setCurrentView('product-details');
    } else if (view === 'shop-details' && param) {
      setSelectedShopId(param);
      setCurrentView('shop-details');
    } else {
      setCurrentView(view);
    }
  };

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-details');
  };

  const handleViewShop = (shopId: string) => {
    setSelectedShopId(shopId);
    setCurrentView('shop-details');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased pb-16 md:pb-0">
      {/* 1. Transparent Demo Mode Banner with Quick Role Switcher */}
      <DemoBanner />

      {/* 2. Brand Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* 3. Main Views Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onViewProduct={handleViewProduct}
            onViewShop={handleViewShop}
          />
        )}

        {currentView === 'search' && (
          <SearchPage
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
            onViewShop={handleViewShop}
            initialQuery={searchParamQuery}
            initialCategory={searchParamCategory}
          />
        )}

        {currentView === 'product-details' && selectedProductId && (
          <ProductDetailsPage
            productId={selectedProductId}
            onNavigate={handleNavigate}
            onViewShop={handleViewShop}
            onOpenEnquiry={(shopId, productId) => setEnquiryModalTarget({ shopId, productId })}
            onOpenReport={(shopId, productId) => setReportModalTarget({ shopId, productId })}
          />
        )}

        {currentView === 'shop-details' && selectedShopId && (
          <ShopDetailsPage
            shopId={selectedShopId}
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
            onOpenReport={(shopId) => setReportModalTarget({ shopId })}
          />
        )}

        {currentView === 'explore-shops' && (
          <NearbyShopsPage
            onNavigate={handleNavigate}
            onViewShop={handleViewShop}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
          />
        )}

        {(currentView === 'customer-dashboard' || currentView === 'favourites') && (
          <CustomerDashboard
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
            onViewShop={handleViewShop}
          />
        )}

        {currentView === 'shopkeeper-register' && (
          <ShopkeeperRegisterPage onNavigate={handleNavigate} />
        )}

        {currentView === 'shopkeeper-dashboard' && (
          <ShopkeeperDashboard
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            onNavigate={handleNavigate}
            onViewShop={handleViewShop}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesPage
            onSelectCategory={(categoryId) => handleNavigate('category', categoryId)}
            onViewProduct={handleViewProduct}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksPage onNavigate={handleNavigate} />
        )}

        {currentView === 'about' && <AboutUsPage />}

        {currentView === 'contact' && <ContactUsPage />}

        {currentView === 'privacy' && <PrivacyPolicyPage />}

        {currentView === 'terms' && <TermsPage />}

        {currentView === 'not-found' && (
          <NotFoundPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* 4. Footer with healthcare notice & navigation links */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {enquiryModalTarget && (
        <EnquiryModal
          isOpen={Boolean(enquiryModalTarget)}
          onClose={() => setEnquiryModalTarget(null)}
          shopId={enquiryModalTarget.shopId}
          productId={enquiryModalTarget.productId}
        />
      )}

      {reportModalTarget && (
        <ReportModal
          isOpen={Boolean(reportModalTarget)}
          onClose={() => setReportModalTarget(null)}
          shopId={reportModalTarget.shopId}
          productId={reportModalTarget.productId}
        />
      )}

      {/* Floating Mobile Quick Actions Bar */}
      <MobileQuickBar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
