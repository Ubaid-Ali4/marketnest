import React, { useState } from 'react';
import { CATEGORIES } from '../data/categories';
import {
  ShieldCheck,
  Store,
  MapPin,
  Clock,
  Phone,
  Mail,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Search,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

// 1. Categories Overview Page with Interactive Tabbed Product Explorer
export const CategoriesPage: React.FC<{
  onSelectCategory: (categoryId: string) => void;
  onViewProduct?: (productId: string) => void;
}> = ({ onSelectCategory, onViewProduct }) => {
  const { performSearch, selectedLocation } = useApp();
  const [activeCatId, setActiveCatId] = useState<string>(CATEGORIES[0].id);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCatId) || CATEGORIES[0];

  // Fetch products in the selected category
  const categoryProducts = performSearch('', {
    categoryId: activeCatId,
    maxDistanceKm: 25,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Hyperlocal Product Catalogue
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Browse Products by Category
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Select or tab through any category below to immediately see verified products available at nearby neighborhood shops.
        </p>
      </div>

      {/* Interactive Category Tabs (Horizontal scrollable pill navigation) */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          {CATEGORIES.map((cat) => {
            const isActive = activeCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCatId(cat.id)}
                className={`py-2.5 px-4 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                    isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Product Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {activeCategory.name}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              {activeCategory.description}
            </p>
          </div>

          <button
            onClick={() => onSelectCategory(activeCategory.id)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Open in Full Search & Filters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Product Cards for Active Category */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categoryProducts.map((item) => (
              <ProductCard
                key={`${item.product.id}-${item.shop.id}`}
                item={item}
                onViewDetails={onViewProduct || ((id) => onSelectCategory(activeCategory.id))}
              />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-semibold text-slate-700">No active stock listed in this category right now.</p>
            <p className="text-xs text-slate-500">Check nearby shops or expand your search distance.</p>
          </div>
        )}
      </div>

      {/* Grid of all 14 Category Cards for quick switching */}
      <div className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-slate-900">All 14 Store Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES.map((cat) => {
            const isCurrent = activeCatId === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setActiveCatId(cat.id);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-center ${
                  isCurrent
                    ? 'bg-blue-50/80 border-blue-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  <h4 className={`text-xs font-bold line-clamp-2 leading-tight ${isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                    {cat.name}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-medium">
                  {cat.itemCount} items
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 2. How It Works Page
export const HowItWorksPage: React.FC<{
  onNavigate: (view: string) => void;
}> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          How MarketNest Operates
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Bridging Online Search with Offline Local Shops
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          MarketNest is not another remote ecommerce warehouse. We empower physical neighborhood merchants and help customers get products immediately without waiting for courier delivery.
        </p>
      </div>

      {/* For Shoppers */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          For Shoppers & Consumers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Real-time Local Proximity</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select your locality or use GPS. See true distances calculated via the Haversine formula from verified neighborhood stores.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Transparent Price Comparison</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare prices across multiple local shops for the exact same gadget, medicine strip, spare part, or plumbing fitting.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">One-Click WhatsApp & Call</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify counter availability before you drive or walk. Pre-filled WhatsApp inquiries allow instant counter reservation.
            </p>
          </div>
        </div>
      </div>

      {/* Stock Freshness Rules */}
      <div className="bg-blue-50/60 p-8 rounded-3xl border border-blue-200/80 space-y-4">
        <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-700" />
          Our Strict 48-Hour Freshness Guarantee
        </h2>
        <p className="text-xs sm:text-sm text-blue-900/80 leading-relaxed max-w-3xl">
          Unlike ordinary directories with stale phone numbers and 5-year-old listings, MarketNest tracks the exact hour when a shopkeeper confirmed their stock. Any listing unconfirmed for over 48 hours is automatically flagged with an amber <strong>&quot;Stock Info Outdated&quot;</strong> badge, alerting customers to call first.
        </p>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('shopkeeper-register')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          Are You a Retailer? List Your Store Free &rarr;
        </button>
      </div>
    </div>
  );
};

// 3. About Us Page
export const AboutUsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">About MarketNest</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Empowering Indian Neighborhood Retail
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Millions of local shops in India stock high quality products at competitive prices, but customers don&apos;t know what is available across the street. MarketNest solves that disconnect.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <Store className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base">Supporting Local Shopkeepers</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Neighborhood retail is the backbone of Indian communities. We provide free discovery tools so local mom-and-pop stores can compete effectively against giant online marketplaces.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <Clock className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">Zero-Wait Urgency</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            When your laptop charger dies before a meeting, or your fever spikes at night, waiting 2 days for an online delivery package is not an option. MarketNest guides you to nearby stores within 15 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

// 4. Contact Us Page
export const ContactUsPage: React.FC = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Support & Inquiries</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact MarketNest</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have questions about store onboarding, product verification, or reporting a listing? Reach our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Send Us a Message</h3>
          {sent ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
              Thank you! Your inquiry has been dispatched to MarketNest Support (Ticket #MN-8842).
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Rao"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="ananya@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inquiring about merchant onboarding"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can our community operations team assist you?"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Support Offices */}
        <div className="space-y-5 text-xs text-slate-600">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Bengaluru Operations Hub
            </h4>
            <p>MarketNest Technologies India Pvt. Ltd.</p>
            <p>#42, 100ft Road, Indiranagar, Bengaluru, Karnataka - 560038</p>
            <p className="text-slate-500">Phone: +91 80 4900 1200</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              Direct Support Channels
            </h4>
            <p>Customer Support: support@marketnest.demo</p>
            <p>Shopkeeper Onboarding: merchants@marketnest.demo</p>
            <p>Hours: Monday to Saturday, 9:00 AM - 7:00 PM IST</p>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 space-y-1">
            <strong className="block text-amber-950">Medical Emergencies Advisory:</strong>
            <p>
              MarketNest is a product discovery utility and does not provide emergency medical services. In critical emergencies, please dial <strong>112 (National Emergency)</strong> or <strong>108 (Ambulance)</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Privacy Policy Page (India DPDP Act)
export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs text-slate-700 leading-relaxed">
      <div className="space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Legal Compliance</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy (DPDP Act Compliance)
        </h1>
        <p className="text-slate-500">Last updated: October 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">1. Geolocation Data Handling</h3>
        <p>
          MarketNest requires geolocation data solely to compute great-circle distance (in kilometers) between customer devices and registered offline merchant stores. Geolocation is requested with explicit browser permission. Customer precise GPS coordinates are never publicly broadcast, logged for advertising profiling, or shared with third-party tracking brokers.
        </p>

        <h3 className="text-sm font-bold text-slate-900">2. Customer Contact Protection</h3>
        <p>
          When you click &quot;WhatsApp Shop&quot;, conversation initiation occurs directly between your personal WhatsApp client and the shopkeeper&apos;s published commercial telephone number. MarketNest does not intercept private chat content.
        </p>

        <h3 className="text-sm font-bold text-slate-900">3. Shopkeeper Verification Records</h3>
        <p>
          GST certificates, drug licenses, and trade registration numbers submitted during the &quot;List Your Shop&quot; flow are securely handled by administrative verification staff and never exposed in client search interfaces.
        </p>
      </div>
    </div>
  );
};

// 6. Terms and Conditions Page
export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-xs text-slate-700 leading-relaxed">
      <div className="space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">User Agreement</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms & Conditions of Discovery
        </h1>
        <p className="text-slate-500">Last updated: October 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">1. Nature of the Platform</h3>
        <p>
          MarketNest is an informational hyperlocal discovery platform designed to answer: &quot;Where can I find this product near me?&quot;. MarketNest is not an ecommerce marketplace, seller of record, or payment gateway. Transactions take place physically in offline stores between customers and licensed merchants.
        </p>

        <h3 className="text-sm font-bold text-slate-900">2. Stock Freshness & Verification Disclaimers</h3>
        <p>
          While MarketNest enforces strict 48-hour timestamp freshness audits and allows community reporting, physical counter inventory changes rapidly during peak business hours. Customers are expressly advised to call or WhatsApp stores before making long journeys.
        </p>

        <h3 className="text-sm font-bold text-slate-900">3. Healthcare & Regulated Pharmaceutical Compliance</h3>
        <p>
          Pharmacies listed on MarketNest are independently registered under applicable Indian Drugs and Cosmetics Acts. MarketNest prohibits online dispensing of Schedule H, H1, or X prescription narcotics without physical in-person valid medical doctor prescriptions presented at the licensed retail counter.
        </p>
      </div>
    </div>
  );
};

// 7. Not Found 404 Page
export const NotFoundPage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <div className="text-6xl font-black text-blue-600">404</div>
      <h2 className="text-xl font-bold text-slate-900">Page Not Found</h2>
      <p className="text-xs text-slate-500">
        The page you requested could not be located. You can search products or return home.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
        >
          Back to Home
        </button>
        <button
          onClick={() => onNavigate('search')}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
        >
          Search Nearby Products
        </button>
      </div>
    </div>
  );
};
