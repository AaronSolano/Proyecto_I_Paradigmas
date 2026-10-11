import React from 'react';
import { RefundMetrics } from '@/types/refund';

interface DashboardHeaderProps {
  metrics: RefundMetrics;
  lastUpdated: Date | null;
  isRefreshing: boolean;
  onManualRefresh: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  metrics,
  lastUpdated,
  isRefreshing,
  onManualRefresh,
}) => {
  return (
    <header className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/30">
              Paradigmas de Programación
            </span>
            <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300">
              Proyecto 1 • Sistema Asíncrono Resiliente
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Panel de Reembolsos Distribuidos
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Orquestación desacoplada con Background Jobs (10s), Webhooks asíncronos y reintentos ante fallos.
          </p>
        </div>

        {/* Live Polling Status Indicator */}
        <div className="flex items-center gap-3 self-start md:self-auto rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 backdrop-blur shadow-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">
                Polling en vivo (2.5s)
              </span>
              <span className="text-[11px] text-slate-400">
                {lastUpdated
                  ? `Última sinc: ${lastUpdated.toLocaleTimeString()}`
                  : 'Sincronizando...'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onManualRefresh}
            disabled={isRefreshing}
            title="Refrescar manualmente ahora"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
          >
            <svg
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Transactions */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur shadow-sm hover:border-slate-700 transition">
          <div className="text-xs font-medium text-slate-400">Total Solicitudes</div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            {metrics.total}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            ${metrics.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} en volumen
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 backdrop-blur shadow-sm hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-300">Pendientes</span>
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-400 tracking-tight">
            {metrics.pending}
          </div>
          <div className="mt-1 text-[11px] text-amber-400/70">
            En cola para cron job
          </div>
        </div>

        {/* Processing */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 backdrop-blur shadow-sm hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-300">En Proceso</span>
            <span className="h-2 w-2 rounded-full bg-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-400 tracking-tight">
            {metrics.processing}
          </div>
          <div className="mt-1 text-[11px] text-blue-400/70">
            Despachado a proveedor
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 backdrop-blur shadow-sm hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-300">Completados</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400 tracking-tight">
            {metrics.refunded}
          </div>
          <div className="mt-1 text-[11px] text-emerald-400/70">
            Confirmados por webhook
          </div>
        </div>

        {/* Failed */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 backdrop-blur shadow-sm hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-300">Fallidos</span>
            <span className="h-2 w-2 rounded-full bg-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-400 tracking-tight">
            {metrics.failed}
          </div>
          <div className="mt-1 text-[11px] text-rose-400/70">
            Agotaron 3 reintentos
          </div>
        </div>

        {/* Success Rate */}
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 backdrop-blur shadow-sm hover:border-indigo-500/40 transition">
          <div className="text-xs font-medium text-indigo-300">Tasa de Éxito</div>
          <div className="mt-2 text-2xl font-bold text-indigo-400 tracking-tight">
            {metrics.successRate}%
          </div>
          <div className="mt-1 text-[11px] text-indigo-400/70">
            Sobre finalizados
          </div>
        </div>
      </div>
    </header>
  );
};
