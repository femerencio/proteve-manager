export enum TopologyType {
  T1 = 'T1 - Monofásico Residencial',
  T2 = 'T2 - Bifásico com Neutro',
  T3 = 'T3 - Bifásico sem Neutro',
  T4 = 'T4 - Trifásico Delta',
  T5 = 'T5 - Trifásico Estrela'
}

export enum SystemStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  LOCKOUT = 'LOCKOUT'
}

export interface InspectionItem {
  id: string;
  category: string;
  label: string;
  checked: boolean;
  required: boolean;
  notes?: string;
}

export interface ClientData {
  name: string;
  document: string; // CPF/CNPJ
  address: string;
  city: string;
  installDate: string;
}

export interface TelemetryData {
  timestamp: string;
  voltageL1: number;
  voltageL2?: number;
  voltageL3?: number;
  current: number;
  relayState: boolean; // K1
  epsState: boolean; // K2 (Hybrid)
  temperature: number;
}

export interface ProteveMQTTData {
  timestamp: number;
  tensao: number; // Tensão RMS em Volts
  corrente: number; // Corrente RMS em Amperes
  status_k1: boolean; // Status da Contatora K1 (true = Armada, false = Desarmada)
  falhas: number; // Contagem de falhas
  lockout: boolean; // Status do Lockout
}

export interface SystemEvent {
  id: string;
  timestamp: Date;
  eventType: 'SUBTENSAO' | 'SOBRETENSAO' | 'REARME_INICIADO' | 'REARME_CONCLUIDO' | 'LOCKOUT_ATINGIDO' | 'RESET_REMOTO' | 'NORMAL';
  voltage?: number;
  duration?: number; // em segundos
  action: string;
}