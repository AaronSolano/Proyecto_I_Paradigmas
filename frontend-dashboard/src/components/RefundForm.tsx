import React, { useState } from 'react';
import { CreateRefundPayload, RefundTransaction } from '@/types/refund';

interface RefundFormProps {
  onSubmitRefund: (payload: CreateRefundPayload) => Promise<RefundTransaction>;
  isSubmitting: boolean;
}

// Formulario de alta. forceFailure hace que el proveedor falle los 3 intentos.
export const RefundForm: React.FC<RefundFormProps> = ({
  onSubmitRefund,
  isSubmitting,
}) => {
  // Generador de ID aleatorio legible
  const generateRandomId = (isFail = false) => {
    const prefix = isFail ? 'TRX-FAIL' : 'TRX';
    const randNum = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${randNum}`;
  };

  const generateRandomAmount = () => {
    // Genera un monto entre 10.00 y 500.00 con 2 decimales
    return Number((Math.random() * 490 + 10).toFixed(2));
  };

  const [transactionId, setTransactionId] = useState<string>(() => generateRandomId(false));
  const [amount, setAmount] = useState<string>('75.50');
  const [forceFailure, setForceFailure] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Rellena otro id de demostración, con prefijo TRX-FAIL si el fallo está activo.
  const handleGenerateRandomId = () => {
    setTransactionId(generateRandomId(forceFailure));
    setFeedback(null);
  };

  const handleToggleFailure = (checked: boolean) => {
    setForceFailure(checked);
    // Si el usuario cambia el toggle y el transactionId es el generado por defecto, actualizar prefijo
    if (transactionId.startsWith('TRX-')) {
      setTransactionId(generateRandomId(checked));
    }
    setFeedback(null);
  };

  // Valida monto e id y envía la orden al dashboard.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const parsedAmount = parseFloat(amount);
    if (!transactionId.trim()) {
      setFeedback({ type: 'error', message: 'El ID de transacción es requerido.' });
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFeedback({ type: 'error', message: 'El monto debe ser un número positivo mayor a 0.' });
      return;
    }

    try {
      const result = await onSubmitRefund({
        transactionId: transactionId.trim(),
        amount: parsedAmount,
        forceFailure,
      });

      setFeedback({
        type: 'success',
        message: `✓ Reembolso registrado con éxito (${result.transactionId}) por $${Number(result.amount).toFixed(2)}. Estado inicial: REFUND_PENDING`,
      });

      // Preparar automáticamente siguiente transacción con ID fresco
      setTimeout(() => {
        setTransactionId(generateRandomId(forceFailure));
        setAmount((prev) => (Math.random() > 0.5 ? generateRandomAmount().toString() : prev));
      }, 1200);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error al emitir el reembolso al backend',
      });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Emitir Nueva Orden de Reembolso
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingresa los parámetros de la transacción o usa las herramientas de generación rápida.
          </p>
        </div>
        <span className="hidden sm:inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
          POST /api/refunds
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Transaction ID */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="transactionId"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                ID de Transacción <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateRandomId}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
              >
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Generar Aleatorio
              </button>
            </div>
            <div className="relative">
              <input
                id="transactionId"
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="ej. TRX-849201"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="amount"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Monto a Reembolsar (USD) <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[25, 50, 100, 250].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toFixed(2))}
                    className="rounded bg-slate-800 px-1.5 py-0.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-medium">
                $
              </div>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-8 pr-4 py-2.5 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Failure Simulation Toggle */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 transition hover:border-slate-700">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="flex h-5 items-center">
              <input
                type="checkbox"
                checked={forceFailure}
                onChange={(e) => handleToggleFailure(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-950"
              />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 text-rose-400"
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
                Simular fallo forzado del proveedor externo (`forceFailure`)
              </span>
              <p className="text-slate-400 mt-1">
                Al activar esta opción, la pasarela de pagos externa responderá con error (`FAILURE`).
                Permite observar en tiempo real la política de reintentos acumulativos (1/3, 2/3, 3/3)
                hasta la transición terminal a <code className="text-rose-300 font-mono">REFUND_FAILED</code>.
              </p>
            </div>
          </label>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`rounded-xl border p-3.5 text-xs font-medium flex items-center gap-2.5 ${
              feedback.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <svg
                className="h-4 w-4 flex-shrink-0 text-emerald-400"
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
                className="h-4 w-4 flex-shrink-0 text-rose-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-white"
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
                <span>Registrando Reembolso...</span>
              </>
            ) : (
              <>
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Emitir Reembolso</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
