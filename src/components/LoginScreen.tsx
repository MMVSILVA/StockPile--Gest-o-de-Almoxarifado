/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowRight, Building2, Terminal } from 'lucide-react';
import Logo from './Logo';

interface LoginScreenProps {
  onLoginSuccess: (user: { name: string; registry: string; sector: string }) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [registry, setRegistry] = useState('');
  const [password, setPassword] = useState('');
  const [sector, setSector] = useState('Qualidade');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulated short authentication delay
    setTimeout(() => {
      const sanitizedName = name.trim();
      const sanitizedRegistry = registry.trim();

      // Flexible matching for Mel, but allows custom names as requested
      if (sanitizedName.toLowerCase() === 'João Fulano' && password !== '1234') {
        setError('Senha de homologação inválida. Utilize "1234".');
        setIsLoading(false);
      } else {
        onLoginSuccess({
          name: sanitizedName || '',
          registry: sanitizedRegistry || '',
          sector: sector
        });
      }
    }, 600);
  };

  return (
    <div 
      id="login-immersion-container" 
      className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-slate-100 relative overflow-x-hidden p-4 sm:p-8 select-none"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, #0a1122 0%, #020617 100%)'
      }}
    >
      {/* Absolute Tech Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Decorative neon glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-neon-blue" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main stacked centered content panel */}
      <div className="w-full max-w-lg flex flex-col items-center gap-6 relative z-10" id="login-layout-stack">
        
        {/* Large custom high-contrast white rounded Logo card on top */}
        <div className="w-full max-w-[340px]" id="centered-brand-card">
          <Logo size="lg" withBackground={true} layout="vertical" className="shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-slate-100/10 animate-pulse duration-5000" />
        </div>

        {/* Dynamic Glassmorphic Control panel */}
        <div 
          className="w-full bg-slate-950/65 backdrop-blur-2xl border border-slate-800/85 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-neon-blue"
          id="glass-form-card"
        >
          <div className="mb-6 border-b border-slate-900 pb-4 text-center sm:text-left" id="panel-head">
            <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center justify-center sm:justify-start gap-2.5">
              <Terminal className="h-5 w-5 text-orange-500 animate-pulse" />
              <span>Autenticação</span>
            </h2>
            <p className="text-slate-450 text-xs mt-1.5 font-mono">STOCKPILE · SISTEMA DE RACKS EM TEMPO REAL</p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-xl flex items-center gap-2.5" id="login-error-alert">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping block shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="credentials-form">
            
            {/* Input 1: name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest font-mono">
                Nome do Colaborador
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
                  placeholder="Ex: João Fulano"
                />
              </div>
            </div>

            {/* Input 2: registry */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest font-mono">
                Matrícula de Registro
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={registry}
                  onChange={(e) => setRegistry(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
                  placeholder="Ex: PN1313"
                />
              </div>
            </div>

            {/* Input 3: password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest font-mono">
                Senha de Acesso
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Input 4: sector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest font-mono">
                Setor de Atuação
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Building2 className="h-4.5 w-4.5" />
                </span>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all cursor-pointer appearance-none font-mono"
                >
                  <option value="Qualidade" className="bg-slate-950">Qualidade (Foco Pureza)</option>
                  <option value="Produção" className="bg-slate-950">Produção (EV Battery Linha)</option>
                  <option value="Almoxarifado" className="bg-slate-950">Almoxarifado (Estoque Geral)</option>
                  <option value="Armazenagem" className="bg-slate-950">Armazenagem (Racks e Logística)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,107,0,0.35)] transition-all font-mono text-xs uppercase tracking-wider mt-6 cursor-pointer border border-orange-500/30 font-bold"
            >
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin block" />
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="h-4 w-4 text-white animate-pulse" />
                </>
              )}
            </button>
          </form>

          {/* Real-time Dynamic Credentials Mirror (Matches entered text) */}
          <div className="mt-6 border-t border-slate-900 pt-5 space-y-2.5" id="credentials-helper-mirrored">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider block font-semibold text-center sm:text-left">
              Credenciais Homologadas:
            </span>
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs font-mono text-slate-400 border border-slate-900/60 rounded-xl p-3 bg-slate-950/40">
              <div>Colaborador: <span className="text-orange-400 font-bold">{name.trim() || 'João Fulano'}</span></div>
              <div>Matrícula: <span className="text-orange-400 font-bold">{registry.trim() || 'PN1313'}</span></div>
              <div>Senha: <span className="text-orange-400 font-bold">{password ? '••••••••' : '1234'}</span></div>
              <div>Setor: <span className="text-orange-400 font-bold">{sector}</span></div>
            </div>
          </div>

          {/* Dynamic Quick Login Trigger */}
          <div className="mt-5 text-center" id="demo-quick-auth">
            <button
              onClick={() => onLoginSuccess({ 
                name: name.trim() || 'João Fulano', 
                registry: registry.trim() || 'PN1313', 
                sector: sector 
              })}
              className="text-[10px] w-full bg-slate-900/40 hover:bg-orange-500/10 text-slate-350 hover:text-orange-400 py-2.5 px-4 rounded-xl font-mono font-bold transition-all border border-slate-800/80 hover:border-orange-500/20"
            >
              🚀 Autenticar como {name.trim() || 'João Fulano'} ({sector}) ⚡
            </button>
          </div>
        </div>

        {/* Static Footer (No Gemini references) */}
        <div className="text-[10px] text-slate-550 font-mono tracking-widest text-center uppercase" id="login-footer">
          © 2026 StockPile Logistics System · Terminal de Operações
        </div>
      </div>
    </div>
  );
}
