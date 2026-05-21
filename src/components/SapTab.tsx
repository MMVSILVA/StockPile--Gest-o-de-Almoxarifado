/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  RefreshCw, 
  Sliders, 
  Database, 
  FileLock2 
} from 'lucide-react';
import { SAP_LOGS } from '../data/materialsData';

export default function SapTab() {
  const [logsList, setLogsList] = useState(SAP_LOGS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sapData, setSapData] = useState({
    purchaseOrder: '2167',
    costCenter: '23.000',
    status: 'Em andamento',
    invoice: '3456789',
    orderNumber: 'PED-SAP-2026-4412'
  });

  const triggerSapSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // Add custom log to state
      const newLog = {
        id: 'slog-' + Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        type: 'Sincronização',
        message: `Sincronismo completo do Estoque Real com Ordem SAP #${sapData.purchaseOrder}. Integridade de pureza homologada.`,
        status: 'success'
      };
      
      setLogsList([newLog, ...logsList]);
      setIsSyncing(false);
      alert('Sincronização completa realizada com sucesso entre StockPile e o Banco de Dados SAP R/3!');
    }, 1200);
  };

  const handleUpdateStatus = (newStatus: string) => {
    setSapData({ ...sapData, status: newStatus });
    
    const newLog = {
      id: 'slog-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'Status-Update',
      message: `Status da Ordem de Compra alterada para [${newStatus}] por Mel.`,
      status: 'success'
    };
    setLogsList([newLog, ...logsList]);
  };

  return (
    <div className="space-y-6 select-none animate-fade-in" id="sap-workspace">
      
      {/* Upper overview header */}
      <div className="bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="sap-overview">
        <div>
          <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded font-mono">
            GATEWAY DE INTEGRAÇÃO ERPOPTIMA
          </span>
          <h2 className="text-base font-black text-white font-sans mt-1.5 tracking-tight">Conector SAP ERP Gateway v4.8</h2>
          <p className="text-slate-450 text-xs mt-0.5">Sincronizador bilateral de ordens de compra, centros de custos e laudos de ensaios de pureza.</p>
        </div>
        <button
          onClick={triggerSapSync}
          disabled={isSyncing}
          className="bg-orange-600 hover:bg-orange-500 disabled:bg-orange-850/50 text-white font-mono font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(255,107,0,0.25)] border border-orange-500/20 disabled:cursor-not-allowed"
        >
          {isSyncing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>Forçar Sincronismo SAP ⚡</span>
        </button>
      </div>

      {/* Split layout: parameters card & diagnostic events logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="sap-split">
        
        {/* Left pane: Active Order details */}
        <div className="lg:col-span-5 bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-2xl space-y-5 flex flex-col" id="sap-parameters-box">
          <div className="pb-3 border-b border-slate-900 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-orange-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono">Parâmetros Ativos da Ordem</h3>
          </div>

          <div className="space-y-4 flex-1" id="sap-fields">
            {/* Pedido SAP identifier */}
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl">
              <span className="text-[9px] text-slate-500 font-mono block uppercase">IDENTIFICADOR DO PEDIDO SAP</span>
              <strong className="text-white text-xs font-mono tracking-wide mt-0.5 block">{sapData.orderNumber}</strong>
            </div>

            {/* Active grid parameters */}
            <div className="grid grid-cols-2 gap-3" id="sap-order-grid">
              
              <div className="bg-slate-955/40 p-3 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Ordem de Compra</span>
                <strong className="text-slate-200 text-xs font-mono mt-0.5 block">{sapData.purchaseOrder}</strong>
              </div>

              <div className="bg-slate-955/40 p-3 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Centro de Custo</span>
                <strong className="text-slate-200 text-xs font-mono mt-0.5 block">{sapData.costCenter}</strong>
              </div>

              <div className="bg-slate-955/40 p-3 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Nota Fiscal</span>
                <strong className="text-slate-200 text-xs font-mono mt-0.5 block">{sapData.invoice}</strong>
              </div>

              <div className="bg-slate-955/40 p-3 rounded-xl border border-slate-900">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Status SAP</span>
                <span className={`inline-block text-[10px] font-bold font-mono mt-1 px-2.5 py-0.5 rounded-full ${
                  sapData.status === 'Em andamento' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-[0_0_8px_rgba(249,115,22,0.1)]' :
                  sapData.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {sapData.status}
                </span>
              </div>

            </div>
          </div>

          {/* Interactive ERP Control actions */}
          <div className="pt-4 border-t border-slate-900 space-y-3" id="sap-erp-controls">
            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block font-mono">Modificar Estado no SAP ERP:</span>
            
            <div className="grid grid-cols-3 gap-2 text-center" id="status-controller">
              <button
                onClick={() => handleUpdateStatus('Em andamento')}
                className={`py-2 rounded-xl text-[10px] font-bold font-mono transition-colors cursor-pointer border ${
                  sapData.status === 'Em andamento' ? 'bg-orange-600 text-white border-orange-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                ANDAMENTO
              </button>
              <button
                onClick={() => handleUpdateStatus('Concluído')}
                className={`py-2 rounded-xl text-[10px] font-bold font-mono transition-colors cursor-pointer border ${
                  sapData.status === 'Concluído' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                CONCLUÍDO
              </button>
              <button
                onClick={() => handleUpdateStatus('Pendente')}
                className={`py-2 rounded-xl text-[10px] font-bold font-mono transition-colors cursor-pointer border ${
                  sapData.status === 'Pendente' ? 'bg-yellow-600 text-white border-yellow-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                PENDENTE
              </button>
            </div>
          </div>
        </div>

        {/* Right pane: Ledger and synchronization diagnostics outputs */}
        <div className="lg:col-span-7 bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-2xl flex flex-col" id="sap-diagnostics">
          <div className="pb-3 border-b border-slate-900 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="h-4.5 w-4.5 text-orange-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-350 font-mono">Logs de Auditoria e Integração SAP</h3>
            </div>
            <span className="text-[9px] font-mono bg-slate-950 text-slate-500 border border-slate-900 px-2.5 py-1 rounded-lg">
              {logsList.length} EVENTOS REGISTRADOS
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-72 text-xs font-mono" id="sap-logs-stream">
            {logsList.map(log => (
              <div 
                key={log.id} 
                className="bg-slate-950 text-slate-400 p-3 rounded-xl border border-slate-900/60 relative overflow-hidden flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-[11px] leading-relaxed animate-fade-in"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] text-[#438AF3] font-bold tracking-wider">&gt; [{log.type}]</span>
                    <span className="text-[9px] text-slate-600">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300">{log.message}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1.5" id="log-status">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 block animate-ping" />
                  <span className="text-[8px] text-emerald-400 font-bold tracking-widest uppercase">SYNC</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-slate-950/60 border border-slate-900 p-4 rounded-xl text-xs flex items-center justify-between" id="sap-telemetry-status">
            <div className="flex items-center gap-2.5" id="db-conn-indicator">
              <FileLock2 className="h-4.5 w-4.5 text-slate-500" />
              <div>
                <span className="font-bold text-slate-300 block">Sincronismo SOAP/WebServices</span>
                <span className="text-[10px] text-slate-500 font-mono">Protocolo HTTPS SSL 256 bits ativo</span>
              </div>
            </div>
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded font-mono">
              ONLINE
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
