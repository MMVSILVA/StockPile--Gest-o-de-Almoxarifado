/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.warn('GEMINI_API_KEY is not defined. Falling back to simulated smart mode.');
    return null;
  }
  
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.error('Failed to initialize GoogleGenAI client:', err);
      return null;
    }
  }
  return aiClient;
}

// Simulated local intelligence fallback when GEMINI_API_KEY is missing
function handleLocalMockAI(query: string, materials: any[]): string {
  const norm = query.toLowerCase();
  
  // Expiry check
  if (norm.includes('vencid') || norm.includes('validad') || norm.includes('vence')) {
    const expired = materials.filter(m => m.status === 'expired');
    if (expired.length > 0) {
      return `### Alerta de Validade ⚠️\nIdentifiquei **${expired.length}** materiais vencidos:\n\n` +
        expired.map(m => `- **${m.name}** (Lote: \`${m.batch}\`) vencido em *${m.expiryDate}* na localização \`${m.location}\`.`).join('\n') +
        `\n\nRecomendo isolar e encaminhar estes itens imediatamente para descarte seguro ou refugo.`;
    }
    return `Todos os materiais atualmente cadastrados estão com prazos de validade regulares. Muito bom!`;
  }
  
  // Critical stock check
  if (norm.includes('crític') || norm.includes('baixo') || norm.includes('reposiç')) {
    const critical = materials.filter(m => m.status === 'critical');
    if (critical.length > 0) {
      return `### Alerta de Estoque Crítico 🧯\nAtualmente temos **${critical.length}** materiais abaixo do limite mínimo:\n\n` +
        critical.map(m => `- **${m.name}**: Atualmente com \`${m.quantity}\` (Mínimo: ${m.criticalLimit} ${m.unit}). Está na localização \`${m.location}\`.`).join('\n') +
        `\n\nPara segurança da produção, convém acionar o fornecedor para reposição imediata.`;
    }
    return `Excelente! Nenhum material está com estoque crítico no momento.`;
  }
  
  // Specific lot search
  const batchRegex = /lote\s+([a-zA-Z0-9\-]+)/i;
  const match = norm.match(batchRegex);
  if (match && match[1]) {
    const searchBatch = match[1].trim().toLowerCase();
    const item = materials.find(m => m.batch.toLowerCase() === searchBatch);
    if (item) {
      return `### Lote Localizado ✅\nEncontrei informações detalhadas para o lote **${item.batch}**:\n` +
        `- **Material**: ${item.name} (${item.sapCode})\n` +
        `- **Quantidade**: ${item.quantity}\n` +
        `- **Localização Física**: \`${item.location}\` (Setor correspondente no protótipo físico)\n` +
        `- **Pureza Validada**: **${item.purity}%**\n` +
        `- **Status**: ${item.status === 'valid' ? '✅ Regular' : item.status === 'critical' ? '⚠️ Crítico' : '🛑 Vencido'}\n` +
        `- **Validade**: ${item.expiryDate}\n` +
        `- **Fornecedor**: ${item.supplier}\n\nO que mais deseja saber sobre este item?`;
    }
  }

  // Pureness check
  if (norm.includes('purez') || norm.includes('teor') || norm.includes('pureza')) {
    const withPurity = [...materials].sort((a,b) => b.purity - a.purity);
    return `### Relatório de Validação de Pureza 🧪\nTodos os nossos compostos críticos passam por processos rigorosos de auditorias de pureza. Itens com maior grau de pureza:\n\n` +
      withPurity.map(m => `- **${m.name}** (Lote: \`${m.batch}\`): **${m.purity}%** de pureza química.`).join('\n') +
      `\n\n*Nota: O material **NCA** da **POSCO CHEMICAL** possui teor validado de 98.5%, ideal para baterias de alta performance EV.*`;
  }

  // Material name search
  for (const m of materials) {
    if (norm.includes(m.name.toLowerCase()) || norm.includes(m.sapCode.toLowerCase())) {
      return `### Detalhes do Item: ${m.name} 📦\n` +
        `- **Código SAP**: ${m.sapCode}\n` +
        `- **Quantidade**: ${m.quantity} (Limite de segurança: ${m.criticalLimit} ${m.unit})\n` +
        `- **Endereço no Estoque**: \`${m.location}\` (Rua ${m.location.split('-')[1]?.substring(0,1)}, Coluna ${m.location.split('-')[1]?.substring(1,2)}, Prateleira ${m.location.split('-')[2]})\n` +
        `- **Pureza de Laboratório**: ${m.purity}%\n` +
        `- **Responsável**: ${m.responsible}\n` +
        `- **Situação**: ${m.status === 'valid' ? 'Disponível ✅' : m.status === 'critical' ? 'Estoque Crítico ⚠️' : 'Vencido 🛑'}\n\nVocê pode editar ou visualizar a nota fiscal deste produto na aba **Base de Materiais**.`;
    }
  }

  // General Performance analysis
  if (norm.includes('desempenh') || norm.includes('anális') || norm.includes('giro') || norm.includes('ajuda')) {
    return `### Visão Geral de Desempenho do Estoque 📊\n` +
      `- **Giro de Estoque**: **3.2** (Indica uma renovação saudável de estoque para o setor de baterias)\n` +
      `- **Valor Total Declarado**: **R$ 60.450.000**\n` +
      `- **Itens Monitorados**: **${materials.length} categorias de materiais** com rastreabilidade total.\n\nExperimente fazer perguntas específicas sobre as localizações (ex: "Onde está o lote AC2026-01?"), puridades químicas ou estoques vencidos para testar Athena!`;
  }

  // Greeting
  return `Olá! Eu sou a **ATHENA**, sua Assistente Virtual do StockFlow. 🔋🤖\n\nEstou integrada ao banco de dados e ao sistema SAP da empresa. Posso te ajudar com:\n` +
    `- 📍 **Localização exata** de qualquer lote no estoque físico.\n` +
    `- 🧪 Consulta instantânea da **validação de pureza**.\n` +
    `- 🔔 Alertas rápidos sobre **estoques críticos** ou **materiais vencidos**.\n` +
    `- 📊 **Análise de desempenho** do giro de estoque.\n\nO que você gostaria de consultar agora?`;
}

// Helper to call Gemini with automatic retry and model fallbacks when facing temporary 503/high-demand
async function generateContentWithRetry(
  client: GoogleGenAI, 
  baseParams: { contents: any; config?: any }
) {
  const modelsToTry = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    let delay = 600;
    const maxRetries = 2; // 3 attempts total per model

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini] Attempting model "${model}" (attempt ${attempt + 1}/${maxRetries + 1})...`);
        const response = await client.models.generateContent({
          ...baseParams,
          model: model,
        });
        console.log(`[Gemini] Success using model "${model}"`);
        return response;
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini] Model "${model}" attempt ${attempt + 1} failed:`, err.message || err);

        const isLastModel = model === modelsToTry[modelsToTry.length - 1];
        if (attempt < maxRetries || !isLastModel) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
        }
      }
    }
  }

  throw lastError;
}

// API endpoint for chat assistant (ATHENA)
app.post('/api/chat', async (req, res) => {
  const { message, materials } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Mensagem não fornecida.' });
  }

  const client = getGeminiClient();
  const dbMaterials = materials || [];

  if (!client) {
    // Return friendly local simulated response if API key is not set
    const mockReply = handleLocalMockAI(message, dbMaterials);
    // Add a slight latency to simulate assistant thinking
    await new Promise(resolve => setTimeout(resolve, 800));
    return res.json({ reply: mockReply });
  }

  try {
    const formattedDate = new Date().toISOString().split('T')[0];
    
    // Construct rich contextual environment for Gemini
    const systemPrompt = `Você é a ATHENA, assistente inteligente corporativa da StockFlow, um sistema de controle de armazenagem focado em materiais críticos e validação de pureza para células de baterias EV de alta tecnologia.
Seu tom é técnico, prestativo, profissional e objetivo, usando termos como "almoarifado", "laudo de pureza", "Rua/Coluna/Prateleira" e referências ao protótipo físico de demonstração de prateleiras Blue/Orange (com Ruas de A a L, Doca de Recebimento, Separação, etc).

Regras cruciais de resposta:
- Hoje é ${formattedDate}.
- Responda SEMPRE em português brasileiro.
- Use formatação Markdown elegante e limpa para organizar as informações (com títulos, tópicos e negritos).
- Evite divulgar informações confidenciais do sistema fora do escopo, mantenha o foco puramente no gerenciamento do estoque, rastreabilidade, pureza, estoque crítico e alertas.
- Você tem acesso direto ao banco de dados ATUAL de materiais em tempo real enviado pelo cliente.

Aqui está o estado exato e completo do nosso estoque neste segundo:
${JSON.stringify(dbMaterials, null, 2)}

Use estas informações precisas para responder de forma factual. Se o usuário perguntar por um lote (ex: Lote AC2026-01), busque-o na propriedade "batch" de cada item, identifique sua localização (e.g. RA-A3-P2) e explique de que material se trata, o status, a pureza química e as recomendações de segurança. Se o material estiver vencido ou crítico, destaque isso com emojis de alerta.`;

    const response = await generateContentWithRetry(client, {
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      }
    });

    const reply = response.text || 'Desculpe, não consegui formular uma resposta no momento.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    // Fall back gracefully to local mock intelligence so user never experiences complete downtime
    const fallbackReply = `[Athena em Modo Offline - Erro de Conexão] \n\nInstabilidade de rede detectada, mas consigo operar localmente!\n\n` + handleLocalMockAI(message, dbMaterials);
    res.json({ reply: fallbackReply });
  }
});

// Serve static elements or run Vite development middleware
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in development mode.');
  } else {
    // Production builds
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving compiled static items in production mode.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StockFlow Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
