/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2,
  Cpu,
  Bookmark
} from 'lucide-react';
import { Material, ChatMessage } from '../types';

interface AssistantTabProps {
  materials: Material[];
}

export default function AssistantTab({ materials }: AssistantTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Olá! Sou a **ATHENA**, sua Assistente Inteligente do StockPile. 🔋🤖\n\nEstou conectada ao banco de dados em tempo real e ao sistema SAP da empresa. Como posso otimizar a sua gestão hoje? Se precisar localizar gôndolas físicas, verificar a pureza laboratorial de compostos ou monitorar validades de lotes, basta me perguntar!',
      timestamp: '14:38'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const streamEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: 'msg-u-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          materials: materials 
        })
      });

      const data = await response.json();
      const replyText = data.reply || 'Desculpe, encontrei uma falha ao contatar a inteligência central da Athena.';

      const assistMsg: ChatMessage = {
        id: 'msg-a-' + Date.now(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistMsg]);
    } catch (err) {
      console.error('Error fetching Athena:', err);
      // Fallback local response
      const assistMsg: ChatMessage = {
        id: 'msg-a-err-' + Date.now(),
        sender: 'assistant',
        text: '⚠️ Conectando em modo local alternativo. Estou com dificuldades para alcançar a nuvem, mas conte comigo! Verifique se seu token do Gemini está setado no painel de Secrets.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const clearChat = () => {
    if (window.confirm('Deseja limpar as discussões armazenadas com Athena?')) {
      setMessages([
        {
          id: 'init-1',
          sender: 'assistant',
          text: 'Olá! Sou a **ATHENA**, sua Assistente Inteligente do StockPile. 🔋🤖\nEstou pronta para novas consultas sobre seus materiais críticos e purezas.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Convert markdown-like syntax slightly for beautiful output visualization
  const renderMessageContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let trimmed = line.trim();
      
      // Subtitles
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="text-white font-bold text-xs uppercase tracking-widest mt-3 mb-1.5 font-mono text-orange-400">&gt; {trimmed.replace('###', '').trim()}</h4>;
      }
      if (trimmed.startsWith('##') || trimmed.startsWith('#')) {
        return <h3 key={idx} className="text-sm font-black text-white border-b border-slate-900 pb-1 mt-4 mb-2 font-mono">{trimmed.replace(/##|#/g, '').trim()}</h3>;
      }

      // Checkboxes
      if (trimmed.startsWith('- [x]') || trimmed.startsWith('+ [x]')) {
        return <div key={idx} className="flex items-center gap-2 text-slate-300 text-xs py-0.5 pl-3"><span className="text-emerald-400 font-bold">✔</span> <span>{trimmed.substring(5).trim()}</span></div>;
      }

      // Lists
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        // Look for bold highlights inside list
        const core = trimmed.substring(1).trim();
        return (
          <li key={idx} className="list-disc list-inside ml-2 text-slate-300 text-xs py-1 leading-relaxed">
            {applyBoldHighlight(core)}
          </li>
        );
      }

      // Default apply bold highlight on regular lines
      return <p key={idx} className="text-slate-300 text-xs py-1 leading-relaxed">{applyBoldHighlight(line)}</p>;
    });
  };

  // Quick parser to match text wrapped in ** and make it bold
  const applyBoldHighlight = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-bold text-orange-450">{part}</strong>;
      }
      // Also match inline code wrap `
      const subParts = part.split(/`([^`]+)`/g);
      return subParts.map((sub, j) => {
        if (j % 2 === 1) {
          return <code key={j} className="bg-slate-950 border border-slate-800 text-slate-100 font-mono px-1.5 py-0.5 rounded text-[10px]">{sub}</code>;
        }
        return sub;
      });
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-4 select-none animate-fade-in" id="assistant-tab">
      
      {/* Left pane: Conversational AI main terminal */}
      <div className="lg:col-span-8 bg-slate-950/45 backdrop-blur-md border border-slate-900 rounded-2xl shadow-2xl flex flex-col h-[520px]" id="chat-terminal-view">
        
        {/* Chat header */}
        <div className="p-4 bg-slate-950/30 border-b border-slate-900 flex justify-between items-center" id="chat-header">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-slate-900 text-white rounded-xl flex items-center justify-center border border-slate-800 shadow-md">
              <Cpu className="h-5 w-5 text-orange-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-200 font-sans">Athena AI Assistant</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 block animate-ping" />
              </div>
              <span className="text-[9px] text-slate-500 block font-mono uppercase tracking-widest">Sincronismo Químico Ativo</span>
            </div>
          </div>
          
          <button
            onClick={clearChat}
            className="text-slate-500 hover:text-red-500 p-2 rounded-lg transition-colors cursor-pointer"
            title="Limpar Conversas"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Chat history list stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-955/30" id="chat-scroller">
          {messages.map((msg) => {
            const isAI = msg.sender === 'assistant';
            return (
              <div 
                key={msg.id} 
                className={`flex items-start gap-3 ${
                  isAI ? 'justify-start max-w-2xl' : 'justify-end max-w-md ml-auto'
                }`}
              >
                {isAI && (
                  <div className="h-7 w-7 rounded-lg bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold shrink-0 font-mono">
                    A
                  </div>
                )}
                
                <div className={`p-3.5 rounded-2xl border relative shadow-xl ${
                  isAI 
                    ? 'bg-slate-950/80 border-slate-900 rounded-tl-none text-slate-200' 
                    : 'bg-orange-600/15 border-orange-500/20 rounded-tr-none text-slate-100'
                }`}>
                  {isAI ? (
                    <div className="space-y-1">{renderMessageContent(msg.text)}</div>
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{msg.text}</p>
                  )}
                  
                  <span className={`text-[8px] font-mono block text-right mt-1.5 ${
                    isAI ? 'text-slate-550' : 'text-orange-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3 justify-start max-w-xs animate-pulse" id="ai-typing-indicator">
              <div className="h-7 w-7 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold shrink-0 font-mono">
                A
              </div>
              <div className="bg-slate-950/80 border border-slate-900 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping block" />
                <span className="text-xs text-slate-400 font-mono">Athena está analisando laudos...</span>
              </div>
            </div>
          )}
          
          <div ref={streamEndRef} />
        </div>

        {/* Suggested interactive query cards clicking grid */}
        <div className="p-3 border-t border-slate-900 bg-slate-950/60 grid grid-cols-2 md:grid-cols-4 gap-2 text-left" id="suggested-pills">
          {[
            { tag: 'Lote AC2026-01', query: 'Onde está cadastrado o lote AC2026-01 no estoque?', label: '📍 Localizar AC2026-01' },
            { tag: 'Críticos', query: 'Quais materiais estão com estoque crítico no momento?', label: '🧯 Estoque Crítico?' },
            { tag: 'Vencimentos', query: 'Quais materiais estão vencidos ou próximos de vencer na timeline?', label: '📅 Vencimentos?' },
            { tag: 'Giro', query: 'Faça uma análise rápida do giro de estoque e do desempenho geral do almoxarifado.', label: '📊 Análise Giro?' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.query)}
              className="p-2 border border-slate-900 rounded-xl text-[10px] font-bold font-mono text-slate-400 bg-slate-950 hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/30 text-left transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input submission box */}
        <form onSubmit={handleFormSubmit} className="p-3 border-t border-slate-900 flex items-center gap-2 bg-slate-950" id="input-container">
          <input
            type="text"
            value={input}
            disabled={isTyping}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs placeholder-slate-500 text-slate-100 focus:outline-none focus:border-orange-500 font-mono"
            placeholder="Consulte Athena sobre slots e pureza..."
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="bg-orange-600 hover:bg-orange-500 text-white p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

      </div>

      {/* Right pane: Quick summary panel */}
      <div className="lg:col-span-4 space-y-4" id="chat-sidebar">
        
        {/* Resumo Rápido card */}
        <div className="bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-2xl space-y-4" id="chat-quickres">
          <div className="pb-3 border-b border-slate-900 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-350 uppercase tracking-widest font-mono">Dossiê de Inventário</span>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full uppercase">Sincronizado</span>
          </div>

          <div className="space-y-3 text-[11px] font-mono" id="chat-quickres-counts">
            <div className="flex justify-between items-center p-2.5 bg-slate-950 rounded-xl border border-slate-900">
              <span className="text-slate-500">VALOR TOTAL DO ESTOQUE:</span>
              <strong className="text-slate-150 font-bold">R$ 60.45M</strong>
            </div>
            
            <div className="flex justify-between items-center p-2.5 bg-slate-950 rounded-xl border border-slate-900">
              <span className="text-slate-500">ITENS ATIVOS NO RACK:</span>
              <strong className="text-slate-150 font-bold">170.532</strong>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/20">
              <span className="text-orange-400">MATERIAIS CRÍTICOS:</span>
              <strong className="text-orange-400 font-bold">{materials.filter(m => m.status === 'critical').length + 58}</strong>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-red-500/10 rounded-xl border border-red-500/20">
              <span className="text-red-400 font-bold">ITENS EXPIRADOS:</span>
              <strong className="text-red-400 font-bold">{materials.filter(m => m.status === 'expired').length + 118}</strong>
            </div>
          </div>
        </div>

        {/* Interactive hints from ATHENA */}
        <div className="bg-slate-950/70 text-white p-5 rounded-2xl border border-slate-900 shadow-xl relative overflow-hidden" id="chat-tips">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl" />
          
          <div className="flex items-center gap-2 mb-3">
            <Bookmark className="h-4.5 w-4.5 text-orange-400" />
            <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-350">Dicas da ATHENA</h4>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            "Você sabia? Manter desvios de pureza química de precursores da **POSCO CHEMICAL** logados no SAP reduz inconformidades na linha de montagem das baterias em até **15%**."
          </p>
        </div>

      </div>

    </div>
  );
}
