import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import IoTDashboard from './components/IoTDashboard';
import HomologationChecklist from './components/HomologationChecklist';
import TopologyViewer from './components/TopologyViewer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <IoTDashboard />;
      case 'checklist':
        return <HomologationChecklist />;
      case 'topology':
        return <TopologyViewer />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <h2 className="text-2xl font-bold mb-2">Em Desenvolvimento</h2>
            <p>Este módulo estará disponível na versão v1.2 do PROTEVE Manager.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-xl font-bold text-slate-800 hidden md:block">
               {activeTab === 'dashboard' && 'Visão Geral do Sistema'}
               {activeTab === 'checklist' && 'Nova Homologação'}
               {activeTab === 'topology' && 'Base de Conhecimento'}
             </h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-slate-700">Vinícius Fernando Amorim</p>
               <p className="text-xs text-slate-500">Engenheiro Responsável</p>
             </div>
             <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
               VA
             </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;