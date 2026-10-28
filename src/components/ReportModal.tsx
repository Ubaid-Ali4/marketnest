import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Report } from '../types';
import { AlertTriangle, X, Send, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
  productId?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  shopId,
  productId,
}) => {
  const { getShop, getProduct, submitReport } = useApp();
  const shop = getShop(shopId);
  const product = productId ? getProduct(productId) : undefined;

  const [issueType, setIssueType] = useState<Report['issueType']>('incorrect_price');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !shop) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(shopId, productId, issueType, description);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Report Inaccuracy</h2>
              <p className="text-xs text-slate-500">Help keep local community information accurate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900">Report Received</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Thank you for keeping MarketNest trustworthy. Our moderation team will review this listing within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
              <div className="font-semibold text-slate-800">Shop: {shop.name}</div>
              {product && <div className="text-slate-500 mt-0.5">Product: {product.name}</div>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Issue Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as Report['issueType'])}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="incorrect_price">Incorrect Price at Store</option>
                <option value="inaccurate_availability">Item was Out of Stock / Unlisted</option>
                <option value="shop_closed">Shop Permanently Closed / Wrong Hours</option>
                <option value="counterfeit">Damaged or Suspicious Goods</option>
                <option value="other">Other Concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Explain what happened
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Visited the shop today, they charged ₹1,200 instead of ₹1,099 listed here."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
