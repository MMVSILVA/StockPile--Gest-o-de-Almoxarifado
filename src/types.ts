/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HistoryLog {
  id: string;
  date: string;
  type: 'Entrada' | 'Saída' | 'Auditoria de Pureza' | 'Ajuste Crítico' | 'Anexo de NF' | 'Sincronização SAP';
  quantityChange?: string;
  description: string;
  user: string;
}

export interface Material {
  id: string;
  sapCode: string;
  name: string;
  category: 'Matéria-prima' | 'Insumo Químico' | 'Embalagem' | 'Produto Acabado';
  quantity: string;
  quantityVal: number;
  unit: string;
  batch: string;
  expiryDate: string;
  status: 'valid' | 'critical' | 'expired';
  location: string; // Formato: RA-[A-L][1-6]-P[1-4] (Rua, Coluna, Prateleira)
  supplier: string;
  responsible: string;
  purity: number; // Porcentagem: 99.8
  criticalLimit: number;
  invoiceAttached: boolean;
  invoiceName: string | null;
  invoiceDate: string | null;
  history: HistoryLog[];
  notes: string;
}

export interface Supplier {
  id: string;
  name: string;
  sector: string;
  permissions: string[];
  movements: string[];
  reliability: number; // Porcentagem, ex: 98
}

export interface SAPDetails {
  orderNumber: string;
  purchaseOrder: string;
  costCenter: string;
  status: 'Em andamento' | 'Concluído' | 'Pendente';
  invoice: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isMapLocation?: string; // e.g. "RA-A3-P2"
  isMaterialId?: string;
}
