import React, { useState } from 'react';
import { Save, FileCheck, Camera, AlertCircle } from 'lucide-react';
import { InspectionItem } from '../types';

const initialItems: InspectionItem[] = [
  { id: '1', category: 'Aterramento', label: 'Medição de aterramento ≤ 10 Ω', checked: false, required: true },
  { id: '2', category: 'Conexão', label: 'Topologia identificada (TT/TN-S/TN-C) e documentada', checked: false, required: true },
  { id: '3', category: 'Proteção DC', label: 'PV conectado no PCC com DPS AC T2 (se aplicável)', checked: false, required: false },
  { id: '4', category: 'PROTEVE', label: 'Relé ajustado e testado (Sub: 190V / Sobre: 247V)', checked: false, required: true },
  { id: '5', category: 'PROTEVE', label: 'Contatora dimensionada (Ie ≥ corrente nominal)', checked: false, required: true },
  { id: '6', category: 'PROTEVE', label: 'Rearme automático temporizado (30s) e Lockout (3 falhas/15min) funcional', checked: false, required: true },
  { id: '7', category: 'Normas', label: 'DRs e DPS conforme NBR 5410/5419 (Laudo de Conformidade)', checked: false, required: true },
  { id: '8', category: 'Segurança', label: 'Equipotencialização das massas metálicas confirmada (Medição)', checked: false, required: true },
];

const HomologationChecklist: React.FC = () => {
  const [items, setItems] = useState<InspectionItem[]>(initialItems);
  const [ohmValue, setOhmValue] = useState<string>('');
  const [clientName, setClientName] = useState('');

  const handleCheck = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-6">
          <div>
	            <h2 className="text-2xl font-bold text-slate-800">Checklist de Conformidade (Método PROTEVE v1.1)</h2>
            <p className="text-slate-500">Homologação PROTEVE™ v1.1 - Integração Fotovoltaica/Híbrida</p>
          </div>
          <div className="text-right">
             <div className="text-sm font-semibold text-slate-500 mb-1">Progresso</div>
             <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="text-blue-600 font-bold">{progress}%</span>
             </div>
          </div>
        </div>

        {/* Client Data Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Cliente / Razão Social</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Indústria XYZ Ltda"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Resistência Aferida (Ω)</label>
            <input 
              type="number" 
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Máx 10 Ω"
              value={ohmValue}
              onChange={(e) => setOhmValue(e.target.value)}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-start p-4 border rounded-lg transition-colors ${
                item.checked ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex-shrink-0 pt-1">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheck(item.id)}
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                  {item.required && <span className="text-xs text-red-500 font-medium">Obrigatório</span>}
                </div>
                <p className={`mt-1 font-medium ${item.checked ? 'text-green-800' : 'text-slate-700'}`}>
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Evidence Upload Section */}
        <div className="mt-8 pt-8 border-t border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
            <Camera size={20} className="mr-2 text-slate-400" />
            Evidências Fotográficas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {['Entrada/Padrão', 'QDC Interno', 'Aterramento', 'DPS/Relé'].map((label, idx) => (
               <div key={idx} className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all">
                  <Camera size={24} className="mb-2" />
                  <span className="text-xs text-center px-2">{label}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
            Salvar Rascunho
          </button>
          <button 
            disabled={progress < 100}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold text-white transition-all ${
              progress === 100 ? 'bg-green-600 hover:bg-green-700 shadow-lg' : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <FileCheck size={20} />
            <span>Gerar Laudo PDF</span>
          </button>
        </div>

        {progress < 100 && (
           <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg flex items-center">
             <AlertCircle size={16} className="mr-2" />
             Complete todos os itens obrigatórios para gerar o laudo de homologação.
           </div>
        )}
      </div>
    </div>
  );
};

export default HomologationChecklist;