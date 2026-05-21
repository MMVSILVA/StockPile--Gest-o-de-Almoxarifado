/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Layers, 
  MapPin, 
  Database, 
  Truck, 
  Cpu, 
  Sliders, 
  LogOut,
  Clock,
  User,
  Activity,
  Sparkles
} from 'lucide-react';

// Custom components
import Logo from './components/Logo';
import LoginScreen from './components/LoginScreen';
import DashboardTab from './components/DashboardTab';
import MaterialsTab from './components/MaterialsTab';
import MapTab from './components/MapTab';
import SapTab from './components/SapTab';
import SuppliersTab from './components/SuppliersTab';
import AssistantTab from './components/AssistantTab';
import ConfigTab from './components/ConfigTab';

// Data models
import { Material } from './types';
import { INITIAL_MATERIALS } from './data/materialsData';

export default function App() {
  // Session States
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    registry: string;
    sector: string;
  } | null>(null);

  // Dynamic state list of active materials (so edits apply globally)
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  
  // Navigation
  const [activeTab, setActiveTab] = useState<number>(2); // Default home dashboard after login
  const [mapTargetLocation, setMapTargetLocation] = useState<string | null>(null);

  // Simulated live clock state
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Elegant system time ticker simulation
    const timer = setInterval(() => {
      const now = new Date();
      // Keep within simulated date for consistency with audit logs (May 20, 2026), but use current live H/M/S
      const hms = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentTime(`2026-05-20 ${hms} UTC`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSuccess = (user: { name: string; registry: string; sector: string }) => {
    setCurrentUser(user);
    setActiveTab(2); // Jump to home dashboard
  };

  const handleLogOut = () => {
    setCurrentUser(null);
  };

  const handleResetDatabase = () => {
    if (window.confirm('Tem certeza de que deseja restaurar as quantidades e os laudos para os valores originais do protótipo?')) {
      setMaterials(INITIAL_MATERIALS);
      setMapTargetLocation(null);
      alert('Banco de dados StockFlow resetado com sucesso.');
    }
  };

  const handleLocateMaterialOnMap = (locationStr: string) => {
    setMapTargetLocation(locationStr);
    setActiveTab(4); // Shifting tabs to Mapa Visual do Estoque
  };

  // Guard Clause: show login screen if no session active
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Define sidebar navigation items
  const menuItems = [
    { id: 2, label: 'Painel Geral', icon: TrendingUp },
    { id: 3, label: 'Base de Materiais', icon: Layers },
    { id: 4, label: 'Mapa do Estoque', icon: MapPin, highlight: mapTargetLocation ? true : false },
    { id: 5, label: 'Integração SAP', icon: Database },
    { id: 6, label: 'Fornecedores', icon: Truck },
    { id: 7, label: 'Assistente Atena', icon: Cpu, isAi: true },
    { id: 8, label: 'Configurações', icon: Sliders },
  ];

  return (
    <div className="min-h-screen flex bg-[#030712] text-slate-100 font-sans selection:bg-orange-500/30 selection:text-orange-200" id="stockflow-app-root">
      
      {/* 1. Left Sidebar menu */}
      <aside 
        id="app-sidebar" 
        className="hidden md:flex md:w-64 bg-slate-950/50 backdrop-blur-xl text-white flex-col justify-between shrink-0 border-r border-slate-900/80 shadow-2xl relative z-10"
      >
        <div className="p-5 flex flex-col h-full" id="sidebar-container">
          
          {/* Logo brand */}
          <div className="flex flex-col mb-7 w-full" id="sidebar-brand">
            <Logo size="sm" withBackground={true} className="w-full justify-center shadow-2xl p-4 transition-transform duration-200 hover:scale-[1.01]" />
          </div>

          {/* Connected worker credential quick-badge */}
          <div className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3 shadow-inner" id="worker-badge">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(255,107,0,0.3)] animate-neon-orange">
              {currentUser.name.substring(0, 1).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] text-slate-500 block font-mono">OPERADOR: {currentUser.registry}</span>
              <span className="text-xs font-bold block text-white truncate">{currentUser.name}</span>
              <span className="text-[10px] text-orange-400 font-medium leading-none mt-0.5 inline-block">{currentUser.sector}</span>
            </div>
          </div>

          {/* Navigation Items menu */}
          <nav className="flex-1 space-y-1.5" id="sidebar-nav">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-2 font-mono">Modos Operacionais:</span>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // clear target marker when changing manually
                    if (item.id !== 4) setMapTargetLocation(null);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_0_15px_rgba(255,107,0,0.25)] font-bold border-l-4 border-orange-400' 
                      : 'hover:bg-slate-900/60 text-slate-400 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.isAi && (
                    <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping" />
                  )}
                  {item.highlight && !isActive && (
                    <span className="bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full font-mono animate-bounce">
                      Pino
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout widget */}
          <div className="pt-4 border-t border-slate-900" id="sidebar-logout">
            <button
              onClick={handleLogOut}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Sair da Sessão</span>
            </button>
          </div>

        </div>
      </aside>

      {/* 2. Right Workspace Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#030712]" id="app-workspace-main">
        
        {/* Top telemetry and clock header */}
        <header 
          id="app-topbar" 
          className="bg-slate-950/30 border-b border-slate-900 backdrop-blur-md h-16 flex items-center justify-between px-6 shrink-0 relative z-20 text-slate-200"
        >
          {/* Mobile responsive logo display */}
          <div className="flex items-center gap-2 md:hidden" id="topbar-logo-mobile">
            <Logo size="sm" withBackground={true} className="p-1 px-3 shadow-md scale-95" />
          </div>

          {/* Real-time system monitoring line */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 font-medium" id="topbar-clock-monitor">
            <Clock className="h-4 w-4 text-orange-500 animate-pulse" />
            <span>{currentTime || 'Sincronizando relógio...'}</span>
          </div>

          {/* Mobile switcher block */}
          <div className="md:hidden flex items-center gap-2" id="mobile-nav-pills">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value={2}>Painel Geral</option>
              <option value={3}>Base de Materiais</option>
              <option value={4}>Mapa do Estoque</option>
              <option value={5}>Integração SAP</option>
              <option value={6}>Fornecedores</option>
              <option value={7}>Assistente Atena</option>
              <option value={8}>Configurações</option>
            </select>
            <button onClick={handleLogOut} className="text-slate-400 hover:text-red-500 p-1">
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Top-right operator metrics */}
          <div className="hidden md:flex items-center gap-4 text-xs font-sans text-slate-400" id="topbar-telemetry">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium" id="system-status">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse block" />
              <span>Conexão Estável</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <span>Matrícula: <strong className="text-slate-200">{currentUser.registry}</strong></span>
          </div>
        </header>

        {/* 3. Central view container */}
        <main 
          id="workspace-body"
          className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto"
        >
          {/* Tab Route Switching Engine */}
          {activeTab === 2 && (
            <DashboardTab 
              materials={materials} 
              onSelectTab={setActiveTab} 
            />
          )}

          {activeTab === 3 && (
            <MaterialsTab 
              materials={materials} 
              setMaterials={setMaterials} 
              currentUser={currentUser} 
              onLocateOnMap={handleLocateMaterialOnMap}
            />
          )}

          {activeTab === 4 && (
            <MapTab 
              materials={materials} 
              targetLocation={mapTargetLocation} 
              setTargetLocation={setMapTargetLocation}
            />
          )}

          {activeTab === 5 && (
            <SapTab />
          )}

          {activeTab === 6 && (
            <SuppliersTab />
          )}

          {activeTab === 7 && (
            <AssistantTab materials={materials} />
          )}

          {activeTab === 8 && (
            <ConfigTab 
              currentUser={currentUser} 
              onResetData={handleResetDatabase} 
            />
          )}
        </main>

      </div>

    </div>
  );
}
