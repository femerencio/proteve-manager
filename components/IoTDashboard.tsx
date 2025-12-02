import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle,
  Lock,
  Power,
  Zap,
  Wifi,
  RotateCcw,
} from 'lucide-react';
import { SystemStatus, ProteveMQTTData, SystemEvent } from '../types';
import { mqttSimulator } from '../utils/mqtt-simulator';

interface ChartDataPoint {
  time: string;
  voltage: number;
  current: number;
  timestamp: number;
}

const IoTDashboard: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [currentData, setCurrentData] = useState<ProteveMQTTData | null>(null);
  const [status, setStatus] = useState<SystemStatus>(SystemStatus.NORMAL);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  // Simula a conexão MQTT e atualização de dados em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = mqttSimulator.generateData();
      setCurrentData(newData);

      // Atualizar status do sistema
      if (newData.lockout) {
        setStatus(SystemStatus.LOCKOUT);
      } else if (
        newData.tensao < 190 ||
        newData.tensao > 247 ||
        newData.falhas > 0
      ) {
        setStatus(SystemStatus.CRITICAL);
      } else {
        setStatus(SystemStatus.NORMAL);
      }

      // Atualizar gráfico
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      setChartData((prev) => {
        const updated = [
          ...prev,
          {
            time: timeStr,
            voltage: newData.tensao,
            current: newData.corrente,
            timestamp: newData.timestamp,
          },
        ];
        // Manter apenas os últimos 20 pontos de dados
        return updated.slice(-20);
      });

      // Atualizar eventos
      setEvents(mqttSimulator.getEvents());
    }, 3000); // Atualizar a cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const handleResetLockout = () => {
    mqttSimulator.resetLockout();
    setCurrentData(mqttSimulator.generateData());
    setEvents(mqttSimulator.getEvents());
  };

  const getStatusColor = () => {
    switch (status) {
      case SystemStatus.NORMAL:
        return 'text-green-600';
      case SystemStatus.WARNING:
        return 'text-yellow-600';
      case SystemStatus.CRITICAL:
        return 'text-red-600';
      case SystemStatus.LOCKOUT:
        return 'text-red-700';
      default:
        return 'text-slate-600';
    }
  };

  const getStatusBgColor = () => {
    switch (status) {
      case SystemStatus.NORMAL:
        return 'bg-green-50 border-green-200';
      case SystemStatus.WARNING:
        return 'bg-yellow-50 border-yellow-200';
      case SystemStatus.CRITICAL:
        return 'bg-red-50 border-red-200';
      case SystemStatus.LOCKOUT:
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-white border-slate-100';
    }
  };

  const getStatusLabel = () => {
    if (!currentData) return 'INICIALIZANDO';
    if (currentData.lockout) return 'LOCKOUT ATIVO';
    if (currentData.tensao < 190) return 'SUBTENSÃO';
    if (currentData.tensao > 247) return 'SOBRETENSÃO';
    return 'OPERACIONAL';
  };

  const getRelayStatusLabel = () => {
    if (!currentData) return 'DESCONHECIDO';
    return currentData.status_k1 ? 'ARMADA' : 'DESARMADA';
  };

  const getRelayStatusColor = () => {
    if (!currentData) return 'text-slate-600';
    return currentData.status_k1 ? 'text-green-600' : 'text-red-600';
  };

  // Inicializar dados se vazio
  if (!currentData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Wifi size={32} className="text-blue-500" />
          </div>
          <p className="text-slate-600 font-medium">Conectando ao sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Monitoramento em Tempo Real
          </h2>
          <p className="text-slate-500">
            Unidade: Hospital Regional - Centro Cirúrgico (Topologia T5)
          </p>
        </div>
        <div
          className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm border ${
            isConnected
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <Wifi
            size={18}
            className={isConnected ? 'text-green-500' : 'text-red-500'}
          />
          <span
            className={`text-sm font-medium ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isConnected ? 'Conectado' : 'Desconectado'} via PROTEVE-Cloud
          </span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Geral */}
        <div
          className={`bg-white p-5 rounded-xl shadow-sm border ${getStatusBgColor()} transition-all`}
        >
          <div>
            <p className="text-sm text-slate-500 mb-1">Status Geral</p>
            <h3 className={`text-xl font-bold flex items-center ${getStatusColor()}`}>
              {status === SystemStatus.NORMAL && (
                <>
                  <CheckCircle size={20} className="mr-2" /> OPERACIONAL
                </>
              )}
              {status === SystemStatus.CRITICAL && (
                <>
                  <AlertTriangle size={20} className="mr-2" /> CRÍTICO
                </>
              )}
              {status === SystemStatus.LOCKOUT && (
                <>
                  <Lock size={20} className="mr-2" /> LOCKOUT
                </>
              )}
            </h3>
          </div>
        </div>

        {/* Contatora K1 */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div>
            <p className="text-sm text-slate-500 mb-1">Contatora K1 (Rede)</p>
            <div className={`flex items-center ${getRelayStatusColor()}`}>
              <Power size={20} className="mr-2" />
              <h3 className="text-xl font-bold">{getRelayStatusLabel()}</h3>
            </div>
          </div>
        </div>

        {/* Tensão */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div>
            <p className="text-sm text-slate-500 mb-1">Tensão RMS (V)</p>
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <Zap size={20} className="mr-2 text-yellow-500" />
              {currentData.tensao.toFixed(1)} V
            </h3>
          </div>
        </div>

        {/* Proteção Lockout */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Proteção Lockout</p>
              <h3
                className={`text-xl font-bold flex items-center ${
                  currentData.lockout ? 'text-red-600' : 'text-slate-400'
                }`}
              >
                <Lock size={20} className="mr-2" />
                {currentData.lockout ? 'ATIVO' : 'INATIVO'}
              </h3>
            </div>
            {currentData.lockout && (
              <button
                onClick={handleResetLockout}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded font-medium transition-colors"
                title="Reset remoto do lockout"
              >
                <RotateCcw size={14} className="inline mr-1" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contador de Falhas */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Contagem de Falhas</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {currentData.falhas} / 3
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Lockout acionado após 3 falhas em 15 minutos
            </p>
          </div>
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  i < currentData.falhas ? 'bg-red-500' : 'bg-slate-300'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voltage Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-slate-800">
              Variação de Tensão (Fase-Neutro) - RMS
            </h3>
            <p className="text-sm text-slate-500">
              Monitoramento contínuo conforme NBR 5410 | Limites: 190V-247V
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[180, 260]}
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  unit="V"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value.toFixed(1)} V`, 'Tensão']}
                />
                <Area
                  type="monotone"
                  dataKey="voltage"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVoltage)"
                />
                {/* Reference Lines for limits */}
                <ReferenceLine
                  y={247}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{ value: 'Sobretensão (247V)', position: 'right', fill: '#ef4444', fontSize: 11 }}
                />
                <ReferenceLine
                  y={190}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{ value: 'Subtensão (190V)', position: 'right', fill: '#ef4444', fontSize: 11 }}
                />
                <ReferenceLine
                  y={220}
                  stroke="#10b981"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  label={{ value: 'Nominal (220V)', position: 'right', fill: '#10b981', fontSize: 11 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current & Failure Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col justify-center">
            <h3 className="font-bold text-lg text-slate-800 mb-4">
              Consumo de Corrente RMS
            </h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit="A"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value.toFixed(1)} A`, 'Corrente']}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
              <span>Mín: {Math.min(...chartData.map((d) => d.current)).toFixed(1)} A</span>
              <span>Máx: {Math.max(...chartData.map((d) => d.current)).toFixed(1)} A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Events Log */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">
            Log de Eventos (PROTEVE-Cloud)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Data/Hora</th>
                <th className="px-6 py-4">Evento</th>
                <th className="px-6 py-4">Tensão</th>
                <th className="px-6 py-4">Ação do Sistema</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.slice(-10).reverse().map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 text-xs">
                    {event.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 flex items-center">
                    {event.eventType === 'SUBTENSAO' && (
                      <>
                        <AlertTriangle
                          size={16}
                          className="mr-2 text-yellow-600"
                        />
                        <span className="text-yellow-600 font-medium">
                          Subtensão
                        </span>
                      </>
                    )}
                    {event.eventType === 'SOBRETENSAO' && (
                      <>
                        <AlertTriangle
                          size={16}
                          className="mr-2 text-orange-600"
                        />
                        <span className="text-orange-600 font-medium">
                          Sobretensão
                        </span>
                      </>
                    )}
                    {event.eventType === 'LOCKOUT_ATINGIDO' && (
                      <>
                        <Lock size={16} className="mr-2 text-red-600" />
                        <span className="text-red-600 font-medium">
                          Lockout Acionado
                        </span>
                      </>
                    )}
                    {event.eventType === 'REARME_INICIADO' && (
                      <>
                        <AlertTriangle
                          size={16}
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-blue-600 font-medium">
                          Rearme Iniciado
                        </span>
                      </>
                    )}
                    {event.eventType === 'REARME_CONCLUIDO' && (
                      <>
                        <CheckCircle
                          size={16}
                          className="mr-2 text-green-600"
                        />
                        <span className="text-green-600 font-medium">
                          Rearme Concluído
                        </span>
                      </>
                    )}
                    {event.eventType === 'RESET_REMOTO' && (
                      <>
                        <CheckCircle
                          size={16}
                          className="mr-2 text-blue-600"
                        />
                        <span className="text-blue-600 font-medium">
                          Reset Remoto
                        </span>
                      </>
                    )}
                    {event.eventType === 'NORMAL' && (
                      <>
                        <CheckCircle
                          size={16}
                          className="mr-2 text-green-600"
                        />
                        <span className="text-green-600 font-medium">
                          Normal
                        </span>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {event.voltage ? `${event.voltage.toFixed(1)}V` : '-'}
                  </td>
                  <td className="px-6 py-4 text-xs">{event.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;
