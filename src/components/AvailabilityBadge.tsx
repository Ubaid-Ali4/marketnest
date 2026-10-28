import React from 'react';
import { AvailabilityStatus } from '../types';
import { CheckCircle2, AlertCircle, Clock, XCircle, HelpCircle } from 'lucide-react';
import { formatStockAge } from '../utils/geo';

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  lastUpdatedAt?: string;
  isOutdated?: boolean;
  compact?: boolean;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  status,
  lastUpdatedAt,
  isOutdated,
  compact = false,
}) => {
  // If flagged as outdated due to freshness rule
  if (isOutdated || status === 'outdated') {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Stock Info Outdated</span>
        {lastUpdatedAt && !compact && (
          <span className="text-amber-500 text-[10px]">({formatStockAge(lastUpdatedAt)})</span>
        )}
      </span>
    );
  }

  switch (status) {
    case 'in_stock_confirmed':
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>In Stock — Confirmed</span>
          {lastUpdatedAt && !compact && (
            <span className="text-emerald-600/80 text-[10px] font-normal">({formatStockAge(lastUpdatedAt)})</span>
          )}
        </span>
      );

    case 'low_stock_confirmed':
      return (
        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Low Stock — Confirmed</span>
          {lastUpdatedAt && !compact && (
            <span className="text-amber-600 text-[10px]">({formatStockAge(lastUpdatedAt)})</span>
          )}
        </span>
      );

    case 'out_of_stock':
      return (
        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>Out of Stock</span>
        </span>
      );

    case 'unconfirmed':
    default:
      return (
        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Availability Unconfirmed</span>
        </span>
      );
  }
};
