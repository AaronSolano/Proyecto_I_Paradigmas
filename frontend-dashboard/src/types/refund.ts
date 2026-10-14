// Estados y formas de datos que el dashboard comparte con la API.
export type RefundStatus =
  | 'REFUND_PENDING'
  | 'REFUND_PROCESSING'
  | 'REFUNDED'
  | 'REFUND_FAILED';

// Fila que devuelve GET /api/refunds.
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

// Cuerpo de POST /api/refunds.
export interface CreateRefundPayload {
  transactionId: string;
  amount: number;
  forceFailure?: boolean;
}

// Conteos que arma la página a partir de la lista.
export interface RefundMetrics {
  total: number;
  pending: number;
  processing: number;
  refunded: number;
  failed: number;
  totalAmount: number;
  successRate: number;
}
