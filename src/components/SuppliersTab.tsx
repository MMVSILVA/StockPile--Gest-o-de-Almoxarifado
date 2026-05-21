/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Globe, 
  Clock, 
  Truck, 
  AlertTriangle, 
  ShieldCheck, 
  Leaf, 
  ChevronRight, 
  Activity, 
  Bot, 
  Zap, 
  CheckCircle2, 
  Award, 
  Calendar,
  Navigation,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface RoutePoint {
  name: string;
  desc: string;
  done: boolean;
  time: string;
}

interface EnrichedSupplier {
  id: string;
  name: string;
  sector: string;
  locationName: string;
  material: string;
  status: 'active' | 'transit' | 'delayed' | 'delivered';
  statusText: string;
  leadTime: number; // in days
  trackingId: string;
  eta: string;
  coordinates: { x: number; y: number }; // SVG map absolute projection
  routePoints: RoutePoint[];
  reliability: number;
  permissions: string[];
  movements: string[];
  aiInsight?: string;
}

const ENRICHED_SUPPLIERS_DATA: EnrichedSupplier[] = [
  {
    id: 'sup-novonix',
    name: 'NOVONIX',
    locationName: 'Tennessee, EUA',
    coordinates: { x: 190, y: 130 },
    sector: 'Ânodos de Grafite',
    material: 'Grafite Sintético Especial',
    status: 'active',
    statusText: 'Produção Ativa 🟢',
    leadTime: 14,
    trackingId: 'TRK-NVX-2026',
    eta: '04 de Junho, 2026',
    reliability: 98.7,
    permissions: [
      'Homologação Automotiva EV',
      'Despacho Aduaneiro Simplificado',
      'Certificado de Baixo Carbono'
    ],
    movements: [
      'Início de moagem térmica de alta pureza no reator 4',
      'Emissão de laudo de condutividade por espectrometria'
    ],
    routePoints: [
      { name: "Fábrica Novonix (Chattanooga)", desc: "Moagem e grafitização concluídas", done: true, time: "2026-05-20 08:00" },
      { name: "Porto de Charleston, SC", desc: "Consolidando carga em contêiner hermético", done: true, time: "2026-05-21 11:30" },
      { name: "Rastreamento Atlântico", desc: "Embarque programado no navio AtlasVessel", done: false, time: "Aguardando" },
      { name: "Terminal de Santos, BR", desc: "Chegada estoque quarentena", done: false, time: "Estimado: 04/06" }
    ],
    aiInsight: "Novonix concluiu o refino térmico com 99.92% de pureza homologada. O lote de grafite sintético encontra-se em trâmite de despacho portuário acelerado."
  },
  {
    id: 'sup-sila',
    name: 'Sila Nanotechnologies',
    locationName: 'Califórnia, EUA',
    coordinates: { x: 130, y: 140 },
    sector: 'Ânodos de Silício',
    material: 'Silício Estruturado Titan',
    status: 'transit',
    statusText: 'Em Transporte 🟡',
    leadTime: 18,
    trackingId: 'TRK-SLA-987X',
    eta: '30 de Maio, 2026',
    reliability: 97.5,
    permissions: [
      'Controle Especial de Atmosfera Estável',
      'Conexão API IoT Ativa nos Contêineres de Carga'
    ],
    movements: [
      'Estabilização de carga sob atmosfera de nitrogênio líquido',
      'Trânsito costeiro pacífico iniciado com sucesso'
    ],
    routePoints: [
      { name: "California Tech Complex", desc: "Despachado e lacrado com tag RFID", done: true, time: "2026-05-18 10:45" },
      { name: "Porto de Los Angeles", desc: "Carregamento concluído no porão do EverStar", done: true, time: "2026-05-19 14:00" },
      { name: "Canal do Panamá", desc: "Passagem prioritária liberada", done: true, time: "2026-05-21 02:30" },
      { name: "Terminal de Santos, BR", desc: "Faturamento aduaneiro e transporte rodoviário", done: false, time: "Estimativa: 30/05" }
    ],
    aiInsight: "Sila Nanotechnologies encontra-se na altura do Canal de Panamá. Os sensores de temperatura integrados operam em normatização de 22°C adequados ao material."
  },
  {
    id: 'sup-quantum',
    name: 'QuantumChem Logistics',
    locationName: 'Berlim, Alemanha',
    coordinates: { x: 440, y: 110 },
    sector: 'Eletrólitos Gel',
    material: 'Eletrólito Gel Térmico',
    status: 'delayed',
    statusText: 'Envio Atrasado 🔴',
    leadTime: 22,
    trackingId: 'TRK-QTM-8822',
    eta: '08 de Junho, 2026 (Atraso de 48h)',
    reliability: 84.2,
    permissions: [
      'Protocolos Corrosivos Classe 3',
      'Inspeção Documental Aduaneira Especial'
    ],
    movements: [
      'Desvio de rota marítimo para contorno do Cabo da Boa Esperança',
      'Laudo químico de quarentena emitido síncronamente'
    ],
    routePoints: [
      { name: "Darmstadt Warehouse Berlin", desc: "Carga consolidada e auditada", done: true, time: "2026-05-15 11:00" },
      { name: "Canal de Suez", desc: "Tráfego marítimo severamente interrompido", done: true, time: "2026-05-21 07:00" },
      { name: "Estreito de Gibraltar", desc: "Aguardando reposicionamento da transportadora", done: false, time: "Retido" },
      { name: "Terminal de Santos, BR", desc: "Reacomodação emergencial no estoque crítico", done: false, time: "Adiado para 08/06" }
    ],
    aiInsight: "O fornecedor QuantumChem apresentou atraso de 2 dias devido a congestionamento logístico internacional no Canal de Suez. Sugerimos acionar imediatamente o lote de contingência de Eletrólito Gel no Rack físico estrutural RA-F2-P2."
  },
  {
    id: 'sup-posco',
    name: 'POSCO CHEMICAL',
    locationName: 'Pohang, Coreia do Sul',
    coordinates: { x: 670, y: 150 },
    sector: 'Materiais Catódicos',
    material: 'NCA Ativo Especial para Baterias',
    status: 'active',
    statusText: 'Produção Ativa 🟢',
    leadTime: 12,
    trackingId: 'TRK-POS-4122',
    eta: '02 de Junho, 2026',
    reliability: 99.4,
    permissions: [
      'Produção e Sinterização em Massa EV',
      'Integração de Faturamento Eletrônico SAP R/3',
      'Certificados de Pureza e Selo Verde On-line'
    ],
    movements: [
      'Síntese química de alta capacidade por coprecipitação',
      'Sincronização de ordem de compra no SAP integrado'
    ],
    routePoints: [
      { name: "Pohang Complex Industrial I", desc: "Composto químico em estágio de secagem", done: true, time: "2026-05-20 22:30" },
      { name: "Porto de Busan", desc: "Aguardando navio cargueiro PacifClass", done: false, time: "Estimado: 23/05" },
      { name: "Terminal de Santos, BR", desc: "Entrega direta no terminal rodoviário", done: false, time: "Estimativa" }
    ],
    aiInsight: "POSCO Chemical opera com 100% de capacidade nominal ativa sem interrupções. Ótima fluidez de lead time."
  },
  {
    id: 'sup-merck',
    name: 'Merck S.A.',
    locationName: 'Darmstadt, Alemanha',
    coordinates: { x: 420, y: 120 },
    sector: 'Reagentes Analíticos',
    material: 'Ácido Clorídrico e Solventes P.A.',
    status: 'delivered',
    statusText: 'Entregue Concluído 🔵',
    leadTime: 5,
    trackingId: 'TRK-MCK-1313',
    eta: 'Entregue em 20 de Maio, 2026',
    reliability: 98.2,
    permissions: [
      'Laudos de Pureza Certificada e Controle Químico',
      'Inspeção Sanitária Simplificada no Porto Aliviado'
    ],
    movements: [
      'Despacho concluído por via aérea expressa com sucesso',
      'Validação de pureza consolidada no recebimento físico'
    ],
    routePoints: [
      { name: "Darmstadt Central Dist.", desc: "Faturamento e embarque aéreo de reagentes analíticos", done: true, time: "2026-05-18 09:00" },
      { name: "Aeroporto de Guarulhos (GRU)", desc: "Desembaraço sanitário rápido pela ANVISA", done: true, time: "2026-05-19 14:30" },
      { name: "Centro de Distribuição StockPile", desc: "Controle e armazenamento final no Rack RA-C3-P1", done: true, time: "2026-05-20 16:00" }
    ],
    aiInsight: "Carga entregue com sucesso e pureza atestada a 99.8%. Lote encontra-se armazenado estrategicamente na prateleira P1 do Corredor C."
  },
  {
    id: 'sup-tesla',
    name: 'Tesla',
    locationName: 'Austin, Texas, EUA',
    coordinates: { x: 165, y: 145 },
    sector: 'Automotivo',
    material: 'Integração de baterias',
    status: 'active',
    statusText: 'Produção Ativa 🟢',
    leadTime: 10,
    trackingId: 'TRK-TSL-0033',
    eta: '08 de Junho, 2026',
    reliability: 99.1,
    permissions: [
      'Parceira estratégica para células de bateria EV (Reuters)',
      'Inspeção Integrada de Sólidos'
    ],
    movements: [
      'Integração de módulos de bateria cilíndricos 4680',
      'Alinhamento com faturamento no SAP'
    ],
    routePoints: [
      { name: "Tesla Giga Texas", desc: "Montagem final dos packs de células de alta capacidade", done: true, time: "2026-05-20 18:00" },
      { name: "Hub de Distribuição Houston", desc: "Pronto para embarque rápido aeroviário", done: false, time: "Aguardando" }
    ],
    aiInsight: "Fábrica da Tesla em Austin opera em capacidade ótima. Os packs de células prismáticas de alta densidade de energia estão sendo integrados prioritariamente com a Panasonic."
  },
  {
    id: 'sup-lgchem',
    name: 'LG Chem',
    locationName: 'Yeosu, Coreia do Sul',
    coordinates: { x: 673, y: 140 },
    sector: 'Químicos',
    material: 'Materiais avançados',
    status: 'transit',
    statusText: 'Em Transporte 🟡',
    leadTime: 15,
    trackingId: 'TRK-LGC-4455',
    eta: '05 de Junho, 2026',
    reliability: 98.0,
    permissions: [
      'Atua no mercado global para baterias e química industrial (Reuters)',
      'Desembaraço Prioritário de Compostos'
    ],
    movements: [
      'Despacho marítimo de solventes e precursores ativos',
      'Registro de licença química aduaneira'
    ],
    routePoints: [
      { name: "LG Chem Yeosu Complex", desc: "Sinterização e lavagem ácida concluídas", done: true, time: "2026-05-18 12:00" },
      { name: "Porto de Busan", desc: "Embarcado sob temperatura regulada", done: true, time: "2026-05-20 16:30" },
      { name: "Terminal de Santos, BR", desc: "Aguardando desembarque costeiro", done: false, time: "ETA 05/06" }
    ],
    aiInsight: "A remessa de precursores químicos avançados da LG Chem está em trânsito estável no Pacífico. Sensores telemétricos indicam conformidade total de temperatura."
  },
  {
    id: 'sup-catl',
    name: 'CATL',
    locationName: 'Ningde, China',
    coordinates: { x: 640, y: 160 },
    sector: 'Baterias',
    material: 'Células de lítio',
    status: 'active',
    statusText: 'Produção Ativa 🟢',
    leadTime: 20,
    trackingId: 'TRK-CTL-1011',
    eta: '12 de Junho, 2026',
    reliability: 99.3,
    permissions: [
      'Referência global no setor de baterias EV (Reddit)',
      'Licenciamento LFP Integrado'
    ],
    movements: [
      'Montagem robotizada de células prismáticas de ferro-fosfato',
      'Emissão de certificados digitais de pegada de carbono zero'
    ],
    routePoints: [
      { name: "CATL Ningde HQ", desc: "Inspeção de carga e ciclagens de células finalizada", done: true, time: "2026-05-21 02:00" },
      { name: "Porto de Xangai", desc: "Embarque portuário em navio cargueiro", done: false, time: "Aguardando" }
    ],
    aiInsight: "CATL opera sem gargalos logísticos locais. Células de lítio LFP de baixo estresse térmico com homologação automotiva ativa."
  },
  {
    id: 'sup-toyota',
    name: 'Toyota',
    locationName: 'Toyota City, Japão',
    coordinates: { x: 690, y: 135 },
    sector: 'Automotivo',
    material: 'Desenvolvimento de baterias',
    status: 'active',
    statusText: 'Produção Ativa 🟢',
    leadTime: 12,
    trackingId: 'TRK-TOY-2234',
    eta: '03 de Junho, 2026',
    reliability: 97.8,
    permissions: [
      'Joint venture em pesquisas de baterias avançadas (Financial Times)',
      'Selo de Qualidade Kaizen'
    ],
    movements: [
      'Desenvolvimento conjunto de baterias de estado sólido',
      'Faturamento por lote de piloto tecnológico'
    ],
    routePoints: [
      { name: "Toyota R&D Complex", desc: "Montagem de protótipos de estado sólido concluída", done: true, time: "2026-05-20 09:15" },
      { name: "Aeroporto de Narita (NRT)", desc: "Carga despachada via transporte aéreo prioritário", done: false, time: "Aguardando voo" }
    ],
    aiInsight: "Linha de montagem conjunta Toyota-Panasonic estabilizada. Protótipos de estado sólido de alta densidade em fase de descarregamento aéreo."
  },
  {
    id: 'sup-amazon',
    name: 'Amazon',
    locationName: 'Seattle, Washington, EUA',
    coordinates: { x: 120, y: 110 },
    sector: 'Tecnologia/Logística',
    material: 'Projeto Zoox',
    status: 'transit',
    statusText: 'Em Transporte 🟡',
    leadTime: 8,
    trackingId: 'TRK-AMZ-7733',
    eta: '28 de Maio, 2026',
    reliability: 96.5,
    permissions: [
      'Uso de baterias Panasonic em veículos autônomos (Reuters)',
      'Integração de Supply Chain Digital'
    ],
    movements: [
      'Despacho logístico integrado via rotas expressas inteligentes',
      'Validação RFID ativa'
    ],
    routePoints: [
      { name: "Amazon Fulfillment Center", desc: "Faturamento e selagem RFID", done: true, time: "2026-05-19 14:00" },
      { name: "Hub Aéreo Cincinnati", desc: "Embarque concluído no Prime Flight", done: true, time: "2026-05-21 01:00" },
      { name: "Aeroporto de Guarulhos, BR", desc: "Despacho prioritário pela Receita", done: false, time: "Estimativa: 26/05" }
    ],
    aiInsight: "Amazon coordena o trâmite aéreo expresso de sensores auxiliares para o Projeto Zoox. Alta previsibilidade para entrega física dentro do prazo nominal."
  },
  {
    id: 'sup-zoox',
    name: 'Zoox',
    locationName: 'Foster City, Califórnia, EUA',
    coordinates: { x: 110, y: 128 },
    sector: 'Veículos autônomos',
    material: 'Integração de baterias',
    status: 'active',
    statusText: 'Produção Ativa 🟢',
    leadTime: 10,
    trackingId: 'TRK-ZOX-5511',
    eta: '07 de Junho, 2026',
    reliability: 95.8,
    permissions: [
      'Recebimento de células 2170 Panasonic (Reuters)',
      'Protocolo de Testagem de Telemetria de Segurança'
    ],
    movements: [
      'Integração modular de packs autônomos',
      'Monitoramento ativo de ciclagens de recarga'
    ],
    routePoints: [
      { name: "Zoox Foster City Lab", desc: "Montagem mecânica e segurança de chassis ativas", done: true, time: "2026-05-21 10:00" },
      { name: "Porto de Oakland", desc: "Aguardando estufamento de contêiner especial", done: false, time: "Agendado para 23/05" }
    ],
    aiInsight: "A linha de validação de células 2170 para o veículo autônomo Zoox está totalmente operacional. Testes preventivos de estresse térmico em curso síncronamente."
  },
  {
    id: 'sup-digikey',
    name: 'DigiKey',
    locationName: 'Minnesota, EUA',
    coordinates: { x: 170, y: 115 },
    sector: 'Distribuição eletrônica',
    material: 'Componentes e baterias',
    status: 'delivered',
    statusText: 'Entregue Concluído 🔵',
    leadTime: 4,
    trackingId: 'TRK-DKY-0099',
    eta: 'Entregue em 20 de Maio, 2026',
    reliability: 99.2,
    permissions: [
      'Distribuição oficial Panasonic Energy (DigiKey)',
      'Faturamento e Fracionamento Rápido'
    ],
    movements: [
      'Despacho expresso aéreo de componentes sensores',
      'Conclusão de conferência física no CD'
    ],
    routePoints: [
      { name: "DigiKey Thief River Falls HQ", desc: "Coleta e faturamento imediato", done: true, time: "2026-05-18 08:30" },
      { name: "DHL Express Flight", desc: "Despacho aéreo certificado", done: true, time: "2026-05-19 11:00" },
      { name: "Estoque Físico StockPile", desc: "Inventariado e locado no rack RA-C3-P1", done: true, time: "2026-05-20 15:30" }
    ],
    aiInsight: "Entrega expressa de acopladores e sensores térmicos finalizada. Itens já estão organizados no almoxarifado integrados de forma transparente ao faturamento."
  },
  {
    id: 'sup-panasonic',
    name: 'Panasonic Energy',
    locationName: 'Osaka, Japão',
    coordinates: { x: 710, y: 145 },
    sector: 'Energia',
    material: 'Produção de baterias',
    status: 'active',
    statusText: 'Produção Ativa 🟢',
    leadTime: 11,
    trackingId: 'TRK-PAN-5544',
    eta: '01 de Junho, 2026',
    reliability: 99.8,
    permissions: [
      'Cadeia de suprimentos global de materiais estratégicos (energy.na.panasonic.com)',
      'Auditoria Verde Síncrona'
    ],
    movements: [
      'Fracionamento térmico de alta pureza no reator 2',
      'Alinhamento integral com faturamento SAP'
    ],
    routePoints: [
      { name: "Suminoe Factory Osaka", desc: "Refreamento por vácuo e vedação a gás argon terminados", done: true, time: "2026-05-20 04:00" },
      { name: "Porto de Kobe", desc: "Aguardando carregamento prioritário no navio PacificVessel", done: false, time: "Estimado: 23/05" }
    ],
    aiInsight: "Panasonic Energy opera sob níveis ideais de produtividade verde e compensação de carbono ativa, garantindo consistência total no ecossistema global."
  }
];

export default function SuppliersTab() {
  const [suppliersList, setSuppliersList] = useState<EnrichedSupplier[]>(ENRICHED_SUPPLIERS_DATA);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliersList[0]?.id || 'sup-novonix');
  const [mapScale, setMapScale] = useState<number>(1);
  const [simulationActive, setSimulationActive] = useState<boolean>(true);

  const selectedSupplier = suppliersList.find(s => s.id === selectedSupplierId) || suppliersList[0];

  const handleTestAudit = () => {
    alert(`Iniciando Auditoria Verde Digital de Pegada de Carbono para ${selectedSupplier.name}. \n\nResultado: Conformidade de Carbono Neutro homologada pelo laboratório ecológico com sucesso!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'transit': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'delayed': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'delivered': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
      case 'transit': return 'bg-amber-500 shadow-[0_0_8px_#f59e0b]';
      case 'delayed': return 'bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse';
      case 'delivered': return 'bg-blue-500 shadow-[0_0_8px_#3b82f6]';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in text-xs" id="suppliers-tracking-workspace">
      
      {/* Top Banner metrics overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/45 backdrop-blur-md p-4 rounded-2xl border border-slate-900 shadow-xl" id="supply-chain-banner-metrics">
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider block">Eficiência de Envio</span>
          <div className="text-sm md:text-base font-black text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            <span>92.4%</span>
          </div>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider block">Lead Time Médio</span>
          <div className="text-sm md:text-base font-black text-slate-200 font-mono mt-1">
            <span>14.2 Dias</span>
          </div>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider block">Frota em Trânsito</span>
          <div className="text-sm md:text-base font-black text-amber-400 font-mono mt-1">
            <span>3 Remessas Ativas</span>
          </div>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wider block">Status dos Hubs</span>
          <div className="text-sm md:text-base font-black text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse block" />
            <span>Santos Operacional</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="suppliers-tracking-split">
        
        {/* Left Interactive Side Map & AI Advisor Card */}
        <div className="lg:col-span-8 space-y-6" id="suppliers-map-pane">
          
          {/* Main Visual Global interactive Map Card */}
          <div className="bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-2xl space-y-4" id="logistics-global-map">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[9px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                  Geotecnologia de Rastreio em Tempo Real
                </span>
                <h3 className="text-base font-black text-white font-sans mt-1.5 tracking-tight">
                  Painel de Geolocalização de Fornecedores Globais
                </h3>
              </div>
              <div className="flex gap-2" id="map-actions">
                <button
                  onClick={() => setSimulationActive(!simulationActive)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                    simulationActive 
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  📡 {simulationActive ? 'Fluxo IoT Ativo' : 'Pausar Telemetria'}
                </button>
              </div>
            </div>

            {/* Glowing Interactive SVG World Map Viewport */}
            <div className="border border-slate-900 bg-slate-950/70 rounded-2xl overflow-hidden relative p-1.5 flex items-center justify-center min-h-[340px]" id="svg-map-wrapper">
              
              {/* Absolutes for futuristic HUD Overlay */}
              <div className="absolute top-4 left-4 bg-slate-950/80 p-2.5 rounded-xl border border-slate-900/80 backdrop-blur pointer-events-none font-mono text-[9px] text-slate-450 space-y-1 z-10">
                <div className="font-bold text-white uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-orange-500 animate-spin duration-10000" />
                  Rede de Fornecimento
                </div>
                <div>POLOS PLOTADOS: <span className="text-emerald-400 font-bold">5 FAB</span></div>
                <div>ESTAÇÃO RECEPTORA: <span className="text-[#438AF3] font-bold">SANTOS, BR</span></div>
                <div>CONEXÃO DA FROTA: <span className="text-orange-400 font-bold">ON-LINE (100ms)</span></div>
              </div>

              {/* Graphical World Map Render */}
              <svg 
                viewBox="0 0 800 380" 
                className="w-full h-auto aspect-[800/380] max-h-[420px] select-none text-slate-700"
                id="svg-suppliers-global"
              >
                {/* 1. Technical Digital Grid Lines */}
                <defs>
                  <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
                  </pattern>
                  <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="800" height="380" fill="url(#mapGrid)" rx="12" />

                {/* 2. Abstract Stylized Continents Outlines to avoid empty background */}
                {/* North America */}
                <path d="M 80,100 Q 150,80 230,110 T 260,180 Q 200,200 130,180 Z" fill="#1e293b" fillOpacity="0.2" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                {/* South America */}
                <path d="M 230,220 Q 280,240 320,290 T 350,360 Q 300,360 260,320 Z" fill="#1e293b" fillOpacity="0.2" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                {/* Europe & Africa */}
                <path d="M 390,90 Q 420,70 480,100 T 520,160 Q 480,220 420,200 Z" fill="#1e293b" fillOpacity="0.2" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 390,200 Q 460,220 480,280 T 430,350 Q 360,320 380,260 Z" fill="#1e293b" fillOpacity="0.1" stroke="#334155" strokeWidth="0.5" />
                {/* Asia */}
                <path d="M 540,80 Q 660,60 740,110 T 710,220 Q 560,220 540,150 Z" fill="#1e293b" fillOpacity="0.2" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                {/* 3. Santos HQ Beacon (Receptor StockPile Hub) */}
                {/* Glowing area under Santos */}
                <circle cx="310" cy="275" r="32" fill="url(#hubGlow)" />
                {/* Connecting converging radial circles */}
                <circle cx="310" cy="275" r="8" fill="none" stroke="#10b981" strokeWidth="1" className="animate-pulse" />
                <circle cx="310" cy="275" r="2" fill="#10b981" />
                <text x="310" y="295" fill="#10b981" fontSize="9.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  SANTOS HUB 🇧🇷
                </text>

                {/* 4. Active Supplier Routes & Arcs converging to Santos Hub */}
                {suppliersList.map(sup => {
                  const isCurActive = sup.id === selectedSupplierId;
                  
                  // Routing Bezier formulas
                  let pathD = `M ${sup.coordinates.x},${sup.coordinates.y} Q ${(sup.coordinates.x + 310)/2 + 25},${(sup.coordinates.y + 275)/2 - 35} 310,275`;
                  if (sup.id === 'sup-posco') {
                    // Posco crosses pacifically around the bottom
                    pathD = `M ${sup.coordinates.x},${sup.coordinates.y} Q 500,340 310,275`;
                  }

                  let strokeColor = '#334155';
                  let strokeWidth = '1.5';
                  let dashArray: string | undefined = undefined;

                  if (isCurActive) {
                    strokeWidth = '2.5';
                    if (sup.status === 'delayed') strokeColor = '#f43f5e';
                    else if (sup.status === 'transit') strokeColor = '#f59e0b';
                    else if (sup.status === 'delivered') strokeColor = '#3b82f6';
                    else strokeColor = '#10b981';
                    
                    if (sup.status === 'transit' && simulationActive) {
                      dashArray = '5 4';
                    }
                  } else {
                    // Inactive, but colored subtly based on status
                    if (sup.status === 'delayed') strokeColor = '#f43f5e30';
                    else if (sup.status === 'transit') strokeColor = '#f59e0b30';
                    else strokeColor = '#47556940';
                  }

                  return (
                    <g key={`path-${sup.id}`}>
                      {/* Base shadow or background path */}
                      <path 
                        d={pathD} 
                        fill="none" 
                        stroke={strokeColor} 
                        strokeWidth={strokeWidth}
                        strokeDasharray={dashArray}
                        className={isCurActive && sup.status === 'transit' && simulationActive ? "animate-[dash_12s_linear_infinite]" : ""}
                        id={`route-line-${sup.id}`}
                      />
                      {/* Pulsing indicator traveling along the route line for active shipment */}
                      {isCurActive && sup.status === 'transit' && simulationActive && (
                        <circle r="4" fill="#f59e0b" className="animate-bounce">
                          <animateMotion dur="6s" repeatCount="indefinite" path={pathD} />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* 5. Draw Supplier coordinate nodes (Pins) */}
                {suppliersList.map(sup => {
                  const isCurActive = sup.id === selectedSupplierId;
                  
                  let pinColor = '#475569';
                  if (sup.status === 'active') pinColor = '#10b981';
                  else if (sup.status === 'transit') pinColor = '#f59e0b';
                  else if (sup.status === 'delayed') pinColor = '#f43f5e';
                  else if (sup.status === 'delivered') pinColor = '#3b82f6';

                  return (
                    <g 
                      key={`pin-${sup.id}`}
                      onClick={() => setSelectedSupplierId(sup.id)}
                      className="cursor-pointer group"
                    >
                      {/* Hover glowing bubble */}
                      <circle 
                        cx={sup.coordinates.x} 
                        cy={sup.coordinates.y} 
                        r={isCurActive ? 14 : 9} 
                        fill={pinColor} 
                        fillOpacity={isCurActive ? 0.25 : 0.1}
                        className="transition-all duration-300 group-hover:fill-opacity-40" 
                      />

                      {/* Concentric rings for alerts */}
                      {isCurActive && (
                        <circle 
                          cx={sup.coordinates.x} 
                          cy={sup.coordinates.y} 
                          r="18" 
                          fill="none" 
                          stroke={pinColor} 
                          strokeWidth="0.75" 
                          strokeDasharray="2 2"
                          className="animate-spin duration-3000" 
                        />
                      )}

                      {/* Actual core pinpoint */}
                      <circle 
                        cx={sup.coordinates.x} 
                        cy={sup.coordinates.y} 
                        r={isCurActive ? 5 : 3.5} 
                        fill={pinColor}
                        className="transition-all"
                      />

                      {/* Small text label overlay above point */}
                      <text 
                        x={sup.coordinates.x} 
                        y={sup.coordinates.y - (isCurActive ? 16 : 10)} 
                        fill={isCurActive ? '#FFFFFF' : '#94a3b8'} 
                        fontSize={isCurActive ? '10' : '8.5'} 
                        fontWeight={isCurActive ? 'black' : 'semibold'}
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-slate-950 px-1 rounded transition-colors"
                      >
                        {sup.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Lower Map Color Ticks Legend */}
              <div className="absolute bottom-3 left-4 bg-slate-950/80 p-2 rounded-xl border border-slate-900 pointer-events-none text-[8.5px] font-mono grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 block" /> Produção</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500 block" /> Em Transporte</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500 block animate-pulse" /> Atrasado</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500 block" /> Entregue</span>
              </div>
            </div>

            {/* Quick Map Controls Explanation */}
            <div className="bg-slate-950/30 p-2.5 rounded-xl border border-slate-900/60 font-sans text-slate-450 leading-relaxed">
              💡 <strong>Como interagir:</strong> Clique em qualquer marcador geográfico (pino) diretamente no mapa ou navegue pelos fornecedores na coluna lateral para atualizar o monitoramento síncrono e as orientações da IA.
            </div>
          </div>

          {/* AI Advisor Intelligent recommendations (IA + GEOLOCALIZAÇÃO) */}
          <div className="bg-gradient-to-br from-slate-950 to-[#0c142c] p-5 rounded-2xl border border-blue-900/40 shadow-inner space-y-4" id="ai-geoloc-advisor">
            <div className="flex items-center justify-between border-b border-blue-900/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/25">
                  <Bot className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white font-mono uppercase tracking-widest flex items-center gap-1">
                    ATHENA CO-PILOTO LOGÍSTICO <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 rounded px-1.5 py-0.5 ml-1 animate-pulse">INTEGRAÇÃO IA</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">ANÁLISE PREDITIVA DE OPERAÇÃO E INVENTÁRIO</p>
                </div>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start" id="ai-opinion-layout">
              {/* Dynamic Warning Indicator mapped to status */}
              <div className={`p-4 rounded-xl border shrink-0 text-center space-y-1 w-full md:w-44 ${
                selectedSupplier.status === 'delayed' 
                  ? 'bg-rose-500/5 border-rose-500/15 text-rose-400' 
                  : selectedSupplier.status === 'transit'
                    ? 'bg-amber-500/5 border-amber-500/15 text-amber-400'
                    : 'bg-emerald-500/5 border-emerald-500/15 text-emerald-400'
              }`}>
                <AlertTriangle className={`h-6 w-6 mx-auto ${
                  selectedSupplier.status === 'delayed' ? 'text-rose-500 animate-bounce' : 'text-slate-400'
                }`} />
                <span className="font-bold block text-[10px] uppercase font-mono tracking-wider">Status da Remessa</span>
                <span className="font-extrabold text-[11px] block">{selectedSupplier.statusText}</span>
              </div>

              {/* Textual interpretation */}
              <div className="flex-1 space-y-3 font-sans leading-relaxed text-slate-350">
                <p className="italic bg-slate-950/65 p-3.5 rounded-xl border border-slate-900/60 font-mono text-[11px] text-slate-300">
                  “{selectedSupplier.aiInsight || 'Analisando cadeia produtiva integrada do fornecedor. Sistema pronto para desvios preventivos.'}”
                </p>

                {/* Sub recommendations action linking map blocks to racks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900 flex items-center gap-2">
                    <span className="p-1 rounded bg-blue-500/10 text-[#438AF3] text-[9px] font-mono">RUA E/F</span>
                    <span>Espaço em stand-by programado para receber carga.</span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900 flex items-center gap-2">
                    <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-mono">PUREZA %</span>
                    <span>Análise do laudo físico e selo verde já homologados síncronamente.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Tab: Suppliers Selector Grid and Dynamic Shipment Chronology */}
        <div className="lg:col-span-4 space-y-6" id="suppliers-shipping-history-pane">
          
          {/* 1. Complete interactive partner listing checklist */}
          <div className="bg-slate-950/45 backdrop-blur-md rounded-2xl border border-slate-900 shadow-2xl overflow-hidden" id="suppliers-checklist-selector">
            <div className="p-4 bg-slate-955/35 border-b border-slate-900 mb-1 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-350 font-mono">Fornecedores Homologados</h4>
                <p className="text-slate-500 text-[10px] mt-0.5">Parceiros mapeados integrados com tracking RFID.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-900/60" id="suppliers-mini-list">
              {suppliersList.map(sup => {
                const isActive = sup.id === selectedSupplierId;
                return (
                  <div
                    key={sup.id}
                    onClick={() => setSelectedSupplierId(sup.id)}
                    className={`p-3.5 cursor-pointer hover:bg-slate-900/40 transition-colors flex justify-between items-center ${
                      isActive ? 'bg-orange-500/5 border-l-4 border-l-orange-500' : ''
                    }`}
                  >
                    <div className="space-y-1 font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-100">{sup.name}</span>
                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(sup.status)}`} />
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[9.5px] font-mono">
                        <span>📍 {sup.locationName}</span>
                      </div>
                    </div>
                    
                    <div className="text-right" id="reliability-mini-card">
                      <span className="text-[9.5px] font-mono font-bold text-[#438AF3] bg-[#438AF3]/5 border border-[#438AF3]/15 px-2 py-0.5 rounded">
                        {sup.reliability}% Conf.
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Shipment details and step timeline (resembling the provided tracking look) */}
          <div className="bg-slate-950/45 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-2xl space-y-4" id="cargo-status-inspector">
            <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-slate-200 uppercase tracking-wider font-mono">📋 Monitoramento da Carga</span>
              <span className={`px-2 py-0.5 rounded uppercase text-[9px] font-mono font-extrabold border ${getStatusColor(selectedSupplier.status)}`}>
                {selectedSupplier.statusText}
              </span>
            </div>

            {/* General shipment parameters inside cards mapping with user requested fields */}
            <div className="grid grid-cols-2 gap-2 text-[10.5px]" id="tracker-specs-layout">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-900">
                <span className="text-slate-500 text-[9.5px] block font-mono">REMETENTE</span>
                <span className="font-bold text-slate-300 block mt-0.5">{selectedSupplier.name}</span>
                <span className="text-[9px] text-slate-500 font-mono block">{selectedSupplier.locationName}</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-900">
                <span className="text-slate-500 text-[9.5px] block font-mono">MATERIAL COMPOSTO</span>
                <span className="font-bold text-[#438AF3] block mt-0.5 truncate">{selectedSupplier.material}</span>
                <span className="text-[9px] text-orange-450 font-bold block">{selectedSupplier.sector}</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-900">
                <span className="text-slate-500 text-[9.5px] block font-mono">LEAD TIME FLUIDEZ</span>
                <span className="font-bold text-slate-300 block mt-0.5 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-orange-500" />
                  {selectedSupplier.leadTime} Dias
                </span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-900">
                <span className="text-slate-500 text-[9.5px] block font-mono">ESTIMATIVA ETA</span>
                <span className="font-bold text-emerald-450 block mt-0.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                  {selectedSupplier.eta}
                </span>
              </div>
            </div>

            {/* Schematic Timeline Tracking History as shown in photo */}
            <div className="space-y-3.5 pt-2" id="tracking-history-timeline-box">
              <div className="flex items-center justify-between text-[10.5px] font-mono">
                <span className="text-slate-450 font-bold">Histórico de Rastreamento (RFID)</span>
                <span className="text-slate-500 bg-slate-950 px-2 py-0.5 rounded text-[9px] font-bold">ID: {selectedSupplier.trackingId}</span>
              </div>

              {/* Vertical list of check-steps */}
              <div className="relative pl-5 space-y-4 border-l border-slate-800 ml-2.5 pt-1.5 pb-2" id="timeline-list">
                {selectedSupplier.routePoints.map((pt, i) => {
                  let isCompleted = pt.done;
                  
                  // Active timeline colors and pins
                  let circleColor = 'border-slate-800 bg-slate-950 text-slate-600';
                  let textColor = 'text-slate-500';

                  if (isCompleted) {
                    textColor = 'text-slate-300';
                    if (selectedSupplier.status === 'delayed' && !selectedSupplier.routePoints[i+1]?.done) {
                      circleColor = 'border-rose-500/80 bg-rose-950 text-rose-400 ring-2 ring-rose-500/20';
                    } else if (selectedSupplier.status === 'transit' && !selectedSupplier.routePoints[i+1]?.done) {
                      circleColor = 'border-amber-500/80 bg-amber-950 text-amber-300 ring-2 ring-amber-500/20';
                      circleColor += ' animate-pulse';
                    } else if (selectedSupplier.status === 'delivered') {
                      circleColor = 'border-blue-500/80 bg-blue-950 text-blue-300';
                    } else {
                      circleColor = 'border-emerald-500/80 bg-emerald-950 text-emerald-300';
                    }
                  }

                  return (
                    <div key={i} className="relative text-[11px] font-mono animate-fade-in">
                      {/* Left side dot point */}
                      <span className={`absolute -left-[27px] top-0.5 h-4 w-4 rounded-full border-2 text-[8px] font-bold flex items-center justify-center transition-all ${circleColor}`}>
                        {isCompleted ? '✓' : '○'}
                      </span>
                      
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold block ${textColor}`}>{pt.name}</span>
                          <span className="text-[8.5px] text-slate-500 text-right font-light">{pt.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal font-sans">{pt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit / Seal Action */}
            <div className="pt-3 border-t border-slate-900 flex justify-between gap-2.5 text-[10px]">
              <button 
                onClick={handleTestAudit}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-500/20 shadow-md"
              >
                <Leaf className="h-3.5 w-3.5 text-emerald-300" />
                <span>Auditar Pegada Ecológica (Selo Verde)</span>
              </button>
            </div>
          </div>

          {/* 3. Integration permissions check */}
          <div className="bg-slate-950/45 backdrop-blur-md p-4 rounded-2xl border border-slate-900 space-y-3 text-[10.5px]" id="supplier-permissions-block">
            <span className="text-[9.5px] font-mono uppercase font-bold text-slate-450 tracking-wider block flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-[#438AF3]" />
              Permissões Ativas no Terminal
            </span>
            
            <div className="flex flex-col gap-1.5" id="permissions-items">
              {selectedSupplier.permissions.map((perm, idx) => (
                <div key={idx} className="bg-slate-950/80 p-2 rounded-lg border border-slate-900 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#438AF3] block shrink-0" />
                  <span className="text-slate-300 font-sans">{perm}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
