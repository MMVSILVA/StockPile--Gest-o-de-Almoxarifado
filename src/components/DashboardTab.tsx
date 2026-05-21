/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Layers, 
  AlertTriangle, 
  Calendar, 
  Percent, 
  ArrowUpRight, 
  Activity,
  Award
} from 'lucide-react';
import { Material } from '../types';

interface DashboardTabProps {
  materials: Material[];
  onSelectTab: (tabIndex: number) => void;
}

export default function DashboardTab({ materials, onSelectTab }: DashboardTabProps) {
  // Count current statistics from active data
  const totalStockValue = 60450000;
  const activeItemsCount = 170532;
  const criticalItemsCount = materials.filter(m => m.status === 'critical').length + 58; 
  const expiredItemsCount = materials.filter(m => m.status === 'expired').length + 118; 
  const stockTurnover = 3.2;

  // Selected chart helper for expand view
  const [hoveredData, setHoveredData] = useState<string | null>(null);

  return (
    <div className="space-y-6 select-none animate-fade-in" id="dashboard-tab">
      
      {/* Title & Welcome bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="dashboard-header-bar">
        <div>
          <h1 className="text-2xl font-black text-white font-sans tracking-tight">
            Visão Geral Logística & Pureza
          </h1>
          <p className="text-slate-450 text-xs mt-1 font-mono uppercase tracking-widest">
            SISTEMA STOCKPILE · MONITORAMENTO CONTÍNUO DE COMPOSTOS QUÍMICOS
          </p>
        </div>
        <div className="flex items-center gap-2.5" id="sync-badge">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping block" />
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-full font-mono font-bold shadow-[0_0_15px_rgba(52,211,153,0.1)]">
            CONECTADO AO SAP: ONLINE
          </span>
        </div>
      </div>

      {/* Main counts section - 5 dark glassmorphic cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="metrics-cards-grid">
        
        {/* Card 1: Valor do Estoque */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all shadow-xl relative group" id="metric-stock-value">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">VALOR DO ESTOQUE</span>
            <div className="h-7 w-7 bg-slate-900 text-orange-400 rounded-lg flex items-center justify-center border border-slate-800 shadow-inner group-hover:text-orange-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white tracking-tight">R$ 60.45M</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-1 font-semibold">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12.4% este mês</span>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-5 h-[3px] bg-orange-500 shadow-[0_0_10px_#ff6b00]" />
        </div>

        {/* Card 2: Itens Ativos */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all shadow-xl relative group" id="metric-active-items">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">ITENS ATIVOS</span>
            <div className="h-7 w-7 bg-slate-900 text-[#438AF3] rounded-lg flex items-center justify-center border border-slate-800 shadow-inner">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white tracking-tight">170.532</span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-450 font-mono mt-1 font-semibold">
              <span>98% da cap. física</span>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-5 h-[3px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </div>

        {/* Card 3: Estoque Crítico */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all shadow-xl relative group cursor-pointer" id="metric-critical-stock" onClick={() => onSelectTab(3)}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">ESTOQUE CRÍTICO</span>
            <div className="h-7 w-7 bg-orange-950/40 text-orange-400 rounded-lg flex items-center justify-center border border-orange-500/20 shadow-inner group-hover:scale-110 duration-200">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-orange-500 tracking-tight">{criticalItemsCount}</span>
            <div className="flex items-center gap-1.5 text-[11px] text-orange-400 font-mono mt-1 font-semibold">
              <span>Requer compra SAP</span>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-5 h-[3px] bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)] animate-pulse" />
        </div>

        {/* Card 4: Materiais Vencidos */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all shadow-xl relative group cursor-pointer" id="metric-expired-stock" onClick={() => onSelectTab(3)}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">VENCIDOS NO RACK</span>
            <div className="h-7 w-7 bg-red-950/40 text-red-400 rounded-lg flex items-center justify-center border border-red-500/20 shadow-inner animate-pulse">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-red-500 tracking-tight">{expiredItemsCount}</span>
            <div className="flex items-center gap-1.5 text-[11px] text-red-450 font-mono mt-1 font-semibold">
              <span>Ação de quarentena</span>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-5 h-[3px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
        </div>

        {/* Card 5: Giro de Estoque */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all shadow-xl relative group" id="metric-turnover">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">GIRO DE ESTOQUE</span>
            <div className="h-7 w-7 bg-slate-900 text-emerald-400 rounded-lg flex items-center justify-center border border-slate-800 shadow-inner">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white tracking-tight">{stockTurnover}</span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-1 font-semibold">
              <span>Meta de giro: 4,0</span>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-5 h-[3px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        </div>
      </div>

      {/* Main Charts area with immersive dark grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="charts-sections">
        
        {/* Chart 1: Entradas x Saídas */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-xl" id="chart-inputs-outputs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#438AF3] block" />
                <span>Histórico de Fluxo Comercial (Tons/Mês)</span>
              </h3>
              <p className="text-xs text-slate-455 mt-0.5 font-mono uppercase tracking-wider">Módulos de estocagem combinada</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono" id="chart-legend-io">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#438AF3] inline-block shadow-[0_0_6px_#438AF3]" /> Entradas</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-500 inline-block shadow-[0_0_6px_#ff6b00]" /> Saídas</span>
            </div>
          </div>

          <div className="relative pt-2" id="svg-io-chart">
            <svg viewBox="0 0 500 200" className="w-full h-48 overflow-visible">
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#438AF3" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#438AF3" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6b00" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#ff6b00" stopOpacity="0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#334155" strokeWidth="1.2" />

              {/* Y Axis Labels */}
              <text x="30" y="24" className="text-[9px] fill-slate-500 font-mono" textAnchor="end">150k</text>
              <text x="30" y="64" className="text-[9px] fill-slate-500 font-mono" textAnchor="end">100k</text>
              <text x="30" y="104" className="text-[9px] fill-slate-500 font-mono" textAnchor="end">50k</text>
              <text x="30" y="144" className="text-[9px] fill-slate-500 font-mono" textAnchor="end">20k</text>
              <text x="30" y="174" className="text-[9px] fill-slate-600 font-mono" textAnchor="end">0</text>

              {/* Month Markers */}
              <text x="60" y="188" className="text-[9px] fill-slate-400 font-mono font-bold" textAnchor="middle">Dez</text>
              <text x="140" y="188" className="text-[9px] fill-slate-400 font-mono font-bold" textAnchor="middle">Jan</text>
              <text x="220" y="188" className="text-[9px] fill-slate-400 font-mono font-bold" textAnchor="middle">Fev</text>
              <text x="300" y="188" className="text-[9px] fill-slate-400 font-mono font-bold" textAnchor="middle">Mar</text>
              <text x="380" y="188" className="text-[9px] fill-slate-400 font-mono font-bold" textAnchor="middle">Abr</text>
              <text x="460" y="188" className="text-[9px] fill-slate-400 font-mono font-bold" textAnchor="middle">Mai</text>

              {/* Area Under Line Blue (Entradas) */}
              <path d="M 60,170 L 60,80 L 140,50 L 220,110 L 300,40 L 380,85 L 460,35 L 460,170 Z" fill="url(#blueGrad)" />
              {/* Area Under Line Orange (Saídas) */}
              <path d="M 60,170 L 60,110 L 140,95 L 220,70 L 300,85 L 380,120 L 460,90 L 460,170 Z" fill="url(#orangeGrad)" />

              {/* Line charts paths with beautiful colors & dynamic tracking */}
              <path d="M 60,80 L 140,50 L 220,110 L 300,40 L 380,85 L 460,35" fill="none" stroke="#438AF3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 60,110 L 140,95 L 220,70 L 300,85 L 380,120 L 460,90" fill="none" stroke="#ff6b00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />

              {/* Glowing Dots */}
              <circle cx="460" cy="35" r="5" fill="#438AF3" stroke="#030712" strokeWidth="2" className="cursor-pointer transition-all duration-300 hover:scale-150" onMouseEnter={() => setHoveredData('Entradas Mai: 135 toneladas')} onMouseLeave={() => setHoveredData(null)} />
              <circle cx="460" cy="90" r="5" fill="#ff6b00" stroke="#030712" strokeWidth="2" className="cursor-pointer transition-all duration-300 hover:scale-150" onMouseEnter={() => setHoveredData('Saídas Mai: 80 toneladas')} onMouseLeave={() => setHoveredData(null)} />
              
              <circle cx="300" cy="40" r="4.5" fill="#438AF3" stroke="#030712" strokeWidth="1.5" />
              <circle cx="220" cy="70" r="4.5" fill="#ff6b00" stroke="#030712" strokeWidth="1.5" />
            </svg>
            {hoveredData && (
              <div className="absolute top-2 right-2 bg-slate-950 border border-slate-800 text-orange-400 text-[10px] font-mono py-1.5 px-3 rounded-lg shadow-2xl tracking-wide animate-pulse">
                {hoveredData}
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Curva ABC */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-xl" id="chart-abc-curve">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500 block animate-pulse" />
                <span>Análise de Criticidade - Curva ABC</span>
              </h3>
              <p className="text-xs text-slate-455 mt-0.5 font-mono uppercase tracking-wider">Classificação de Investimentos</p>
            </div>
          </div>

          <div className="relative pt-2" id="svg-abc-chart">
            <svg viewBox="0 0 500 200" className="w-full h-48 overflow-visible">
              {/* Background sectors */}
              <rect x="40" y="20" width="100" height="150" fill="rgba(67, 138, 243, 0.04)" />
              <rect x="140" y="20" width="150" height="150" fill="rgba(16, 185, 129, 0.02)" />
              <rect x="290" y="20" width="180" height="150" fill="rgba(249, 115, 22, 0.04)" />

              {/* Axis */}
              <line x1="40" y1="20" x2="40" y2="170" stroke="#1e293b" strokeWidth="1.2" />
              <line x1="40" y1="170" x2="470" y2="170" stroke="#334155" strokeWidth="1.5" />

              {/* Separators */}
              <line x1="140" y1="20" x2="140" y2="170" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="290" y1="20" x2="290" y2="170" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

              {/* Curve Line */}
              <path d="M 40,170 Q 110,60 140,50 T 290,26 T 470,20" fill="none" stroke="#438AF3" strokeWidth="3.5" strokeLinecap="round" />

              {/* Zone Annotations */}
              <text x="90" y="145" className="text-[10px] font-bold fill-blue-400 font-mono text-center" textAnchor="middle">CLASSE A</text>
              <text x="215" y="145" className="text-[10px] font-bold fill-emerald-400 font-mono text-center" textAnchor="middle">CLASSE B</text>
              <text x="380" y="145" className="text-[10px] font-bold fill-orange-450 font-mono text-center" textAnchor="middle">CLASSE C</text>

              {/* Highlight Labels */}
              <text x="150" y="45" className="text-[9px] fill-orange-400 font-mono font-bold animate-pulse">Lítio & NCA (78% do valor)</text>

              {/* Y Axis percentage markers */}
              <text x="32" y="24" className="text-[9px] fill-slate-500 font-mono" textAnchor="end">100%</text>
              <text x="32" y="54" className="text-[9px] fill-slate-500 font-mono" textAnchor="end">80%</text>
              <text x="32" y="94" className="text-[9px] fill-slate-500 font-mono" textAnchor="end">50%</text>
              <text x="32" y="174" className="text-[9px] fill-slate-600 font-mono" textAnchor="end">0</text>

              {/* Highlight Circle */}
              <circle cx="140" cy="50" r="6" fill="#ff6b00" stroke="#030712" strokeWidth="2" className="animate-pulse" />
            </svg>
          </div>
          
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs mt-1" id="abc-tip">
            <span className="text-slate-400 font-mono">🔍 Alocação do mês anterior:</span>
            <span className="text-orange-400 font-mono font-bold">Lítio ultrapassou limite crítico em 2.4%</span>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-xl" id="chart-criticality-heatmap">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500 block animate-pulse" />
                <span>Heatmap de Criticidade (Setores x Nível)</span>
              </h3>
              <p className="text-xs text-slate-455 mt-0.5 font-mono uppercase tracking-wider">Detecção física de anomalias nos racks</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center" id="heatmap-grid">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/50 py-1.5 rounded-lg border border-slate-800/40 font-mono">SETOR</div>
            <div className="text-[9px] font-bold text-emerald-400 bg-emerald-950/20 py-1.5 rounded-lg border border-emerald-950/40 font-mono">ESTÁVEL</div>
            <div className="text-[9px] font-bold text-orange-450 bg-orange-950/20 py-1.5 rounded-lg border border-orange-950/40 font-mono">ATENÇÃO</div>
            <div className="text-[9px] font-bold text-rose-450 bg-rose-950/20 py-1.5 rounded-lg border border-rose-950/40 font-mono">CRÍTICO</div>

            {/* Row 1 */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/40 text-[11px] font-bold text-slate-300 font-mono flex items-center justify-center rounded-lg">QUALIDADE</div>
            <div className="p-2 bg-emerald-950/30 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-900/40 flex flex-col justify-center">
              <span>24 items</span>
              <span className="text-[8px] text-emerald-500 font-normal mt-0.5">Normativo</span>
            </div>
            <div className="p-2 bg-orange-950/30 text-orange-300 text-xs font-bold rounded-lg border border-orange-900/40 flex flex-col justify-center">
              <span>8 items</span>
              <span className="text-[8px] text-orange-500 font-normal mt-0.5">Precavido</span>
            </div>
            <div className="p-2 bg-rose-950/40 text-rose-300 text-xs font-bold rounded-lg border border-rose-900/40 flex flex-col justify-center animate-pulse">
              <span>3 items</span>
              <span className="text-[8px] text-rose-500 font-mono mt-0.5">Ação Urgente</span>
            </div>

            {/* Row 2 */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/40 text-[11px] font-bold text-slate-300 font-mono flex items-center justify-center rounded-lg">PRODUÇÃO</div>
            <div className="p-2 bg-emerald-950/30 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-900/40 flex flex-col justify-center">
              <span>45 items</span>
              <span className="text-[8px] text-emerald-500 font-normal mt-0.5">Otimizado</span>
            </div>
            <div className="p-2 bg-orange-950/30 text-orange-300 text-xs font-bold rounded-lg border border-orange-900/40 flex flex-col justify-center">
              <span>18 items</span>
              <span className="text-[8px] text-orange-500 font-normal mt-0.5">Replanejamento</span>
            </div>
            <div className="p-2 bg-slate-900/35 text-slate-500 text-xs font-normal rounded-lg border border-slate-800/80 flex flex-col justify-center">
              <span>0</span>
              <span className="text-[8px] opacity-50 mt-0.5">Livre</span>
            </div>

            {/* Row 3 */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/40 text-[11px] font-bold text-slate-300 font-mono flex items-center justify-center rounded-lg">ALMOXARIFADO</div>
            <div className="p-2 bg-emerald-950/30 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-900/40 flex flex-col justify-center">
              <span>102 items</span>
              <span className="text-[8px] text-emerald-500 font-normal mt-0.5">Giro Ideal</span>
            </div>
            <div className="p-2 bg-slate-905/30 text-slate-400 text-xs font-semibold rounded-lg border border-slate-800/50 flex flex-col justify-center">
              <span>2 items</span>
              <span className="text-[8px] text-slate-500 mt-0.5">Estoque Mín</span>
            </div>
            <div className="p-2 bg-slate-900/35 text-slate-550 text-xs font-normal rounded-lg border border-slate-800/80 flex flex-col justify-center">
              <span>0</span>
              <span className="text-[8px] opacity-50 mt-0.5">Livre</span>
            </div>

            {/* Row 4 */}
            <div className="p-3 bg-slate-900/40 border border-slate-800/40 text-[11px] font-bold text-slate-300 font-mono flex items-center justify-center rounded-lg">ARMAZENAGEM</div>
            <div className="p-2 bg-emerald-950/30 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-900/40 flex flex-col justify-center">
              <span>15 items</span>
              <span className="text-[8px] text-emerald-500 font-normal mt-0.5">Coerente</span>
            </div>
            <div className="p-2 bg-orange-950/30 text-orange-300 text-xs font-bold rounded-lg border border-orange-900/40 flex flex-col justify-center">
              <span>4 items</span>
              <span className="text-[8px] text-orange-500 font-normal mt-0.5">Trânsito</span>
            </div>
            <div className="p-2 bg-rose-950/40 text-rose-300 text-xs font-bold rounded-lg border border-rose-900/40 flex flex-col justify-center">
              <span>5 items</span>
              <span className="text-[8px] text-rose-500 font-mono mt-0.5">Expiração</span>
            </div>
          </div>
        </div>

        {/* Expiration Timeline section */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-xl" id="chart-expiration-timeline">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#438AF3] block" />
                <span>Controle Preventivo de Vencimento de Lotes</span>
              </h3>
              <p className="text-xs text-slate-455 mt-0.5 font-mono uppercase tracking-wider">Garantia de pureza de precursores</p>
            </div>
          </div>

          <div className="relative py-2 flex flex-col space-y-4" id="expiration-nodes">
            
            {/* Timeline backbone line */}
            <div className="absolute left-[20px] top-6 bottom-6 w-0.5 bg-slate-800 rounded" />

            {/* Node 1: Vencidos */}
            <div className="flex items-start gap-4 relative z-10" id="node-expired">
              <div className="h-10 w-10 rounded-full bg-red-950/80 border border-red-500/35 flex items-center justify-center font-bold text-xs shadow-lg shadow-red-500/10">
                🚨
              </div>
              <div className="bg-red-950/15 border border-red-500/15 p-3 rounded-xl flex-1 hover:border-red-550/30 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-red-400 font-mono">DETERIORAÇÃO CRÍTICA</span>
                  <span className="text-[9px] font-mono bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-lg">12 Lotes</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
                  Itens como <strong className="text-white">Dispersante NanoG</strong> e <strong className="text-white">Aditivo de Flotação</strong> expiraram. Requer descarte imediato do operador.
                </p>
              </div>
            </div>

            {/* Node 2: Próximos 30 dias */}
            <div className="flex items-start gap-4 relative z-10" id="node-expire-30">
              <div className="h-10 w-10 rounded-full bg-orange-950/80 border border-orange-500/35 flex items-center justify-center font-bold text-xs shadow-lg shadow-orange-500/10 animate-pulse">
                ⚠️
              </div>
              <div className="bg-orange-950/15 border border-orange-500/15 p-3 rounded-xl flex-1 hover:border-orange-550/30 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-orange-400 font-mono">ALERTA PREVENTIVO (30 DIAS)</span>
                  <span className="text-[9px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-lg">18 Lotes</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
                  Precursores e sais minerais expiram ao final de Junho. Pedido de ressuprimento já está em trânsito no SAP.
                </p>
              </div>
            </div>

            {/* Node 3: Saudáveis */}
            <div className="flex items-start gap-4 relative z-10" id="node-safe">
              <div className="h-10 w-10 rounded-full bg-emerald-950/80 border border-emerald-500/35 flex items-center justify-center font-bold text-xs shadow-lg shadow-emerald-500/10">
                ✅
              </div>
              <div className="bg-emerald-950/15 border border-emerald-500/15 p-3 rounded-xl flex-1 hover:border-emerald-550/30 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-400 font-mono">ESTOQUE SEGURO (CONFORME)</span>
                  <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg">140 Lotes</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
                  Precursores de Lítio e NCA com estabilidade e validade certificadas acima de 250 dias.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Dynamic Alerts safety announcement panel - Safety Orange details */}
      <div className="bg-slate-950/45 backdrop-blur-md border border-slate-800/80 text-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl" id="dashboard-notice">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-orange-550/20 text-orange-500 border border-orange-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.15)] shrink-0 animate-pulse">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-sans">Controle de Pureza Laboratorial Ativado</h4>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Cada movimentação física de material crítico e pureza de precursores de bateria exige revalidação física e atualização imediata de racks.
            </p>
          </div>
        </div>
        <button
          onClick={() => onSelectTab(3)}
          className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all uppercase tracking-wider font-mono shadow-[0_0_15px_rgba(255,107,0,0.25)] border border-orange-500/20 cursor-pointer whitespace-nowrap"
        >
          Validar Pureza Agora
        </button>
      </div>

    </div>
  );
}
