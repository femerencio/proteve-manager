import React from 'react';
import { TopologyType } from '../types';
import { Zap, Info } from 'lucide-react';

const TopologyViewer: React.FC = () => {
  const topologies = [
    {
      id: 'T1',
      title: 'T1 - Monofásico Residencial',
      desc: 'Fase + Neutro (2 condutores)',
      volt: '127V ou 220V',
      use: 'Casas simples, iluminação e tomadas.',
      system: 'TT ou TN-S'
    },
    {
      id: 'T2',
      title: 'T2 - Bifásico com Neutro',
      desc: '2 Fases + Neutro (3 condutores)',
      volt: '127/220V',
      use: 'Residências médias, ranchos, pequenas empresas.',
      system: 'TN-C ou TN-S'
    },
    {
      id: 'T3',
      title: 'T3 - Bifásico sem Neutro',
      desc: '2 Fases (2 condutores)',
      volt: '220V',
      use: 'Motores, equipamentos que não necessitam de neutro.',
      system: 'TN-C'
    },
    {
      id: 'T4',
      title: 'T4 - Trifásico Delta (Δ)',
      desc: '3 Fases + Neutro (4 condutores)',
      volt: '220V',
      use: 'Comércios, residências amplas, máquinas industriais.',
      system: 'TN-S'
    },
    {
      id: 'T5',
      title: 'T5 - Trifásico Estrela (Y)',
      desc: '3 Fases + Neutro (4 condutores)',
      volt: '380/220V',
      use: 'Indústrias, propriedades rurais, condomínios.',
      system: 'TN-S'
    }
  ]; (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Topologias de Conexão PROTEVE™</h2>
        <p className="opacity-90">Referência técnica para aplicação correta dos dispositivos de proteção e DPS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topologies.map((topo) => (
          <div key={topo.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-blue-300 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Zap size={24} />
              </div>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                {topo.system}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{topo.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{topo.desc}</p>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="w-24 font-semibold text-slate-600">Tensão:</span>
                <span className="text-slate-800">{topo.volt}</span>
              </div>
              <div className="flex items-start text-sm">
                <span className="w-24 font-semibold text-slate-600 flex-shrink-0">Aplicação:</span>
                <span className="text-slate-800">{topo.use}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
        <Info className="text-yellow-600 mr-3 mt-1 flex-shrink-0" size={20} />
        <div className="text-sm text-yellow-800">
          <p className="font-bold mb-1">Nota Importante sobre Aterramento</p>
          <p>O sistema PROTEVE atua depois do PCC. Em subtensão, sobretensão ou falta de fase, o relé desarma K1 e isola o barramento interno. A resistência de aterramento deve ser sempre inferior a 10 Ohms para homologação.</p>
        </div>
      </div>
    </div>
  );
};

export default TopologyViewer;