/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Layers, 
  Forklift, 
  Info
} from 'lucide-react';
import { Material } from '../types';

interface MapTabProps {
  materials: Material[];
  onSelectMaterial?: (material: Material) => void;
  targetLocation?: string | null;
  setTargetLocation?: (loc: string | null) => void;
}

export default function MapTab({ materials, targetLocation, setTargetLocation }: MapTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStreet, setSelectedStreet] = useState<string>('A');
  const [selectedSlotDetails, setSelectedSlotDetails] = useState<{
    location: string;
    material: Material | null;
  } | null>(null);

  // Auto-fill and transition when redirection occurs from Base de Materiais
  useEffect(() => {
    if (targetLocation) {
      // Formato esperado: RA-A3-P2 -> Extrai Rua 'A'
      const match = targetLocation.match(/RA-([A-L])(\d+)-P(\d+)/i);
      if (match) {
        setSelectedStreet(match[1]);
        const matchedItem = materials.find(m => m.location.toUpperCase() === targetLocation.toUpperCase()) || null;
        setSelectedSlotDetails({
          location: targetLocation,
          material: matchedItem
        });
      }
    }
  }, [targetLocation, materials]);

  const streets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const columns = [1, 2, 3, 4]; // Colunas físicas do rack
  const shelves = [4, 3, 2, 1];   // Prateleiras físicas de cima para baixo (P4, P3, P2, P1)

  // Find material at an absolute address
  const getMaterialAt = (street: string, col: number, shelf: number): Material | null => {
    const address = `RA-${street}${col}-P${shelf}`;
    return materials.find(m => m.location.toUpperCase() === address.toUpperCase()) || null;
  };

  // Perform quick locator search on map
  const handleMapSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search by name, batch or SAP code
    const found = materials.find(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sapCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (found) {
      const loc = found.location; // Ex: RA-A3-P2
      const match = loc.match(/RA-([A-L])(\d+)-P(\d+)/i);
      if (match) {
        const street = match[1];
        setSelectedStreet(street);
        setSelectedSlotDetails({
          location: loc,
          material: found
        });
        if (setTargetLocation) {
          setTargetLocation(loc);
        }
      }
    } else {
      alert('Nenhum composto localizado para este termo no mapa.');
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in" id="map-workspace">
      
      {/* Search and control bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
              Gêmeo Digital de Maquete
            </span>
            <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
              CONEXÃO RF-TEORIE INTEGRADA
            </span>
          </div>
          <h2 className="text-base font-black text-white font-sans mt-1 tracking-tight">
            Mapa de Racks & Endereçamento Físico
          </h2>
        </div>

        {/* Dynamic Search */}
        <form onSubmit={handleMapSearch} className="relative w-full md:w-80 flex gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
              placeholder="Digite composto, lote, SAP..."
            />
          </div>
          <button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Grid mapping both floorplan mockup and selected cabinet module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="map-main-split">
        
        {/* Left Side: Physical floor map */}
        <div className="lg:col-span-4 bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-2xl space-y-4" id="warehouse-miniature">
          <h3 className="text-xs font-bold text-slate-300 font-sans flex items-center gap-2 font-mono uppercase tracking-wider">
            <Layers className="h-4.5 w-4.5 text-orange-500" /> PLANTA DOS CORREDORES DE ESTOCAGEM
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed font-sans">
            Clique em qualquer Rua/Corredor da maquete integrada para focar o grid de slots e prateleiras estruturais:
          </p>

          {/* Graphical layout representing the physical wood board with corridors */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl relative" id="wooden-mockup-blueprint">
            
            {/* Upper docks label */}
            <div className="w-full bg-[#1e293b]/40 text-center py-1 rounded text-[9px] font-bold text-slate-400 tracking-wider font-mono">
              DOCAS DE ACESSO LOGÍSTICO (D002 & D005)
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              {[
                { label: 'RACK AB (Corredor A/B)', strA: 'A', strB: 'B' },
                { label: 'RACK CD (Corredor C/D)', strA: 'C', strB: 'D' },
                { label: 'RACK EF (Corredor E/F)', strA: 'E', strB: 'F' },
                { label: 'RACK GH (Corredor G/H)', strA: 'G', strB: 'H' },
                { label: 'RACK IJ (Corredor I/J)', strA: 'I', strB: 'J' },
                { label: 'RACK KL (Corredor K/L)', strA: 'K', strB: 'L' },
              ].map((rack, idx) => {
                const isSelected = selectedStreet === rack.strA || selectedStreet === rack.strB;
                return (
                  <div 
                    key={idx}
                    className={`p-2 border rounded-xl flex flex-col justify-between h-20 transition-all ${
                      isSelected 
                        ? 'border-orange-500/80 bg-orange-500/5 ring-1 ring-orange-500/30' 
                        : 'border-slate-800/80 bg-slate-900/30 hover:border-slate-700'
                    }`}
                    onClick={() => setSelectedStreet(rack.strA)}
                  >
                    <span className="text-[9px] font-bold text-slate-400 leading-none font-mono truncate">{rack.label}</span>
                    <div className="flex justify-center gap-1.5 mt-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedStreet(rack.strA); }} 
                        className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer font-mono ${selectedStreet === rack.strA ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                      >
                        {rack.strA}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedStreet(rack.strB); }} 
                        className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer font-mono ${selectedStreet === rack.strB ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                      >
                        {rack.strB}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Warehouse zones representing physical structures */}
            <div className="mt-4 grid grid-cols-2 gap-2" id="warehouse-secondary-zones">
              <div className="bg-orange-950/20 border border-orange-500/10 rounded-lg p-1.5 text-center text-[10px] font-sans">
                <span className="font-bold text-orange-400 block">RECEBIMENTO 📥</span>
                <span className="text-slate-500 text-[8px] font-mono">Controle de Pureza</span>
              </div>
              <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-lg p-1.5 text-center text-[10px] font-sans">
                <span className="font-bold text-emerald-400 block">SEPARAÇÃO 📤</span>
                <span className="text-slate-500 text-[8px] font-mono">Consumo da Fábrica</span>
              </div>
            </div>

            {/* Simulated forklifts driving on blueprint floor */}
            <div className="mt-3 flex items-center justify-between bg-slate-950 border border-slate-900 p-2 rounded-xl text-[10px] font-mono text-slate-450" id="floor-telemetry">
              <span className="flex items-center gap-1.5"><Forklift className="h-3.5 w-3.5 text-orange-500 shrink-0" /> Empilhadeira 01</span>
              <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Doca Livre</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 text-xs text-slate-400 font-sans" id="map-color-guide">
            <span className="font-bold block text-slate-200 mb-2 uppercase text-[9px] tracking-wider font-mono">Legenda do Controle de Cores:</span>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-slate-900 border border-slate-800 rounded-full block shrink-0" />
                Vazia (Livre)
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-[#438AF3]/20 border border-[#438AF3]/40 rounded-full block shrink-0 shadow-[0_0_8px_#438AF3]" />
                Composto Seguro
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-orange-500/20 border border-orange-500/40 rounded-full block shrink-0 shadow-[0_0_8px_#ff6b00]" />
                Estoque Crítico
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-red-500/20 border border-red-500/40 rounded-full block shrink-0 shadow-[0_0_8px_#ef4444]" />
                Lote Expirado
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Active street rack module details */}
        <div className="lg:col-span-8 bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-2xl flex flex-col animate-fade-in" id="street-active-rack">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-4 mb-4 gap-2">
            <div>
              <span className="text-[9px] font-bold bg-orange-600 text-white px-2.5 py-1 rounded font-mono uppercase tracking-widest">
                Corredor Ativo: Rua {selectedStreet}
              </span>
              <h2 className="text-sm font-black text-slate-200 mt-1.5 font-sans tracking-tight">Vagas Estruturais do Módulo de Gôndola</h2>
            </div>
            {/* Quick address trace bar preview */}
            {selectedSlotDetails && (
              <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                Foco Ativo: {selectedSlotDetails.location}
              </span>
            )}
          </div>

          {/* Graphical grid representation (Rows of shelves x Columns of compartments) */}
          <div className="flex-1 flex flex-col justify-center" id="slots-interactive-view">
            <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-905" id="rack-matrix">
              
              {/* Shelves rendering: loop over Y axis */}
              {shelves.map(shelf => (
                <div key={shelf} className="flex items-center gap-3">
                  <span className="w-10 text-[9px] text-slate-500 font-mono font-bold uppercase tracking-widest">Prat. {shelf}</span>

                  <div className="flex-1 grid grid-cols-4 gap-3">
                    {/* Columns compartments loop over X axis */}
                    {columns.map(col => {
                      const material = getMaterialAt(selectedStreet, col, shelf);
                      const isTarget = targetLocation?.toUpperCase() === `RA-${selectedStreet}${col}-P${shelf}`.toUpperCase();
                      
                      // Status colors
                      let bgStyle = 'bg-slate-950/40 hover:bg-slate-900/50 text-slate-500 border-slate-850';
                      let dotStyle = 'bg-slate-800';
                      
                      if (material) {
                        if (material.status === 'valid') {
                          bgStyle = `bg-blue-950/20 hover:bg-blue-900/15 text-blue-200 border-[#438AF3]/35 ${isTarget ? 'ring-2 ring-orange-500 shadow-lg' : ''}`;
                          dotStyle = 'bg-[#438AF3] shadow-[0_0_8px_#438AF3]';
                        } else if (material.status === 'critical') {
                          bgStyle = `bg-orange-950/20 hover:bg-orange-900/15 text-orange-200 border-orange-500/45 ${isTarget ? 'ring-2 ring-orange-500 shadow-lg animate-pulse' : ''}`;
                          dotStyle = 'bg-orange-500 shadow-[0_0_8px_#ff6b00]';
                        } else if (material.status === 'expired') {
                          bgStyle = `bg-red-950/20 hover:bg-red-900/15 text-red-200 border-red-500/45 ${isTarget ? 'ring-2 ring-orange-500 shadow-lg animate-bounce' : ''}`;
                          dotStyle = 'bg-red-500 shadow-[0_0_8px_#ef4444]';
                        }
                      }

                      return (
                        <div
                          key={col}
                          onClick={() => {
                            setSelectedSlotDetails({
                              location: `RA-${selectedStreet}${col}-P${shelf}`,
                              material: material
                            });
                            if (setTargetLocation) {
                              setTargetLocation(`RA-${selectedStreet}${col}-P${shelf}`);
                            }
                          }}
                          className={`border rounded-xl p-3 text-center transition-all cursor-pointer h-16 flex flex-col justify-between select-none relative ${bgStyle}`}
                        >
                          {/* Top compartment index */}
                          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 leading-none">
                            <span className="font-bold">Col {col}</span>
                            <span>P{shelf}</span>
                          </div>

                          {/* Content or vacancy */}
                          {material ? (
                            <div className="text-left mt-0.5 overflow-hidden shrink-0">
                              <span className="text-[10px] font-black text-slate-100 block truncate leading-tight">{material.name}</span>
                              <div className="flex items-center gap-1.5 mt-0.5 leading-none">
                                <span className={`h-1.5 w-1.5 rounded-full ${dotStyle} block`} />
                                <span className="text-[8px] font-mono text-slate-400">{material.batch}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[8px] font-mono text-slate-600 block mt-auto uppercase tracking-wide">VAGA LIVRE</span>
                          )}

                          {/* Flash visual finder when highlighted */}
                          {isTarget && (
                            <div className="absolute inset-0 bg-orange-500/10 border-2 border-orange-500 rounded-xl animate-pulse pointer-events-none" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Front end compartment drawer */}
            <div className="mt-4" id="compartment-details-inspector">
              {setSelectedSlotDetails && selectedSlotDetails ? (
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl font-mono text-xs animate-fade-in">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                    <div>
                      <span className="text-[9px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Verificando Endereço: {selectedSlotDetails.location}
                      </span>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mt-1.5">Inspeção Síncrona do Endereço</h4>
                    </div>
                    <button 
                      onClick={() => setSelectedSlotDetails(null)} 
                      className="text-slate-500 hover:text-white font-bold cursor-pointer"
                    >
                      Limpar ×
                    </button>
                  </div>

                  {selectedSlotDetails.material ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3.5" id="inspected-content">
                      <div className="space-y-1">
                        <span className="text-slate-500 text-[9px] uppercase tracking-wider block">Material:</span>
                        <div className="font-bold text-white text-xs">{selectedSlotDetails.material.name}</div>
                        <span className="text-[9px] font-mono text-slate-400 block">SAP {selectedSlotDetails.material.sapCode}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 text-[9px] uppercase tracking-wider block">ID Lote & Validade:</span>
                        <div className="font-bold text-slate-200">Lote: {selectedSlotDetails.material.batch}</div>
                        <span className="text-[9px] text-slate-400 block">Vencimento: {selectedSlotDetails.material.expiryDate}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-500 text-[9px] uppercase tracking-wider block font-bold text-orange-450 animate-pulse">Especificações do Lote:</span>
                        <div className="font-bold text-[#438AF3]">Grau Pureza: {selectedSlotDetails.material.category === 'Embalagem' ? 'N/A' : `${selectedSlotDetails.material.purity}%`}</div>
                        <span className="text-[9px] text-slate-400 block">Operado por: {selectedSlotDetails.material.responsible}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2.5 text-slate-400 italic text-[10.5px] flex items-center gap-2">
                      <Info className="h-4 w-4 text-orange-500" />
                      Espaço livre e pronto para entrada física de compostos e matérias-primas no rack.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs italic font-sans">
                  Selecione qualquer slot do rack de faturamento acima para abrir o dístico e laudo síncronos de quarentena.
                </div>
              )}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
