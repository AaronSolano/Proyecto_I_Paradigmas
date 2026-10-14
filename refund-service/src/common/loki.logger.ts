import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import axios from 'axios';

// Loki exige timestamps en nanosegundos y estrictamente crecientes.
let lastNano = 0n;
function getNextNano(): string {
  let nano = BigInt(Date.now()) * 1000000n;
  if (nano <= lastNano) {
    nano = lastNano + 1n;
  }
  lastNano = nano;
  return nano.toString();
}

// Escribe en consola y, si hay LOKI_URL, reenvía la misma línea a Loki.
@Injectable({ scope: Scope.TRANSIENT })
export class LokiLogger extends ConsoleLogger {
  private readonly lokiUrl: string | undefined;
  private readonly appName: string;
  private readonly envName: string;

  constructor(context = 'App', appName = 'refund-service') {
    super(context);
    this.lokiUrl = process.env.LOKI_URL?.trim();
    this.appName = appName;
    this.envName = process.env.NODE_ENV || 'dev';
  }

  override log(message: any, ...optionalParams: any[]): void {
    super.log(message, ...optionalParams);
    this.pushToLoki('info', message, optionalParams);
  }

  override error(message: any, ...optionalParams: any[]): void {
    super.error(message, ...optionalParams);
    this.pushToLoki('error', message, optionalParams);
  }

  override warn(message: any, ...optionalParams: any[]): void {
    super.warn(message, ...optionalParams);
    this.pushToLoki('warn', message, optionalParams);
  }

  override debug(message: any, ...optionalParams: any[]): void {
    super.debug(message, ...optionalParams);
    this.pushToLoki('debug', message, optionalParams);
  }

  // Envío aparte del flujo de negocio: si Loki no responde, el reembolso sigue.
  private pushToLoki(level: string, message: any, optionalParams: any[]): void {
    if (!this.lokiUrl) {
      return;
    }

    const text =
      typeof message === 'object' ? JSON.stringify(message) : String(message);
    const context =
      optionalParams.find((p) => typeof p === 'string') ||
      this.context ||
      'App';
    const nanoTimestamp = getNextNano();

    const payload = {
      streams: [
        {
          stream: {
            app: this.appName,
            env: this.envName,
            level,
            context,
          },
          values: [[nanoTimestamp, `[${level.toUpperCase()}] [${context}] ${text}`]],
        },
      ],
    };

    axios
      .post(`${this.lokiUrl}/loki/api/v1/push`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 2500,
      })
      .catch(() => {
        // Fallback silencioso: no interrumpe el flujo si Loki tarda en responder
      });
  }
}
