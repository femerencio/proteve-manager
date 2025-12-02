import { ProteveMQTTData, SystemEvent } from '../types';

/**
 * Simulador de dados MQTT do firmware PROTEVE ESP32
 * Imita o comportamento real do dispositivo com RMS, falhas e lockout
 */

const VOLTAGE_LIMITS = {
  MIN: 190.0, // Subtensão
  MAX: 247.0, // Sobretensão
  NOMINAL: 220.0,
};

const FAILURE_THRESHOLD = 3;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const REARME_DELAY_MS = 30 * 1000; // 30 segundos

export class MQTTSimulator {
  private voltage: number = 220.0;
  private current: number = 12.0;
  private failureCount: number = 0;
  private isLockedOut: boolean = false;
  private lastFailureTime: number = 0;
  private lastRearmeTime: number = 0;
  private relayK1Status: boolean = true; // true = Armada, false = Desarmada
  private events: SystemEvent[] = [];
  private eventIdCounter: number = 0;

  constructor() {
    this.initializeEvents();
  }

  private initializeEvents(): void {
    // Adiciona alguns eventos iniciais para simular histórico
    const now = new Date();
    this.events = [
      {
        id: 'evt-0',
        timestamp: new Date(now.getTime() - 3600000),
        eventType: 'NORMAL',
        action: 'Sistema operacional',
      },
    ];
  }

  private addEvent(
    eventType: SystemEvent['eventType'],
    action: string,
    voltage?: number,
    duration?: number
  ): void {
    this.eventIdCounter++;
    this.events.push({
      id: `evt-${this.eventIdCounter}`,
      timestamp: new Date(),
      eventType,
      voltage,
      duration,
      action,
    });

    // Manter apenas os últimos 50 eventos
    if (this.events.length > 50) {
      this.events = this.events.slice(-50);
    }
  }

  /**
   * Simula uma oscilação de tensão com possibilidade de falha
   */
  private simulateVoltageFluctuation(): void {
    const random = Math.random();

    if (random < 0.05) {
      // 5% de chance de subtensão
      this.voltage = VOLTAGE_LIMITS.MIN - Math.random() * 5;
    } else if (random < 0.08) {
      // 3% de chance de sobretensão
      this.voltage = VOLTAGE_LIMITS.MAX + Math.random() * 5;
    } else if (random < 0.15) {
      // 7% de chance de oscilação próxima aos limites
      this.voltage = VOLTAGE_LIMITS.NOMINAL + (Math.random() - 0.5) * 30;
    } else {
      // 85% de operação normal com pequenas flutuações
      this.voltage = VOLTAGE_LIMITS.NOMINAL + (Math.random() - 0.5) * 4;
    }

    // Simular corrente com variação normal
    this.current = 12.0 + (Math.random() - 0.5) * 3;
  }

  /**
   * Atualiza o estado do sistema baseado na lógica de proteção PROTEVE
   */
  private updateSystemState(): void {
    const now = Date.now();

    // 1. Verificar se saiu do lockout (após 15 minutos sem falhas)
    if (
      this.isLockedOut &&
      now - this.lastFailureTime > LOCKOUT_WINDOW_MS
    ) {
      this.isLockedOut = false;
      this.failureCount = 0;
      this.lastFailureTime = 0;
      this.addEvent('RESET_REMOTO', 'Lockout expirado após 15 minutos');
    }

    // 2. Lógica de proteção
    if (this.isLockedOut) {
      // Sistema em lockout: K1 permanece desarmada
      this.relayK1Status = false;
    } else if (
      this.voltage < VOLTAGE_LIMITS.MIN ||
      this.voltage > VOLTAGE_LIMITS.MAX
    ) {
      // Falha detectada: Desarma K1
      if (this.relayK1Status === true) {
        // Se estava armada, registra a falha
        this.failureCount++;
        this.lastFailureTime = now;
        this.lastRearmeTime = 0;

        if (this.failureCount >= FAILURE_THRESHOLD) {
          this.isLockedOut = true;
          this.addEvent(
            'LOCKOUT_ATINGIDO',
            `Lockout atingido após ${this.failureCount} falhas`,
            this.voltage
          );
        } else {
          const eventType =
            this.voltage < VOLTAGE_LIMITS.MIN ? 'SUBTENSAO' : 'SOBRETENSAO';
          this.addEvent(eventType, `Falha detectada: ${this.voltage.toFixed(1)}V`, this.voltage);
        }
      }

      this.relayK1Status = false;
    } else {
      // Rede estável: Tenta armar K1 após delay
      if (this.relayK1Status === false) {
        // Se estava desarmada, inicia o delay
        if (this.lastRearmeTime === 0) {
          this.lastRearmeTime = now;
          this.addEvent('REARME_INICIADO', 'Aguardando 30s de estabilidade');
        }

        if (now - this.lastRearmeTime >= REARME_DELAY_MS) {
          // Rearme concluído: Arma K1
          this.relayK1Status = true;
          this.lastRearmeTime = 0;
          this.addEvent('REARME_CONCLUIDO', 'Contatora K1 rearmed');
        }
      }
    }
  }

  /**
   * Gera um novo ponto de dados MQTT
   */
  public generateData(): ProteveMQTTData {
    this.simulateVoltageFluctuation();
    this.updateSystemState();

    return {
      timestamp: Math.floor(Date.now() / 1000),
      tensao: parseFloat(this.voltage.toFixed(1)),
      corrente: parseFloat(this.current.toFixed(1)),
      status_k1: this.relayK1Status,
      falhas: this.failureCount,
      lockout: this.isLockedOut,
    };
  }

  /**
   * Retorna os eventos do sistema
   */
  public getEvents(): SystemEvent[] {
    return [...this.events];
  }

  /**
   * Simula um reset remoto do lockout
   */
  public resetLockout(): void {
    if (this.isLockedOut) {
      this.isLockedOut = false;
      this.failureCount = 0;
      this.lastFailureTime = 0;
      this.addEvent('RESET_REMOTO', 'Reset remoto aplicado via App');
    }
  }

  /**
   * Retorna o estado atual do sistema
   */
  public getSystemState() {
    return {
      voltage: this.voltage,
      current: this.current,
      failureCount: this.failureCount,
      isLockedOut: this.isLockedOut,
      relayK1Status: this.relayK1Status,
    };
  }
}

// Instância global do simulador
export const mqttSimulator = new MQTTSimulator();
