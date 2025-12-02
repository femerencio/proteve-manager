import React from 'react';
import { LayoutDashboard, ClipboardCheck, FileText, Settings, Activity, ShieldCheck, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Monitoramento IoT', icon: Activity },
    { id: 'checklist', label: 'Homologação', icon: ClipboardCheck },
    { id: 'reports', label: 'Laudos Técnicos', icon: FileText },
    { id: 'topology', label: 'Topologias', icon: Zap },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-10">
      <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
        <div className="bg-blue-500 p-2 rounded-lg">
          <ShieldCheck size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">PROTEVE™</h1>
          <p className="text-xs text-slate-400">Manager v1.1</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400">
          <p className="font-semibold text-white mb-1">Status do Sistema</p>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Cloud Conectado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;