import { CreateRefundPayload, RefundTransaction } from '@/types/refund';

// Base de la API. En el navegador apunta a localhost:4000, no al nombre Docker.
const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!envUrl) {
    return 'http://localhost:4000/api';
  }
  // Si ya termina en /api, no duplicarlo
  return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
};

// Consulta del polling del dashboard.
export async function fetchRefunds(): Promise<RefundTransaction[]> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/refunds`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `Error al consultar reembolsos (HTTP ${response.status}): ${errorText || response.statusText}`,
    );
  }

  const data = await response.json();
  return data;
}

// Alta de un reembolso. El estado inicial lo define el backend.
export async function createRefund(
  payload: CreateRefundPayload,
): Promise<RefundTransaction> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/refunds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.message) {
        errorMessage = Array.isArray(errJson.message)
          ? errJson.message.join(', ')
          : errJson.message;
      }
    } catch {
      const text = await response.text().catch(() => '');
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
