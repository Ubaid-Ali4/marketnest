import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import {
  Store,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  ArrowLeft,
  Upload,
} from 'lucide-react';

interface ShopkeeperRegisterPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const ShopkeeperRegisterPage: React.FC<ShopkeeperRegisterPageProps> = ({ onNavigate }) => {
  const { registerShop, currentUser, selectedLocation } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Form Fields
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState(currentUser?.name || '');
  const [categoryId, setCategoryId] = useState('cat-elec');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98860 12345');
  const [whatsapp, setWhatsapp] = useState('+919886012345');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(selectedLocation.city || 'Bengaluru');
  const [state, setState] = useState(selectedLocation.state || 'Karnataka');
  const [postalCode, setPostalCode] = useState(selectedLocation.postalCode || '560038');
  const [openingHours, setOpeningHours] = useState('9:30 AM - 9:30 PM (Mon-Sat)');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCategoryObj = CATEGORIES.find((c) => c.id === categoryId);

    const newShopId = registerShop({
      ownerId: currentUser?.id || `user-shop-${Date.now()}`,
      name: shopName,
      category: selectedCategoryObj?.name || 'Retail Store',
      categoryId,
      address,
      city,
      state,
      postalCode,
      latitude: selectedLocation.latitude + (Math.random() - 0.5) * 0.01,
      longitude: selectedLocation.longitude + (Math.random() - 0.5) * 0.01,
      phone,
      whatsapp,
      openingHours,
      isOpen: true,
      image: photoUrl,
      licenseNumber: licenseNumber || 'GSTIN29TEST9988A1Z1',
    });

    setSubmittedId(newShopId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Partner With MarketNest
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          List Your Retail Shop Free
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Connect with thousands of nearby shoppers looking for products right now in your neighborhood.
        </p>
      </div>

      {submittedId ? (
        /* Submission Success / Status Banner */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Status: Pending Review
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Registration Received for &quot;{shopName}&quot;
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your shop registration has been placed in the MarketNest Admin Queue. Our verification team verifies GSTIN, address, and license documents to safeguard buyers.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Shop ID:</span>
              <strong className="text-slate-900">{submittedId}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Owner:</span>
              <strong className="text-slate-900">{ownerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <strong className="text-slate-900">{city}, {state}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Moderation Time:</span>
              <span className="text-emerald-700 font-semibold">Under 2 hours (or test in Admin tab)</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('shopkeeper-dashboard')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs"
            >
              Go to Shopkeeper Dashboard
            </button>
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Open Admin Console (Review Queue)
            </button>
          </div>
        </div>
      ) : (
        /* Multi-step Onboarding Form */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Progress bar */}
          <div className="grid grid-cols-3 border-b border-slate-200 text-xs font-bold text-center">
            <div
              className={`py-3.5 px-2 border-r border-slate-200 transition-colors ${
                step === 1 ? 'bg-blue-50 text-blue-700' : 'text-slate-500 bg-white'
              }`}
            >
              1. Business Details
            </div>
            <div
              className={`py-3.5 px-2 border-r border-slate-200 transition-colors ${
                step === 2 ? 'bg-blue-50 text-blue-700' : 'text-slate-500 bg-white'
              }`}
            >
              2. Store Location
            </div>
            <div
              className={`py-3.5 px-2 transition-colors ${
                step === 3 ? 'bg-blue-50 text-blue-700' : 'text-slate-500 bg-white'
              }`}
            >
              3. Verification & Hours
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Step 1: Business Details */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Store / Shop Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balaji Hardware & Electricals"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Business Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Owner / Merchant Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Store Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98860 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      WhatsApp Enquiry Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98860 12345"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!shopName || !ownerName) {
                        alert('Please enter your shop and owner name');
                        return;
                      }
                      setStep(2);
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>Next: Store Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Store Location */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Complete Shop Street Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Shop #12, Ground Floor, 100ft Road, Near Metro Pillar 42"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2 text-xs text-blue-900">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Map Coordinates will automatically calibrate around <strong>{city}</strong> for distance calculations.
                  </span>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!address) {
                        alert('Please fill your shop address');
                        return;
                      }
                      setStep(3);
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Next: Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Verification & Hours */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Operating Hours *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM - 9:30 PM (Mon-Sat)"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    GSTIN or Trade / Drug License Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 29ABCDE1234F1Z5 or DL-KA-BLR-12345"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Mandatory for verified badge and regulated pharmacy listings. Never made public.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Storefront Photo Image URL
                  </label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    By registering, you confirm that listed products and prices will accurately reflect physical counter inventory and comply with local retail consumer protection laws.
                  </span>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Shop for Verification</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
