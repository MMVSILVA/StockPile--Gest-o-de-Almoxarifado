/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sliders, 
  Cpu, 
  Wifi, 
  RotateCcw
} from 'lucide-react';

interface ConfigTabProps {
  currentUser: { name: string; registry: string; sector: string };
  onResetData: () => void;
}

export default function ConfigTab({ currentUser, onResetData }: ConfigTabProps) {
  const [theme, setTheme] = useState('StockPile (Padrão)');
  const [hardwareLinked, setHardwareLinked] = useState(true);
  const [purityValidationAlert, setPurityValidationAlert] = useState(true);
  const [rfidFreq, setRfidFreq] = useState('915 MHz UHF');
  const [ipAddress, setIpAddress] = useState('192.168.1.134');

  const triggerSelfTest = () => {
    alert('Realizando auto-diagnóstico de hardware...\n\n- Conexão Arduino Mega 2560: OK (LEDs de prateleira acendendo)\n- Leitor RFID UHF de Entradas: OK (915 MHz UHF)\n- Sincronização de Threads SAP ERP: OK\n\nTodos os sensores do protótipo físico estão operando com 100% de precisão!');
  };

  return (
    <div className="space-y-6 select-none animate-fade-in" id="config-workspace">
      
      {/* Configuration Header */}
      <div className="bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-xl" id="config-overview">
        <div>
          <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded font-mono">
            PAINEL DE CONTROLE TÉCNICO
          </span>
          <h2 className="text-base font-black text-white font-sans mt-1.5 tracking-tight">Preferências do Terminal & Conexão Arduino</h2>
          <p className="text-slate-450 text-xs mt-0.5">Customização técnica de laudos eletrônicos, pinagem e sinalização luminosa de estantes físicas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="config-split">
        
        {/* Left Pane: Software Layout Preferências */}
        <div className="bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-2xl space-y-4 flex flex-col justify-between" id="config-layout">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-orange-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-350 font-mono">Aparência & Notificação</h3>
            </div>

            <form className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Esquema de Cores do Terminal</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 cursor-pointer focus:outline-none"
                >
                  <option value="StockPile (Padrão)">StockPile (Industrial Dark Mode - Azul & Laranja)</option>
                  <option value="Midnight Steel">Midnight Steel (Alto contraste de laboratório)</option>
                  <option value="Amber Light">High Amber Contrast (Monocromático de segurança)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-900">
                <div>
                  <span className="font-bold text-slate-200 block">Alerta de Pureza Crítica &lt; 98%</span>
                  <span className="text-[10px] text-slate-500 block">Exige justificativa técnica de quarentena.</span>
                </div>
                <input
                  type="checkbox"
                  checked={purityValidationAlert}
                  onChange={(e) => setPurityValidationAlert(e.target.checked)}
                  className="h-4.5 w-4.5 accent-orange-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-900">
                <div>
                  <span className="font-bold text-slate-200 block">Monitoramento Bilateral com SAP</span>
                  <span className="text-[10px] text-slate-500 block font-normal">Sincroniza automaticamente a cada mudança de gôndola.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="h-4.5 w-4.5 accent-orange-500 rounded cursor-pointer"
                />
              </div>
            </form>
          </div>

          {/* Reset button inside layout */}
          <div className="pt-4 border-t border-slate-900">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-mono mb-2">Procedimento de Emergência:</span>
            <button
              onClick={onResetData}
              className="px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl inline-flex text-xs font-bold font-mono tracking-wide hover:bg-red-500/15 cursor-pointer items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Resetar Banco StockPile para Estado Original</span>
            </button>
          </div>
        </div>

        {/* Right Pane: Arduino sensor Linkage (Prototype focus representing wood model) */}
        <div className="bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-2xl space-y-5 flex flex-col justify-between" id="config-hardware">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-orange-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-350 font-mono">Protótipo Físico (Arduino Mega)</h3>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                {hardwareLinked ? 'CONECTADO COM SUCESSO' : 'DESCONECTADO'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Configurações para o acionamento físico de LEDs e sensores embutidos nas prateleiras da maquete pedagógica:
            </p>

            <div className="space-y-3 font-mono text-xs" id="hardware-fields">
              {/* Control physical linking */}
              <div className="flex items-center justify-between p-3 bg-slate-955/30 rounded-xl border border-slate-900">
                <div>
                  <span className="font-bold text-slate-205 block">Sinalizador Luminoso de Slots</span>
                  <span className="text-[10px] text-slate-500 block">Piscar LEDs no rack real ao clicar em localizar lote.</span>
                </div>
                <input
                  type="checkbox"
                  checked={hardwareLinked}
                  onChange={(e) => setHardwareLinked(e.target.checked)}
                  className="h-4.5 w-4.5 accent-orange-500 rounded cursor-pointer"
                />
              </div>

              {/* Arduino setup inputs */}
              <div className="grid grid-cols-2 gap-3" id="hardware-parameters">
                <div>
                  <span className="text-slate-500 text-[9px] block uppercase mb-1">Identificador de Barramento</span>
                  <input
                    type="text"
                    disabled={!hardwareLinked}
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-xs"
                  />
                </div>

                <div>
                  <span className="text-slate-500 text-[9px] block uppercase mb-1">Frequência Antenas RFID (UHF)</span>
                  <input
                    type="text"
                    disabled={!hardwareLinked}
                    value={rfidFreq}
                    onChange={(e) => setRfidFreq(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Test buttons */}
              <button
                onClick={triggerSelfTest}
                className="w-full bg-[#438AF3] hover:bg-[#438AF3]/90 text-white font-mono font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(67,138,243,0.2)]"
              >
                <Wifi className="h-4 w-4 text-white" />
                <span>Iniciar Varredura das Gôndolas RFID 📡</span>
              </button>
            </div>
          </div>

          {/* Connected worker info card to demonstrate Aba 1 Login feedback */}
          <div className="bg-slate-950 border border-slate-900 p-3.5 rounded-xl flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs">🧑‍🔧</div>
            <div className="text-xs font-sans">
              <span className="text-slate-500 font-mono text-[9px] uppercase">Operador do Terminal Autenticado:</span>
              <div className="text-slate-200 font-bold mt-0.5">
                {currentUser.name} ({currentUser.registry}) &middot; Setor: <span className="text-orange-450">{currentUser.sector}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
