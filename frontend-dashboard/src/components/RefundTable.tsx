import React, { useState, useMemo } from 'react';
import { RefundTransaction, RefundStatus } from '@/types/refund';
import { StatusBadge } from './StatusBadge';

interface RefundTableProps {
  refunds: RefundTransaction[];
  isLoading: boolean;
}

export const RefundTable: React.FC<RefundTableProps> = ({ refunds, isLoading }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredRefunds = useMemo(() => {
    return refunds.filter((item) => {
      const matchesStatus =
        filterStatus === 'ALL' || item.status === filterStatus;
      const matchesSearch =
        !searchQuery.trim() ||
        item.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.providerRefundId &&
          item.providerRefundId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [refunds, filterStatus, searchQuery]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur shadow-lg overflow-hidden">
      {/* Controls Bar: Search & Status Filters */}
      <div className="p-5 border-b border-slate-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg
              className="h-5 w-5 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Historial de Transacciones de Reembolso
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoreo en tiempo real de transiciones de estados y reintentos automáticos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por ID..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/70 p-1 text-xs">
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'REFUND_PENDING', label: 'Pendientes' },
              { id: 'REFUND_PROCESSING', label: 'En Proceso' },
              { id: 'REFUNDED', label: 'Completados' },
              { id: 'REFUND_FAILED', label: 'Fallidos' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  filterStatus === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                ID Transacción
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Monto
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Estado
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Reintentos
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Último Intento
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                ID Proveedor
              </th>
              <th scope="col" className="px-5 py-3.5 font-semibold">
                Fecha Creación
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRefunds.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg
                      className="h-8 w-8 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <span className="font-medium text-slate-300">
                      {refunds.length === 0
                        ? 'No se registran solicitudes de reembolso aún'
                        : 'No hay transacciones que coincidan con los filtros seleccionados'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {refunds.length === 0
                        ? 'Usa el formulario superior para emitir una nueva transacción.'
                        : 'Prueba cambiando los filtros de búsqueda.'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRefunds.map((refund) => (
                <tr
                  key={refund.id}
                  className="hover:bg-slate-800/40 transition duration-150"
                >
                  {/* ID */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-white">
                        {refund.transactionId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(refund.transactionId)}
                        title="Copiar ID de transacción"
                        className="text-slate-500 hover:text-slate-300 transition"
                      >
                        {copiedId === refund.transactionId ? (
                          <svg
                            className="h-3.5 w-3.5 text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                      UUID: {refund.id.slice(0, 8)}...
                    </span>
                  </td>

                  {/* Monto */}
                  <td className="px-5 py-4 whitespace-nowrap font-mono font-semibold text-slate-200">
                    ${Number(refund.amount).toFixed(2)}
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={refund.status} />
                  </td>

                  {/* Reintentos */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-medium ${
                          refund.attempts >= 3
                            ? 'text-rose-400 font-bold'
                            : refund.attempts > 0
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {refund.attempts}/3
                      </span>
                      {/* Visual retry meter dots */}
                      <div className="flex gap-1">
                        {[1, 2, 3].map((step) => (
                          <span
                            key={step}
                            className={`h-1.5 w-2 rounded-full ${
                              refund.attempts >= step
                                ? refund.status === 'REFUND_FAILED'
                                  ? 'bg-rose-500'
                                  : 'bg-amber-400'
                                : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Último Intento */}
                  <td className="px-5 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                    {formatDate(refund.lastAttempt)}
                  </td>

                  {/* ID Proveedor */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    {refund.providerRefundId ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {refund.providerRefundId}
                      </span>
                    ) : refund.status === 'REFUND_FAILED' ? (
                      <span className="text-rose-400/70 font-mono text-[11px] italic">No asignado</span>
                    ) : (
                      <span className="text-slate-500 italic">Pendiente...</span>
                    )}
                  </td>

                  {/* Fecha Creación */}
                  <td className="px-5 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                    {formatDate(refund.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
