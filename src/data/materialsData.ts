/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Material, Supplier, SAPDetails } from '../types';

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat-1',
    sapCode: 'MP-00145',
    name: 'Ácido Cítrico',
    category: 'Matéria-prima',
    quantity: '250 kg',
    quantityVal: 250,
    unit: 'kg',
    batch: 'AC2026-01',
    expiryDate: '2027-02-10',
    status: 'valid',
    location: 'RA-A3-P2',
    supplier: 'QuimLab',
    responsible: 'João',
    purity: 99.8,
    criticalLimit: 100,
    invoiceAttached: true,
    invoiceName: 'NF_3456789_AC.pdf',
    invoiceDate: '2026-03-20',
    notes: 'Ácido cítrico anidro grau alimentício. Utilizado para ajuste de pH em formulações líquidas e como agente dispersante.',
    history: [
      {
        id: 'h-1',
        date: '2026-03-20',
        type: 'Entrada',
        quantityChange: '+250 kg',
        description: 'Entrada de material via Ordem de Compra #2167',
        user: 'João'
      },
      {
        id: 'h-2',
        date: '2026-03-21',
        type: 'Auditoria de Pureza',
        description: 'Laudo técnico QuimLab confirma pureza de 99.8%',
        user: 'Mel (Qualidade)'
      }
    ]
  },
  {
    id: 'mat-2',
    sapCode: 'MP-00192',
    name: 'NCA (Níquel-Cobalto-Alumínio)',
    category: 'Matéria-prima',
    quantity: '1.200 kg',
    quantityVal: 1200,
    unit: 'kg',
    batch: 'NC2026-02',
    expiryDate: '2028-08-15',
    status: 'critical',
    location: 'RA-D2-P3',
    supplier: 'POSCO CHEMICAL',
    responsible: 'Mel',
    purity: 98.5,
    criticalLimit: 1500, // Menor que o limite, por isso crítico
    invoiceAttached: true,
    invoiceName: 'NF_POSCO_NCA_887.pdf',
    invoiceDate: '2026-04-12',
    notes: 'Precursor ativo de catodo de alta pureza para baterias de veículos elétricos (EV). Demanda alta da produção.',
    history: [
      {
        id: 'h-3',
        date: '2026-04-12',
        type: 'Entrada',
        quantityChange: '+1.500 kg',
        description: 'Recebimento de lote de precursor NCA para teste de pureza inicial',
        user: 'Mel (Qualidade)'
      },
      {
        id: 'h-4',
        date: '2026-04-15',
        type: 'Saída',
        quantityChange: '-300 kg',
        description: 'Transferência para linha de sinterização de eletrodos (Produção)',
        user: 'Produção'
      },
      {
        id: 'h-5',
        date: '2026-05-10',
        type: 'Ajuste Crítico',
        description: 'Estoque atingiu nível crítico de segurança. Alerta de reabastecimento disparado no SAP.',
        user: 'Almoxarifado'
      }
    ]
  },
  {
    id: 'mat-3',
    sapCode: 'IQ-00789',
    name: 'Ácido Clorídrico Sol. 37%',
    category: 'Insumo Químico',
    quantity: '120 litros',
    quantityVal: 120,
    unit: 'litros',
    batch: 'ACID-EXP-99',
    expiryDate: '2026-04-01', // Vencido considerando a data atual de 2026-05-20
    status: 'expired',
    location: 'RA-F1-P1',
    supplier: 'Merck S.A.',
    responsible: 'João',
    purity: 37.0,
    criticalLimit: 50,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Insumo químico controlado de alta periculosidade. Exige armazenamento em área de contenção isolada contra ácido.',
    history: [
      {
        id: 'h-6',
        date: '2025-04-01',
        type: 'Entrada',
        quantityChange: '+120 litros',
        description: 'Recebimento sob licença da Polícia Federal',
        user: 'Almoxarifado'
      },
      {
        id: 'h-7',
        date: '2026-04-02',
        type: 'Auditoria de Pureza',
        description: 'Material expirado. Solicitado descarte seguro e retirada da prateleira ativa.',
        user: 'Mel (Qualidade)'
      }
    ]
  },
  {
    id: 'mat-4',
    sapCode: 'MP-00210',
    name: 'Cobalto Sulfato Heptaidratado',
    category: 'Matéria-prima',
    quantity: '2.400 kg',
    quantityVal: 2400,
    unit: 'kg',
    batch: 'CO2026-V8',
    expiryDate: '2027-11-20',
    status: 'valid',
    location: 'RA-B2-P4',
    supplier: 'POSCO CHEMICAL',
    responsible: 'Armazenagem',
    purity: 99.92,
    criticalLimit: 500,
    invoiceAttached: true,
    invoiceName: 'NF_POSCO_COB_221.pdf',
    invoiceDate: '2026-02-18',
    notes: 'Insumo essencial com validação verde e laudo de alta pureza. Usado em conjunto com NCA na fusão eletroquímica.',
    history: [
      {
        id: 'h-8',
        date: '2026-02-18',
        type: 'Entrada',
        quantityChange: '+2.400 kg',
        description: 'Recebimento de importação marítima direta',
        user: 'Almoxarifado'
      }
    ]
  },
  {
    id: 'mat-5',
    sapCode: 'EMB-034',
    name: 'Tambores Metálicos Homologados',
    category: 'Embalagem',
    quantity: '45 unidades',
    quantityVal: 45,
    unit: 'unidades',
    batch: 'TB-2026',
    expiryDate: '2029-01-01',
    status: 'critical',
    location: 'RA-C4-P1',
    supplier: 'EmbalaMetal',
    responsible: 'Almoxarifado',
    purity: 100, // não aplicável
    criticalLimit: 50, // 45 < 50, por isso crítico
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Tambores com revestimento interno epóxi especiais para armazenamento de reagentes corrosivos.',
    history: [
      {
        id: 'h-9',
        date: '2026-01-10',
        type: 'Entrada',
        quantityChange: '+100 unidades',
        description: 'Estoque de reposição de almoxarifado',
        user: 'Armazenagem'
      },
      {
        id: 'H-10',
        date: '2026-05-15',
        type: 'Saída',
        quantityChange: '-55 unidades',
        description: 'Expedido para envelopagem de rejeito químico na Produção',
        user: 'Produção'
      }
    ]
  },
  {
    id: 'mat-6',
    sapCode: 'PA-00990',
    name: 'Células Prontas de Bateria EV-A1',
    category: 'Produto Acabado',
    quantity: '1.250 un',
    quantityVal: 1250,
    unit: 'unidades',
    batch: 'CEL-EV-004',
    expiryDate: '2031-12-31',
    status: 'valid',
    location: 'RA-I1-P2',
    supplier: 'StockFlow Interno',
    responsible: 'Produção',
    purity: 99.99,
    criticalLimit: 200,
    invoiceAttached: true,
    invoiceName: 'CERT_QUALIDADE_BATEV.pdf',
    invoiceDate: '2026-05-18',
    notes: 'Células prismáticas de íons de lítio prontas para empacotamento. Validadas sob protocolo verde de emissão zero.',
    history: [
      {
        id: 'h-11',
        date: '2026-05-18',
        type: 'Entrada',
        quantityChange: '+1.250 un',
        description: 'Submissão de lote finalizado e aprovado pelo controle de qualidade de pureza e solda',
        user: 'Mel (Qualidade)'
      }
    ]
  },
  {
    id: 'mat-7',
    sapCode: 'MP-00334',
    name: 'Carbonato de Lítio (Grau Bateria)',
    category: 'Matéria-prima',
    quantity: '3.500 kg',
    quantityVal: 3500,
    unit: 'kg',
    batch: 'LI-2026-CARB',
    expiryDate: '2027-06-15',
    status: 'valid',
    location: 'RA-E2-P2',
    supplier: 'SQM Chile',
    responsible: 'Mel',
    purity: 99.51,
    criticalLimit: 1000,
    invoiceAttached: true,
    invoiceName: 'NF_SQM_92384.pdf',
    invoiceDate: '2026-03-01',
    notes: 'Sal inorgânico essencial para eletrolito. Altamente sensível a umidade ambiente.',
    history: [
      {
        id: 'h-12',
        date: '2026-03-01',
        type: 'Entrada',
        quantityChange: '+3.500 kg',
        description: 'Recebimento e conferência física no setor de armazenagem',
        user: 'Armazenagem'
      }
    ]
  },
  {
    id: 'mat-8',
    sapCode: 'IQ-00102',
    name: 'Dispersante de Grafite - NanoG',
    category: 'Insumo Químico',
    quantity: '15 kg',
    quantityVal: 15,
    unit: 'kg',
    batch: 'NG2025-FF',
    expiryDate: '2026-05-10', // Vencido recentemente
    status: 'expired',
    location: 'RA-K3-P4',
    supplier: 'Nippon Carbon',
    responsible: 'Mel',
    purity: 97.4,
    criticalLimit: 40,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Agente surfactante de alto custo para estabilização da pasta anódica de grafeno.',
    history: [
      {
        id: 'h-13',
        date: '2025-11-10',
        type: 'Entrada',
        quantityChange: '+15 kg',
        description: 'Insumo de testes especiais',
        user: 'Almoxarifado'
      }
    ]
  },
  {
    id: 'mat-pdf-0001',
    sapCode: 'MP-0001',
    name: 'Alumínio laminado',
    category: 'Matéria-prima',
    quantity: '850 kg',
    quantityVal: 850,
    unit: 'kg',
    batch: 'AL2026-01',
    expiryDate: '2028-08-12',
    status: 'valid',
    location: 'RA-A1-P2',
    supplier: 'NeoMetal Supply',
    responsible: 'Almoxarifado',
    purity: 99.8,
    criticalLimit: 300,
    invoiceAttached: true,
    invoiceName: 'NF_ALUMINIO_MP0001.pdf',
    invoiceDate: '2026-05-18',
    notes: 'Alumínio laminado importado com tolerância micrométrica. Excelente dissipação mecânica.',
    history: [
      {
        id: 'h-pdf-1',
        date: '2026-05-20',
        type: 'Entrada',
        quantityChange: '+850 kg',
        description: 'Lote AL2026-01 consolidado na prateleira A-01-P2.',
        user: 'Automático'
      }
    ]
  },
  {
    id: 'mat-pdf-0002',
    sapCode: 'MP-0002',
    name: 'Resina epóxi industrial',
    category: 'Insumo Químico',
    quantity: '120 litros',
    quantityVal: 120,
    unit: 'L',
    batch: 'RE2026-04',
    expiryDate: '2027-03-18',
    status: 'valid',
    location: 'RA-B2-P1',
    supplier: 'PolyTech Industrial',
    responsible: 'Almoxarifado',
    purity: 99.0,
    criticalLimit: 50,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Resina epóxi industrial dielétrica para empacotamento de placas.',
    history: [
      {
        id: 'h-pdf-2',
        date: '2026-05-19',
        type: 'Entrada',
        quantityChange: '+120 litros',
        description: 'Lote RE2026-04 cadastrado e estocado.',
        user: 'Almoxarifado'
      }
    ]
  },
  {
    id: 'mat-pdf-0003',
    sapCode: 'MP-0003',
    name: 'Carbonato de lítio',
    category: 'Matéria-prima',
    quantity: '65 kg',
    quantityVal: 65,
    unit: 'kg',
    batch: 'CL2026-03',
    expiryDate: '2027-01-11',
    status: 'critical',
    location: 'RA-C4-P3',
    supplier: 'QuantumChem Solutions',
    responsible: 'Mel',
    purity: 99.5,
    criticalLimit: 100,
    invoiceAttached: true,
    invoiceName: 'NF_LITIO_MP0003.pdf',
    invoiceDate: '2026-05-15',
    notes: 'Carbonato de lítio de alta pureza. Nível de segurança crítico detectado pelo almoxarifado.',
    history: [
      {
        id: 'h-pdf-3',
        date: '2026-05-15',
        type: 'Ajuste Crítico',
        quantityChange: '-35 kg',
        description: 'Estoque de carbonato de lítio caiu abaixo do limite crítico.',
        user: 'Mel'
      }
    ]
  },
  {
    id: 'mat-pdf-0004',
    sapCode: 'MP-0004',
    name: 'Cobre eletrolítico',
    category: 'Matéria-prima',
    quantity: '430 kg',
    quantityVal: 430,
    unit: 'kg',
    batch: 'CB2026-07',
    expiryDate: '2029-09-22',
    status: 'valid',
    location: 'RA-A3-P4',
    supplier: 'NeoMetal Supply',
    responsible: 'Almoxarifado',
    purity: 99.9,
    criticalLimit: 150,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Cobre grau eletrolítico com altíssima condutividade superficial.',
    history: [
      {
        id: 'h-pdf-4',
        date: '2026-05-14',
        type: 'Entrada',
        quantityChange: '+430 kg',
        description: 'Recebimento de lote de Cobre grau eletrolítico.',
        user: 'Almoxarifado'
      }
    ]
  },
  {
    id: 'mat-pdf-0005',
    sapCode: 'MP-0005',
    name: 'Solvente isopropílico',
    category: 'Insumo Químico',
    quantity: '40 litros',
    quantityVal: 40,
    unit: 'L',
    batch: 'SI2026-02',
    expiryDate: '2026-11-09',
    status: 'critical',
    location: 'RA-D1-P1',
    supplier: 'QuantumChem Solutions',
    responsible: 'Mel',
    purity: 99.7,
    criticalLimit: 60,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Solvente isopropílico PA para lavagem fina de substratos químicos.',
    history: [
      {
        id: 'h-pdf-5',
        date: '2026-05-12',
        type: 'Ajuste Crítico',
        quantityChange: '-20 litros',
        description: 'Baixado para lavagem de eletrodos piloto.',
        user: 'Produção'
      }
    ]
  },
  {
    id: 'mat-pdf-0006',
    sapCode: 'MP-0006',
    name: 'Silicone térmico',
    category: 'Insumo Químico',
    quantity: '980 un',
    quantityVal: 980,
    unit: 'un',
    batch: 'ST2026-05',
    expiryDate: '2028-05-15',
    status: 'valid',
    location: 'RA-F2-P2',
    supplier: 'NexVolt Materials',
    responsible: 'Almoxarifado',
    purity: 100.0,
    criticalLimit: 300,
    invoiceAttached: true,
    invoiceName: 'NF_SILICONE_ST0006.pdf',
    invoiceDate: '2026-05-10',
    notes: 'Silicone de alta condutividade térmica para vedação de células prismáticas.',
    history: [
      {
        id: 'h-pdf-6',
        date: '2026-05-10',
        type: 'Entrada',
        quantityChange: '+980 un',
        description: 'Insumos de vedação estocados com laudo técnico.',
        user: 'Almoxarifado'
      }
    ]
  },
  {
    id: 'mat-pdf-0007',
    sapCode: 'MP-0007',
    name: 'Filme PET industrial',
    category: 'Embalagem',
    quantity: '210 m²',
    quantityVal: 210,
    unit: 'm²',
    batch: 'FP2026-01',
    expiryDate: '2028-02-28',
    status: 'valid',
    location: 'RA-E1-P3',
    supplier: 'PolyTech Industrial',
    responsible: 'Almoxarifado',
    purity: 100.0,
    criticalLimit: 100,
    notes: 'Membrana de isolamento PET dielétrico.',
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    history: []
  },
  {
    id: 'mat-pdf-0008',
    sapCode: 'MP-0008',
    name: 'Níquel sulfato',
    category: 'Matéria-prima',
    quantity: '25 kg',
    quantityVal: 25,
    unit: 'kg',
    batch: 'NS2026-06',
    expiryDate: '2027-07-17',
    status: 'critical',
    location: 'RA-C2-P2',
    supplier: 'QuantumChem Solutions',
    responsible: 'Mel',
    purity: 98.9,
    criticalLimit: 80,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Sulfato de níquel grau precursor automotivo.',
    history: [
      {
        id: 'h-pdf-8',
        date: '2026-05-11',
        type: 'Ajuste Crítico',
        description: 'Estoque abaixo de limite mínimo recomendado.',
        user: 'Mel'
      }
    ]
  },
  {
    id: 'mat-pdf-0009',
    sapCode: 'MP-0009',
    name: 'Aço inox industrial',
    category: 'Matéria-prima',
    quantity: '620 kg',
    quantityVal: 620,
    unit: 'kg',
    batch: 'AI2026-02',
    expiryDate: '2029-04-15',
    status: 'valid',
    location: 'RA-A4-P1',
    supplier: 'NeoMetal Supply',
    responsible: 'Almoxarifado',
    purity: 99.9,
    criticalLimit: 200,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Aço inox austenítico grau alimentício e mecânico.',
    history: []
  },
  {
    id: 'mat-pdf-0010',
    sapCode: 'MP-0010',
    name: 'Grafite condutivo',
    category: 'Matéria-prima',
    quantity: '140 kg',
    quantityVal: 140,
    unit: 'kg',
    batch: 'GC2026-01',
    expiryDate: '2027-10-10',
    status: 'valid',
    location: 'RA-C1-P2',
    supplier: 'NexVolt Materials',
    responsible: 'Mel',
    purity: 99.4,
    criticalLimit: 80,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Grafite condutivo fino para ajuste de pasta de ânodo.',
    history: []
  },
  {
    id: 'mat-pdf-0011',
    sapCode: 'MP-0011',
    name: 'Policarbonato técnico',
    category: 'Insumo Químico',
    quantity: '310 kg',
    quantityVal: 310,
    unit: 'kg',
    batch: 'PT2026-03',
    expiryDate: '2028-08-05',
    status: 'valid',
    location: 'RA-B3-P2',
    supplier: 'PolyTech Industrial',
    responsible: 'Almoxarifado',
    purity: 99.3,
    criticalLimit: 120,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Grânulos de policarbonato para injeção de carcaças.',
    history: []
  },
  {
    id: 'mat-pdf-0012',
    sapCode: 'MP-0012',
    name: 'Acetato de sódio',
    category: 'Insumo Químico',
    quantity: '75 kg',
    quantityVal: 75,
    unit: 'kg',
    batch: 'AS2026-05',
    expiryDate: '2027-01-22',
    status: 'critical',
    location: 'RA-D2-P3',
    supplier: 'QuantumChem Solutions',
    responsible: 'Mel',
    purity: 99.1,
    criticalLimit: 100,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Acetato de sódio anidro grafitável.',
    history: []
  },
  {
    id: 'mat-pdf-0013',
    sapCode: 'MP-0013',
    name: 'Fibra cerâmica',
    category: 'Insumo Químico',
    quantity: '180 m²',
    quantityVal: 180,
    unit: 'm²',
    batch: 'FC2026-01',
    expiryDate: '2028-09-19',
    status: 'valid',
    location: 'RA-E2-P4',
    supplier: 'NexVolt Materials',
    responsible: 'Almoxarifado',
    purity: 100.0,
    criticalLimit: 70,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Isolamento termo-elétrico de alto ponto de fusão.',
    history: []
  },
  {
    id: 'mat-pdf-0014',
    sapCode: 'MP-0014',
    name: 'Silício industrial',
    category: 'Matéria-prima',
    quantity: '95 kg',
    quantityVal: 95,
    unit: 'kg',
    batch: 'SI2026-07',
    expiryDate: '2028-06-30',
    status: 'valid',
    location: 'RA-F1-P1',
    supplier: 'QuantumChem Solutions',
    responsible: 'Mel',
    purity: 99.85,
    criticalLimit: 60,
    invoiceAttached: true,
    invoiceName: 'NF_SILICIO_MP0014.pdf',
    invoiceDate: '2026-05-14',
    notes: 'Silício industrial semicondutor para dopagem fina.',
    history: []
  },
  {
    id: 'mat-pdf-0015',
    sapCode: 'MP-0015',
    name: 'Espuma antiestática',
    category: 'Embalagem',
    quantity: '450 un',
    quantityVal: 450,
    unit: 'un',
    batch: 'EA2026-04',
    expiryDate: '2027-12-18',
    status: 'valid',
    location: 'RA-G3-P2',
    supplier: 'PolyTech Industrial',
    responsible: 'Almoxarifado',
    purity: 100.0,
    criticalLimit: 150,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Almofada de amortecimento estático contra fuga de corrente.',
    history: []
  },
  {
    id: 'mat-pdf-0016',
    sapCode: 'MP-0016',
    name: 'Níquel metálico',
    category: 'Matéria-prima',
    quantity: '130 kg',
    quantityVal: 130,
    unit: 'kg',
    batch: 'NM2026-02',
    expiryDate: '2028-11-08',
    status: 'valid',
    location: 'RA-C3-P1',
    supplier: 'NeoMetal Supply',
    responsible: 'Mel',
    purity: 99.95,
    criticalLimit: 90,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Metal eletrolítico para deposição de camada condutiva.',
    history: []
  },
  {
    id: 'mat-pdf-0017',
    sapCode: 'MP-0017',
    name: 'Álcool isobutílico',
    category: 'Insumo Químico',
    quantity: '55 litros',
    quantityVal: 55,
    unit: 'L',
    batch: 'AI2026-09',
    expiryDate: '2027-05-03',
    status: 'critical',
    location: 'RA-D4-P2',
    supplier: 'QuantumChem Solutions',
    responsible: 'Mel',
    purity: 99.2,
    criticalLimit: 70,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Reagente carretador para secagem rápida de eletrólitos.',
    history: []
  },
  {
    id: 'mat-pdf-0018',
    sapCode: 'MP-0018',
    name: 'Manta térmica industrial',
    category: 'Insumo Químico',
    quantity: '240 m²',
    quantityVal: 240,
    unit: 'm²',
    batch: 'MT2026-03',
    expiryDate: '2029-02-26',
    status: 'valid',
    location: 'RA-F4-P3',
    supplier: 'NexVolt Materials',
    responsible: 'Almoxarifado',
    purity: 100.0,
    criticalLimit: 80,
    invoiceAttached: false,
    invoiceName: null,
    invoiceDate: null,
    notes: 'Barreira isolante ignífuga para módulos.',
    history: []
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-novonix',
    name: 'NOVONIX',
    sector: 'Materiais para bateria',
    permissions: [
      'Homologação Automotiva EV',
      'Despacho Aduaneiro Simplificado',
      'Certificado de Baixo Carbono',
      'Fornecimento de grafite para baterias EV (Panasonic)'
    ],
    movements: [
      'Início de moagem térmica de alta pureza no reator 4',
      'Emissão de laudo de condutividade por espectrometria'
    ],
    reliability: 98.7
  },
  {
    id: 'sup-sila',
    name: 'Sila Nanotechnologies',
    sector: 'Nanotecnologia',
    permissions: [
      'Controle Especial de Atmosfera Estável',
      'Conexão API IoT Ativa nos Contêineres de Carga',
      'Parceria para material de silício de próxima geração (Panasonic)'
    ],
    movements: [
      'Estabilização de carga sob atmosfera de nitrogênio líquido',
      'Trânsito costeiro pacífico iniciado com sucesso'
    ],
    reliability: 97.5
  },
  {
    id: 'sup-tesla',
    name: 'Tesla',
    sector: 'Automotivo',
    permissions: [
      'Parceira estratégica para células de bateria EV (Reuters)',
      'Inspeção Integrada de Sólidos'
    ],
    movements: [
      'Integração de módulos de bateria cilíndricos 4680',
      'Alinhamento com faturamento no SAP'
    ],
    reliability: 99.1
  },
  {
    id: 'sup-lgchem',
    name: 'LG Chem',
    sector: 'Químicos',
    permissions: [
      'Atua no mercado global para baterias e química industrial (Reuters)',
      'Desembaraço Prioritário de Compostos'
    ],
    movements: [
      'Despacho marítimo de solventes e precursores ativos',
      'Registro de licença química aduaneira'
    ],
    reliability: 98.0
  },
  {
    id: 'sup-catl',
    name: 'CATL',
    sector: 'Baterias',
    permissions: [
      'Referência global no setor de baterias EV (Reddit)',
      'Licenciamento LFP Integrado'
    ],
    movements: [
      'Montagem robotizada de células prismáticas de ferro-fosfato',
      'Emissão de certificados digitais de pegada de carbono zero'
    ],
    reliability: 99.3
  },
  {
    id: 'sup-toyota',
    name: 'Toyota',
    sector: 'Automotivo',
    permissions: [
      'Joint venture em pesquisas de baterias avançadas (Financial Times)',
      'Selo de Qualidade Kaizen'
    ],
    movements: [
      'Desenvolvimento conjunto de baterias de estado sólido',
      'Faturamento por lote de piloto tecnológico'
    ],
    reliability: 97.8
  },
  {
    id: 'sup-amazon',
    name: 'Amazon',
    sector: 'Tecnologia/Logística',
    permissions: [
      'Uso de baterias Panasonic em veículos autônomos (Reuters)',
      'Integração de Supply Chain Digital'
    ],
    movements: [
      'Despacho logístico integrado via rotas expressas inteligentes',
      'Validação RFID ativa'
    ],
    reliability: 96.5
  },
  {
    id: 'sup-zoox',
    name: 'Zoox',
    sector: 'Veículos autônomos',
    permissions: [
      'Recebimento de células 2170 Panasonic (Reuters)',
      'Protocolo de Testagem de Telemetria de Segurança'
    ],
    movements: [
      'Integração modular de packs autônomos',
      'Monitoramento ativo de ciclagens de recarga'
    ],
    reliability: 95.8
  },
  {
    id: 'sup-digikey',
    name: 'DigiKey',
    sector: 'Distribuição eletrônica',
    permissions: [
      'Distribuição oficial Panasonic Energy (DigiKey)',
      'Faturamento e Fracionamento Rápido'
    ],
    movements: [
      'Despacho expresso aéreo de componentes sensores',
      'Conclusão de conferência física no CD'
    ],
    reliability: 99.2
  },
  {
    id: 'sup-panasonic',
    name: 'Panasonic Energy',
    sector: 'Energia',
    permissions: [
      'Cadeia de suprimentos global de materiais estratégicos (energy.na.panasonic.com)',
      'Auditoria Verde Síncrona'
    ],
    movements: [
      'Fracionamento térmico de alta pureza no reator 2',
      'Alinhamento integral com faturamento SAP'
    ],
    reliability: 99.8
  },
  {
    id: 'sup-posco',
    name: 'POSCO CHEMICAL',
    sector: 'Materiais Catódicos',
    permissions: [
      'Produção de baterias EV',
      'Integração direta SAP',
      'Certificação e Auditoria Verde'
    ],
    movements: [
      'Remessa do material NCA',
      'Ajuste do estoque crítico',
      'Validação de pureza química baterias'
    ],
    reliability: 99.4
  },
  {
    id: 'sup-quantum',
    name: 'QuantumChem Logistics',
    sector: 'Eletrólitos Gel',
    permissions: [
      'Protocolos Corrosivos Classe 3',
      'Inspeção Documental Aduaneira Especial'
    ],
    movements: [
      'Desvio de rota marítimo para contorno do Cabo da Boa Esperança',
      'Laudo químico de quarentena emitido síncronamente'
    ],
    reliability: 84.2
  }
];

export const INITIAL_SAP: SAPDetails = {
  orderNumber: 'PED-SAP-2026-4412',
  purchaseOrder: '2167',
  costCenter: '23.000',
  status: 'Em andamento',
  invoice: '3456789'
};

// Log mock global para demonstrar andamento das integrações e histórico integrado
export const SAP_LOGS = [
  {
    id: 'slog-1',
    timestamp: '2026-05-20 10:24:15',
    type: 'Sincronização',
    message: 'Ordem de compra #2167 enviada para o faturamento eletrônico SAP R/3.',
    status: 'success'
  },
  {
    id: 'slog-2',
    timestamp: '2026-05-20 11:32:00',
    type: 'Purity-Check',
    message: 'Lote NCA-NC2026-02 validado com pureza 98.5% no cadastro geral SAP.',
    status: 'success'
  },
  {
    id: 'slog-3',
    timestamp: '2026-05-20 13:10:45',
    type: 'Auditoria',
    message: 'Centro de Custo 23.000 consumiu R$ 12.000 em insumos de armazenagem de baterias.',
    status: 'pending'
  }
];
