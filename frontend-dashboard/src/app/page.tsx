'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { RefundForm } from '@/components/RefundForm';
import { RefundTable } from '@/components/RefundTable';
import { fetchRefunds, createRefund } from '@/lib/api';
import {
  RefundTransaction,
  RefundMetrics,
  CreateRefundPayload,
} from '@/types/refund';

const POLLING_INTERVAL_MS = 2500; // 2.5 segundos según especificación

export default function DashboardPage() {
  const [refunds, setRefunds] = useState<RefundTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Consulta al backend GET /api/refunds
  const loadRefunds = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    }
    try {
      const data = await fetchRefunds();
      setRefunds(data);
      setLastUpdated(new Date());
      setErrorMessage(null);
    } catch (err: any) {
      // Registrar error solo si es significativo
      console.error('Error fetching refunds:', err);
      setErrorMessage(
        err.message || 'No se pudo conectar con el servicio de reembolsos (puerto 4000)',
      );
    } finally {
      setIsLoading(false);
      if (isManual) {
        setIsRefreshing(false);
      }
    }
  }, []);

  // Polling periódico cada 2.5 segundos con setInterval
  useEffect(() => {
    // Carga inicial
    loadRefunds();

    // Timer de polling automático (2.5s)
    const intervalId = setInterval(() => {
      loadRefunds();
    }, POLLING_INTERVAL_MS);

    // Limpieza estricta de intervalo al desmontar el componente
    return () => {
      clearInterval(intervalId);
    };
  }, [loadRefunds]);

  // Manejo de emisión de nuevo reembolso POST /api/refunds
  const handleCreateRefund = async (payload: CreateRefundPayload): Promise<RefundTransaction> => {
    setIsSubmitting(true);
    try {
      const created = await createRefund(payload);
      // Actualizar inmediatamente la lista con el registro devuelto
      setRefunds((prev) => [created, ...prev.filter((r) => r.id !== created.id)]);
      setLastUpdated(new Date());
      // Disparar sincronización inmediata
      loadRefunds();
      return created;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cálculo de métricas agregadas
  const metrics = useMemo<RefundMetrics>(() => {
    const total = refunds.length;
    const pending = refunds.filter((r) => r.status === 'REFUND_PENDING').length;
    const processing = refunds.filter((r) => r.status === 'REFUND_PROCESSING').length;
    const refunded = refunds.filter((r) => r.status === 'REFUNDED').length;
    const failed = refunds.filter((r) => r.status === 'REFUND_FAILED').length;
    const totalAmount = refunds.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const completedTotal = refunded + failed;
    const successRate =
      completedTotal > 0 ? Math.round((refunded / completedTotal) * 100) : 0;

    return {
      total,
      pending,
      processing,
      refunded,
      failed,
      totalAmount,
      successRate,
    };
  }, [refunds]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Encabezado y Métricas */}
      <DashboardHeader
        metrics={metrics}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onManualRefresh={() => loadRefunds(true)}
      />

      {/* Banner de error de conexión en caso de que backend esté apagado */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-start justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 text-rose-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <span className="font-bold">Aviso de Conexión:</span>{' '}
              <span>{errorMessage}</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Asegúrate de que <code className="text-rose-200">refund-service</code> esté en ejecución en el puerto 4000. Reintentando automáticamente en el próximo ciclo...
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => loadRefunds(true)}
            className="rounded bg-rose-500/20 px-2 py-1 text-[11px] font-semibold text-rose-200 hover:bg-rose-500/30 transition flex-shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Formulario de Emisión */}
      <RefundForm
        onSubmitRefund={handleCreateRefund}
        isSubmitting={isSubmitting}
      />

      {/* Card Educativo / Resumen del Flujo Asíncrono */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur text-xs">
        <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-3">
          <svg
            className="h-4 w-4 text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Flujo de Estados y Paradigma Asíncrono en Tiempo Real
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-slate-400">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-2 font-semibold text-amber-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px]">1</span>
              REFUND_PENDING
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed">
              La orden se almacena en PostgreSQL y se responde HTTP 201 de inmediato sin bloquear.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-2 font-semibold text-blue-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-[10px]">2</span>
              REFUND_PROCESSING
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed">
              El Cron Job (cada 10s) reclama el lote atómicamente y despacha a la pasarela externa.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-2 font-semibold text-emerald-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px]">3</span>
              REFUNDED
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed">
              El proveedor notifica <code className="text-emerald-400">SUCCESS</code> vía Webhook. Transición final exitosa con ID de proveedor.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center gap-2 font-semibold text-rose-300">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-[10px]">4</span>
              REINTENTOS / FAILED
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed">
              Si falla, regresa a <code className="text-amber-400">PENDING</code> hasta 3 intentos. Al 3er fallo pasa a <code className="text-rose-400">REFUND_FAILED</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de Reembolsos */}
      <RefundTable refunds={refunds} isLoading={isLoading} />
    </main>
  );
}
