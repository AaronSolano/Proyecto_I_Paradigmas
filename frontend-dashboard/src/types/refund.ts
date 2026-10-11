export type RefundStatus =
  | 'REFUND_PENDING'
  | 'REFUND_PROCESSING'
  | 'REFUNDED'
  | 'REFUND_FAILED';

export interface RefundTransaction {
  id: string;
  transactionId: string;
  amount: number;
  status: RefundStatus;
  attempts: number;
  lastAttempt: string | null;
  providerRefundId: string | null;
  forceFailure?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRefundPayload {
  transactionId: string;
  amount: number;
  forceFailure?: boolean;
}

export interface RefundMetrics {
  total: number;
  pending: number;
  processing: number;
  refunded: number;
  failed: number;
  totalAmount: number;
  successRate: number;
}
