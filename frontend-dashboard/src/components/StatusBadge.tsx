import React from 'react';
import { RefundStatus } from '@/types/refund';

interface StatusBadgeProps {
  status: RefundStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'REFUND_PENDING':
      return (
        <span
          data-testid="status-badge-pending"
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300 shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>REFUND_PENDING</span>
        </span>
      );

    case 'REFUND_PROCESSING':
      return (
        <span
          data-testid="status-badge-processing"
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/40 bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300 shadow-sm"
        >
          <svg
            className="h-3 w-3 animate-spin text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>REFUND_PROCESSING</span>
        </span>
      );

    case 'REFUNDED':
      return (
        <span
          data-testid="status-badge-refunded"
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300 shadow-sm"
        >
          <svg
            className="h-3 w-3 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>REFUNDED</span>
        </span>
      );

    case 'REFUND_FAILED':
      return (
        <span
          data-testid="status-badge-failed"
          className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-300 shadow-sm"
        >
          <svg
            className="h-3 w-3 text-rose-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>REFUND_FAILED</span>
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
          {status}
        </span>
      );
  }
};
