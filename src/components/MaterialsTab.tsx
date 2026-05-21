/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  FileCheck, 
  Paperclip, 
  History, 
  Network, 
  Trash2, 
  AlertTriangle,
  MapPin,
  Layers,
  Sparkles,
  FileSpreadsheet,
  Download,
  Upload,
  Database,
  CheckCircle2
} from 'lucide-react';
import { Material, HistoryLog } from '../types';

interface MaterialsTabProps {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  currentUser: { name: string; sector: string };
  onLocateOnMap?: (location: string) => void;
}

export default function MaterialsTab({ materials, setMaterials, currentUser, onLocateOnMap }: MaterialsTabProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(materials[0] || null);
  
  // Modals visibility
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  
  // Excel/Sheets states
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedPreviewData, setUploadedPreviewData] = useState<any[]>([]);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [detectedDelimiter, setDetectedDelimiter] = useState<string>(';');
  const [columnMapping, setColumnMapping] = useState<{ [key: string]: string }>({});

  // Parse CSV text with delimiter detection and quote handling
  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return { headers: [], rows: [] };
    
    const sample = lines.slice(0, 5).join('\n');
    const counts = {
      semicolon: (sample.match(/;/g) || []).length,
      comma: (sample.match(/,/g) || []).length,
      tab: (sample.match(/\t/g) || []).length
    };
    
    let delimiter = ';'; // Default to semicolon (standard for PT-BR Excel)
    if (counts.comma > counts.semicolon && counts.comma > counts.tab) {
      delimiter = ',';
    } else if (counts.tab > counts.comma && counts.tab > counts.semicolon) {
      delimiter = '\t';
    }
    setDetectedDelimiter(delimiter);
    
    const parseLine = (line: string) => {
      const fields: string[] = [];
      let curField = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          fields.push(curField.trim());
          curField = '';
        } else {
          curField += char;
        }
      }
      fields.push(curField.trim());
      return fields;
    };

    const headers = parseLine(lines[0]);
    const rows = lines.slice(1).map(line => parseLine(line));
    return { headers, rows };
  };

  // Maps columns from user CSV dynamically
  const mapHeadersToKeys = (headers: string[]) => {
    const mapping: { [key: string]: string } = {};
    const rules: { [key: string]: string[] } = {
      sapCode: ['codigo sap', 'código sap', 'sapcode', 'sap', 'código', 'codigo'],
      name: ['composto', 'nome', 'name', 'material', 'item', 'identificação', 'identificacao'],
      category: ['categoria', 'category', 'tipo', 'setor'],
      quantityVal: ['quantidade', 'volume', 'quantityval', 'qty', 'amount', 'qtd', 'quantidades'],
      unit: ['unidade', 'unit', 'unid', 'unidade de medida'],
      batch: ['lote', 'batch', 'lot', 'lotes'],
      expiryDate: ['validade', 'data de validade', 'expirydate', 'expiry', 'data validade', 'vencimento'],
      location: ['posição', 'posicao', 'endereço', 'endereco', 'location', 'rack', 'slot', 'prateleira'],
      supplier: ['fornecedor', 'supplier', 'origem', 'fabricante'],
      responsible: ['operador', 'responsável', 'responsavel', 'operator', 'responsible', 'operador responsável'],
      purity: ['pureza', 'teor pureza', 'purity', 'teor', 'pureza %'],
      criticalLimit: ['limite crítico', 'limite critico', 'criticallimit', 'min', 'limite', 'critico'],
      notes: ['notas', 'observações', 'observacoes', 'notes', 'comment', 'comentários', 'comentarios']
    };

    headers.forEach((h, index) => {
      const normalized = h.toLowerCase().trim();
      for (const [key, aliases] of Object.entries(rules)) {
        if (aliases.includes(normalized) || aliases.some(alias => normalized.includes(alias))) {
          mapping[key] = h; // Map standard DB key to the literal uploaded header column
          break;
        }
      }
    });

    setColumnMapping(mapping);
    return mapping;
  };

  // Upload and parse spreadsheet trigger
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const { headers, rows } = parseCSV(text);
        
        if (headers.length === 0 || rows.length === 0) {
          throw new Error('Nenhum dado legível localizado na planilha. Certifique-se de que não está vazia.');
        }

        const mapping = mapHeadersToKeys(headers);
        setParsedHeaders(headers);

        // Convert rows to temporary key-value preview array
        const previewRows = rows.map((row) => {
          const item: any = {};
          // Map schema keys to indices
          const keys = [
            'sapCode', 'name', 'category', 'quantityVal', 'unit', 'batch',
            'expiryDate', 'location', 'supplier', 'responsible', 'purity',
            'criticalLimit', 'notes'
          ];
          
          keys.forEach(key => {
            const uploadedHeader = mapping[key];
            if (uploadedHeader) {
              const headerIndex = headers.indexOf(uploadedHeader);
              if (headerIndex !== -1 && row[headerIndex] !== undefined) {
                item[key] = row[headerIndex];
              }
            }
          });
          return item;
        });

        setUploadedPreviewData(previewRows);
      } catch (err: any) {
        setUploadError(err.message || 'Falha ao processar arquivo.');
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  // Triggers template download compatible with Excel / Google Sheets
  const downloadCSVTemplate = () => {
    const headers = [
      'Código SAP',
      'Composto',
      'Categoria',
      'Quantidade',
      'Unidade',
      'Lote',
      'Data de Validade',
      'Posição',
      'Fornecedor',
      'Responsável',
      'Pureza %',
      'Limite Crítico',
      'Notas'
    ];
    
    const sampleRow = [
      'MP-1051',
      'Carbonato de Lítio Especial',
      'Matéria-prima',
      '450',
      'kg',
      'B2026-99',
      '2027-10-31',
      'RA-C2-P3',
      'ALBEMARLE CORP',
      currentUser.name,
      '99.5',
      '150',
      'Lote homologado de alta pureza para baterias.'
    ];
    
    // Semicolon separator with UTF-8 BOM so Excel opens with correct encoding automatically
    const content = '\uFEFF' + [headers.join(';'), sampleRow.join(';')].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'StockPile_ModeloPlanilha.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exports the whole live database directly into Excel / Google Sheets
  const exportDatabaseToCSV = () => {
    const headers = [
      'Código SAP',
      'Composto',
      'Categoria',
      'Quantidade',
      'Unidade',
      'Lote',
      'Data de Validade',
      'Posição',
      'Fornecedor',
      'Responsável',
      'Pureza %',
      'Limite Crítico',
      'Notas'
    ];

    const rows = materials.map(m => [
      m.sapCode,
      m.name,
      m.category,
      m.quantityVal,
      m.unit,
      m.batch,
      m.expiryDate,
      m.location,
      m.supplier,
      m.responsible,
      m.purity,
      m.criticalLimit,
      m.notes ? m.notes.replace(/\r?\n/g, ' ') : ''
    ]);

    const content = '\uFEFF' + [
      headers.join(';'),
      ...rows.map(row => row.map(val => {
        const valStr = String(val);
        // Escape enclosing semicolon & double quotes as standard
        if (valStr.includes(';') || valStr.includes('\n') || valStr.includes('"')) {
          return `"${valStr.replace(/"/g, '""')}"`;
        }
        return valStr;
      }).join(';'))
    ].join('\n');

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'StockPile_BaseEstoque_Excel.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Links and appends or replaces materials
  const handleImportAction = (replaceAll: boolean) => {
    if (uploadedPreviewData.length === 0) return;
    
    const parsedMaterials = uploadedPreviewData.map((row, i) => {
      const id = 'mat-imported-' + Date.now() + '-' + i;
      
      const qtyVal = Number(row.quantityVal) || 0;
      const critLimit = Number(row.criticalLimit) || 0;
      const expDate = row.expiryDate || '2027-12-31';

      // Status translation
      let status: 'valid' | 'critical' | 'expired' = 'valid';
      const isExpired = new Date(expDate) < new Date('2026-05-20');
      if (isExpired) {
        status = 'expired';
      } else if (qtyVal <= critLimit) {
        status = 'critical';
      }

      const mat: Material = {
        id,
        sapCode: row.sapCode || 'MP-' + Math.floor(1000 + Math.random() * 9000),
        name: row.name || 'Composto Importado #' + (i + 1),
        category: (['Matéria-prima', 'Insumo Químico', 'Embalagem', 'Produto Acabado'].includes(row.category)
          ? row.category
          : 'Matéria-prima') as any,
        quantity: `${qtyVal} ${row.unit || 'kg'}`,
        quantityVal: qtyVal,
        unit: row.unit || 'kg',
        batch: row.batch || 'B2026-' + Math.floor(10 + Math.random() * 90),
        expiryDate: expDate,
        status: status,
        location: row.location || 'RA-A1-P1',
        supplier: row.supplier || 'Importador Integrado',
        responsible: row.responsible || currentUser.name,
        purity: Number(row.purity) || 100,
        criticalLimit: critLimit,
        invoiceAttached: false,
        invoiceName: null,
        invoiceDate: null,
        notes: row.notes || 'Composto importado via planilha Excel/Sheets.',
        history: [
          {
            id: 'h-import-' + Date.now() + '-' + i,
            date: '2026-05-20',
            type: 'Entrada',
            quantityChange: `+${qtyVal} ${row.unit || 'kg'}`,
            description: `Importação em lote de planilha vinculada.`,
            user: currentUser.name
          }
        ]
      };
      return mat;
    });

    if (replaceAll) {
      setMaterials(parsedMaterials);
      setSelectedMaterial(parsedMaterials[0] || null);
    } else {
      setMaterials(prev => [...parsedMaterials, ...prev]);
      setSelectedMaterial(parsedMaterials[0] || null);
    }

    // Reset and close
    setUploadedPreviewData([]);
    setParsedHeaders([]);
    setIsExcelModalOpen(false);
  };
  
  // Form States for edit / create
  const [editFormData, setEditFormData] = useState({
    name: '',
    sapCode: '',
    category: 'Matéria-prima' as any,
    quantityVal: 0,
    unit: 'kg',
    batch: '',
    expiryDate: '',
    location: '',
    supplier: '',
    responsible: '',
    purity: 99.0,
    criticalLimit: 100,
    notes: ''
  });

  const [newFormData, setNewFormData] = useState({
    name: '',
    sapCode: 'MP-',
    category: 'Matéria-prima' as any,
    quantityVal: 100,
    unit: 'kg',
    batch: 'B2026-' + Math.floor(10 + Math.random() * 90),
    expiryDate: '2027-05-20',
    location: 'RA-A1-P1',
    supplier: 'POSCO CHEMICAL',
    responsible: currentUser.name,
    purity: 98.0,
    criticalLimit: 50,
    notes: ''
  });

  // Trigger Edit Modal
  const handleOpenEdit = (m: Material) => {
    setEditFormData({
      name: m.name,
      sapCode: m.sapCode,
      category: m.category,
      quantityVal: m.quantityVal,
      unit: m.unit,
      batch: m.batch,
      expiryDate: m.expiryDate,
      location: m.location,
      supplier: m.supplier,
      responsible: m.responsible,
      purity: m.purity,
      criticalLimit: m.criticalLimit,
      notes: m.notes
    });
    setIsEditOpen(true);
  };

  // Save Edits back to Parent
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    // Calculate status
    let status: 'valid' | 'critical' | 'expired' = 'valid';
    const isExpired = new Date(editFormData.expiryDate) < new Date('2026-05-20');
    if (isExpired) {
      status = 'expired';
    } else if (editFormData.quantityVal <= editFormData.criticalLimit) {
      status = 'critical';
    }

    const updatedHistory: HistoryLog = {
      id: 'h-edit-' + Date.now(),
      date: '2026-05-20',
      type: 'Ajuste Crítico',
      description: `Alteração técnica de dados cadastrais efetuada por ${currentUser.name}. Estoque atual: ${editFormData.quantityVal} ${editFormData.unit}.`,
      user: currentUser.name
    };

    const updatedList = materials.map(m => {
      if (m.id === selectedMaterial.id) {
        const item: Material = {
          ...m,
          ...editFormData,
          quantity: `${editFormData.quantityVal} ${editFormData.unit}`,
          status,
          history: [updatedHistory, ...m.history]
        };
        // Update selection
        setSelectedMaterial(item);
        return item;
      }
      return m;
    });

    setMaterials(updatedList);
    setIsEditOpen(false);
  };

  // Create new material
  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    
    let status: 'valid' | 'critical' | 'expired' = 'valid';
    const isExpired = new Date(newFormData.expiryDate) < new Date('2026-05-20');
    if (isExpired) {
      status = 'expired';
    } else if (newFormData.quantityVal <= newFormData.criticalLimit) {
      status = 'critical';
    }

    const newMaterial: Material = {
      id: 'mat-' + Date.now(),
      sapCode: newFormData.sapCode,
      name: newFormData.name,
      category: newFormData.category,
      quantity: `${newFormData.quantityVal} ${newFormData.unit}`,
      quantityVal: Number(newFormData.quantityVal),
      unit: newFormData.unit,
      batch: newFormData.batch,
      expiryDate: newFormData.expiryDate,
      status: status,
      location: newFormData.location,
      supplier: newFormData.supplier,
      responsible: newFormData.responsible,
      purity: Number(newFormData.purity),
      criticalLimit: Number(newFormData.criticalLimit),
      invoiceAttached: false,
      invoiceName: null,
      invoiceDate: null,
      notes: newFormData.notes || 'Nenhum comentário adicional.',
      history: [
        {
          id: 'h-new-' + Date.now(),
          date: '2026-05-20',
          type: 'Entrada',
          quantityChange: `+${newFormData.quantityVal} ${newFormData.unit}`,
          description: `Novo lote recebido e cadastrado inicialmente no Almoxarifado.`,
          user: currentUser.name
        }
      ]
    };

    const updatedList = [newMaterial, ...materials];
    setMaterials(updatedList);
    setSelectedMaterial(newMaterial);
    setIsNewOpen(false);
    
    // Reset form
    setNewFormData({
      name: '',
      sapCode: 'MP-',
      category: 'Matéria-prima',
      quantityVal: 100,
      unit: 'kg',
      batch: 'B2026-' + Math.floor(10 + Math.random() * 90),
      expiryDate: '2027-05-20',
      location: 'RA-A1-P1',
      supplier: 'POSCO CHEMICAL',
      responsible: currentUser.name,
      purity: 98.0,
      criticalLimit: 50,
      notes: ''
    });
  };

  // Delete product
  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Tem certeza de que deseja remover este material permanentemente do cadastro StockPile?')) {
      const updatedList = materials.filter(m => m.id !== id);
      setMaterials(updatedList);
      setSelectedMaterial(updatedList[0] || null);
    }
  };

  // Attach Invoice simulation
  const handleAttachInvoice = () => {
    if (!selectedMaterial) return;
    const randomNFNumber = Math.floor(1000000 + Math.random() * 9000000);
    const invoiceName = `NF_SERIE_${randomNFNumber}_SF.pdf`;

    const updatedHistory: HistoryLog = {
      id: 'h-nf-' + Date.now(),
      date: '2026-05-20',
      type: 'Anexo de NF',
      description: `Nota Fiscal Eletrônica [${invoiceName}] anexada com sucesso por ${currentUser.name}.`,
      user: currentUser.name
    };

    const updatedList = materials.map(m => {
      if (m.id === selectedMaterial.id) {
        const item: Material = {
          ...m,
          invoiceAttached: true,
          invoiceName,
          invoiceDate: '2026-05-20',
          history: [updatedHistory, ...m.history]
        };
        setSelectedMaterial(item);
        return item;
      }
      return m;
    });

    setMaterials(updatedList);
    alert(`Nota fiscal mock [${invoiceName}] anexada com sucesso ao item ${selectedMaterial.name}!`);
  };

  // Filter materials based on search text and category selection
  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.sapCode.toLowerCase().includes(search.toLowerCase()) ||
                          m.batch.toLowerCase().includes(search.toLowerCase()) ||
                          m.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 select-none animate-fade-in" id="materials-manager">
      
      {/* Upper action bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/45 backdrop-blur-md p-4 rounded-2xl border border-slate-900 shadow-xl" id="materials-actions-bar">
        {/* Search Input - Clean Dark Glass Setup */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all font-mono"
            placeholder="Filtre por SAP, lote, posição..."
          />
        </div>

        {/* Categories Tab Pill filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0" id="cat-filters">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'Matéria-prima', label: 'Matérias-Primas' },
            { id: 'Insumo Químico', label: 'Químicos' },
            { id: 'Embalagem', label: 'Embalagens' },
            { id: 'Produto Acabado', label: 'Acabados' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(255,107,0,0.2)]' 
                  : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 border border-slate-800/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Actions buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          {/* Planilhas Excel / Sheets Integration Button */}
          <button
            onClick={() => setIsExcelModalOpen(true)}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold py-2.5 px-4.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-800"
          >
            <FileSpreadsheet className="h-4.5 w-4.5 text-emerald-500" />
            <span className="font-mono uppercase tracking-wider">Sincronizar Planilha</span>
          </button>

          {/* Create button */}
          <button
            onClick={() => setIsNewOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-xs font-bold py-2.5 px-4.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(255,107,0,0.25)] border border-orange-500/20"
          >
            <Plus className="h-4.5 w-4.5" />
            <span className="font-mono uppercase tracking-wider">Novo Lote</span>
          </button>
        </div>
      </div>

      {/* Main split display: Grid table left, detail side pane right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="split-workspace">
        
        {/* Left side: Material List Grid */}
        <div className="lg:col-span-7 bg-slate-950/45 backdrop-blur-md rounded-2xl border border-slate-900 shadow-2xl overflow-hidden flex flex-col" id="left-table-pane">
          <div className="p-4 bg-slate-950/30 border-b border-slate-900/80 flex items-center justify-between">
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-350">Cadastros Operacionais ({filteredMaterials.length})</h2>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Estoque Ativo: {materials.length} Lotes</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse" id="materials-dt">
              <thead>
                <tr className="border-b border-slate-900 text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/10">
                  <th className="py-3 px-4">Composto</th>
                  <th className="py-3 px-3">Lote</th>
                  <th className="py-3 px-3">Volume</th>
                  <th className="py-3 px-3">Validade</th>
                  <th className="py-3 px-3">Prateleira</th>
                  <th className="py-3 px-3 text-center">Teor Pureza</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-xs">
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-mono text-xs">
                      Nenhum material localizado no banco de dados ativo.
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map(m => {
                    const isSelected = selectedMaterial?.id === m.id;
                    const statusConfig = {
                      valid: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.06)]', label: 'Válido', icon: '●' },
                      critical: { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.06)]', label: 'Crítico', icon: '▲' },
                      expired: { bg: 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.06)]', label: 'Vencido', icon: '■' }
                    }[m.status];

                    return (
                      <tr
                        key={m.id}
                        onClick={() => setSelectedMaterial(m)}
                        className={`hover:bg-slate-900/40 cursor-pointer transition-colors ${
                          isSelected ? 'bg-orange-500/5 border-l-4 border-l-orange-500' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-100">{m.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{m.sapCode}</div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-slate-400">{m.batch}</td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-200">{m.quantity}</div>
                          <div className="text-[9px] text-slate-500 font-mono mt-0.5">MÍN: {m.criticalLimit} {m.unit}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono tracking-wide leading-none flex items-center gap-1.5 w-max ${statusConfig?.bg}`}>
                            <span className="text-[8px]">{statusConfig?.icon}</span> {m.expiryDate}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-orange-450">{m.location}</td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`font-mono font-bold ${m.purity >= 99 ? 'text-[#438AF3] drop-shadow-[0_0_8px_rgba(67,138,243,0.3)]' : m.purity < 95 ? 'text-red-400' : 'text-slate-300'}`}>
                            {m.purity === 100 && m.category === 'Embalagem' ? '-' : `${m.purity}%`}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side: Detailed Inspection & Actions cards */}
        <div className="lg:col-span-5 space-y-4" id="right-details-pane">
          {selectedMaterial ? (
            <div className="space-y-4 animate-fade-in" id="material-profile">
              
              {/* Profile Card Header */}
              <div className="bg-slate-950/60 backdrop-blur-xl p-5 rounded-2xl border border-slate-850/80 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#438AF3]/5 rounded-full blur-2xl" />
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                      {selectedMaterial.category}
                    </span>
                    <h3 className="text-base font-black mt-2 text-white font-sans tracking-tight">{selectedMaterial.name}</h3>
                    <p className="text-[10px] text-slate-450 font-mono mt-0.5">{selectedMaterial.sapCode} · Lote: {selectedMaterial.batch}</p>
                  </div>
                  <div>
                    {selectedMaterial.status === 'valid' ? (
                      <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-[9px] font-mono tracking-widest px-2.5 py-1 rounded shadow-sm">OK · CONFORME</span>
                    ) : selectedMaterial.status === 'critical' ? (
                      <span className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[9px] font-mono tracking-widest px-2.5 py-1 rounded shadow-sm animate-pulse">ALERTA CRÍTICO</span>
                    ) : (
                      <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[9px] font-mono tracking-widest px-2.5 py-1 rounded shadow-sm animate-bounce">EXPIRADO</span>
                    )}
                  </div>
                </div>

                {/* Sub-details line */}
                <div className="grid grid-cols-2 gap-4 mt-5 border-t border-slate-900/80 pt-4 text-xs font-mono" id="profile-key-details">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">RACK ENDEREÇADO:</span>
                    <strong className="text-orange-450 text-xs font-bold font-mono tracking-wide mt-0.5 block">{selectedMaterial.location}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">RESTO EM ESTOQUE:</span>
                    <strong className="text-slate-200 text-xs font-sans mt-0.5 block">{selectedMaterial.quantity}</strong>
                  </div>
                </div>

                {/* Map Quick locator button */}
                {onLocateOnMap && (
                  <button 
                    onClick={() => onLocateOnMap(selectedMaterial.location)}
                    className="w-full mt-4 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 font-mono uppercase tracking-wide cursor-pointer"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>VERIFICAR NO RACK 📍</span>
                  </button>
                )}
              </div>

              {/* RASTREABILIDADE COMPLETA Tab */}
              <div className="glass-panel p-5 rounded-2xl border border-slate-900 shadow-xl">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-900 mb-4 text-slate-300">
                  <Network className="h-4 w-4 text-orange-500 animate-pulse" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider font-mono">Dossiê de Rastreabilidade End-to-End</h4>
                </div>

                <div className="relative pl-6 space-y-4" id="traceability-flow">
                  {/* Continuity vertical strip */}
                  <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-900" />

                  {/* 1. Origem / Fornecedor */}
                  <div className="flex items-start gap-3 relative text-xs" id="trace-step-supplier">
                    <span className="absolute left-[-23px] h-5 w-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px]">🏢</span>
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">Unidade Fabril de Origem</span>
                      <p className="text-slate-450 text-[10px] mt-0.5">Parceiro registrado: <strong>{selectedMaterial.supplier}</strong>.</p>
                    </div>
                  </div>

                  {/* 2. Laboratório de Controle de Qualidade */}
                  <div className="flex items-start gap-3 relative text-xs" id="trace-step-lab">
                    <span className="absolute left-[-23px] h-5 w-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px]">🧪</span>
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">Laudo Químico e Grau de Pureza</span>
                      <p className="text-slate-455 text-[10px] mt-0.5">
                        Pureza analisada: <strong className="text-[#438AF3]">{selectedMaterial.category === 'Embalagem' ? 'N/A' : `${selectedMaterial.purity}%`}</strong>.
                        {selectedMaterial.purity >= 98 ? ' Homologado Grau Bateria.' : ' Necessita novos exames.'}
                      </p>
                    </div>
                  </div>

                  {/* 3. Recebimento e Conferência */}
                  <div className="flex items-start gap-3 relative text-xs" id="trace-step-receiver">
                    <span className="absolute left-[-23px] h-5 w-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px]">🧑‍🔧</span>
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">Amortecimento e Prateleira</span>
                      <p className="text-slate-455 text-[10px] mt-0.5">
                        Lote revisado por: <strong className="text-orange-400">{selectedMaterial.responsible}</strong>. Endereçado no rack correspondente.
                      </p>
                    </div>
                  </div>

                  {/* 4. SAP R/3 Sincronismo */}
                  <div className="flex items-start gap-3 relative text-xs" id="trace-step-sap">
                    <span className="absolute left-[-23px] h-5 w-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px]">🖥️</span>
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">Anotação Contábil SAP R/3</span>
                      <p className="text-slate-455 text-[10px] mt-0.5">
                        Registro ativo sob UUID eletrônico seguro na fila geral.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action operations row */}
              <div className="grid grid-cols-2 gap-3" id="profile-actions-buttons">
                <button
                  onClick={() => handleOpenEdit(selectedMaterial)}
                  className="bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Editar Informações</span>
                </button>

                <button
                  onClick={handleAttachInvoice}
                  className="bg-orange-500/10 text-orange-400 hover:bg-orange-550/15 text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all border border-orange-500/20 cursor-pointer shadow-sm"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                  <span>Log de Nota Fiscal 📂</span>
                </button>
              </div>

              {/* Invoice status card */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-900 flex items-center justify-between shadow-xl animate-fade-in" id="nf-status-bar">
                <div className="flex items-center gap-2.5 text-xs">
                  <FileCheck className="h-4.5 w-4.5 text-orange-500" />
                  <div>
                    <span className="font-bold block text-slate-200">Laudo Fiscal do Composto</span>
                    <p className="text-slate-500 font-mono text-[9px] mt-0.5">
                      {selectedMaterial.invoiceAttached ? selectedMaterial.invoiceName : 'Nenhuma nota ou PDF carregado para este lote.'}
                    </p>
                  </div>
                </div>
                {selectedMaterial.invoiceAttached ? (
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded font-mono font-bold">ANEXADO</span>
                ) : (
                  <span className="text-[9px] bg-slate-900/80 text-slate-500 border border-slate-800 px-2.5 py-1 rounded font-mono">PENDENTE</span>
                )}
              </div>

              {/* History trail section */}
              <div className="glass-panel p-4 rounded-2xl border border-slate-900 shadow-xl" id="history-box">
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-900 mb-3 text-slate-300">
                  <History className="h-4.5 w-4.5 text-[#438AF3]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Linha do Tempo de Quarentena & Ajustes</span>
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1" id="history-trail-scroll">
                  {selectedMaterial.history.map(log => (
                    <div key={log.id} className="text-[11px] bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/60 font-sans">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-200">{log.type}</span>
                        <span className="text-[9px] font-mono text-slate-500">{log.date}</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed text-[11.5px]">{log.description}</p>
                      <div className="flex justify-between items-center mt-1.5 text-[9px] text-slate-550 font-mono">
                        <span>Lançado por: {log.user}</span>
                        {log.quantityChange && <span className="font-bold text-orange-400">{log.quantityChange}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dangerous actions button */}
              <button
                onClick={() => handleDeleteMaterial(selectedMaterial.id)}
                className="w-full text-center hover:bg-red-500/15 text-red-400 text-[10px] font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-mono border border-red-500/15"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>EXCLUIR LOTE DO TERMINAL STOCKPILE</span>
              </button>

            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-500 rounded-2xl border border-slate-900 flex flex-col items-center justify-center min-h-[400px]" id="no-item-selected">
              <Layers className="h-8 w-8 text-slate-700 mb-2 animate-bounce" />
              <p className="text-xs font-mono">Selecione um Composto Químico da tabela para abrir o perfil de pureza.</p>
            </div>
          )}
        </div>

      </div>

      {/* EDIT MODAL DIALOG - Gorgeous Immersive Dark */}
      {isEditOpen && selectedMaterial && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4" id="edit-modal">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in" id="edit-modal-content">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-xs font-mono uppercase text-white tracking-widest flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                <span>Modificar Lote Ativo</span>
              </h3>
              <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-white font-bold font-mono">X</button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Composto</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Código SAP</label>
                  <input
                    type="text"
                    required
                    value={editFormData.sapCode}
                    onChange={(e) => setEditFormData({ ...editFormData, sapCode: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Quantidade</label>
                  <input
                    type="number"
                    required
                    value={editFormData.quantityVal}
                    onChange={(e) => setEditFormData({ ...editFormData, quantityVal: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Unidade</label>
                  <input
                    type="text"
                    required
                    value={editFormData.unit}
                    onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Limite Crítico</label>
                  <input
                    type="number"
                    required
                    value={editFormData.criticalLimit}
                    onChange={(e) => setEditFormData({ ...editFormData, criticalLimit: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Lote</label>
                  <input
                    type="text"
                    required
                    value={editFormData.batch}
                    onChange={(e) => setEditFormData({ ...editFormData, batch: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Validade</label>
                  <input
                    type="date"
                    required
                    value={editFormData.expiryDate}
                    onChange={(e) => setEditFormData({ ...editFormData, expiryDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Posição (Prateleira)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Pureza Validada (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editFormData.purity}
                    onChange={(e) => setEditFormData({ ...editFormData, purity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Fornecedor</label>
                  <input
                    type="text"
                    required
                    value={editFormData.supplier}
                    onChange={(e) => setEditFormData({ ...editFormData, supplier: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Operador Responsável</label>
                  <input
                    type="text"
                    required
                    value={editFormData.responsible}
                    onChange={(e) => setEditFormData({ ...editFormData, responsible: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Notas de Pureza/Laudo</label>
                <textarea
                  value={editFormData.notes}
                  rows={2}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs font-sans"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 text-xs">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-805 text-slate-400 border border-slate-800 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-550 hover:to-orange-450 text-white font-bold rounded-xl cursor-pointer shadow-lg"
                >
                  Salvar Modificações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW MATERIAL MODAL DIALOG */}
      {isNewOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4" id="new-modal">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in" id="new-modal-content">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-3xl">
              <h3 className="font-bold text-xs font-mono uppercase tracking-widest text-white flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-orange-450 animate-pulse" /> 
                <span>Registrar Lote no Rack</span>
              </h3>
              <button onClick={() => setIsNewOpen(false)} className="text-slate-400 hover:text-white font-bold font-mono">X</button>
            </div>

            <form onSubmit={handleCreateMaterial} className="p-5 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Identificação do Composto</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Lítio Carbonato Ultra"
                    value={newFormData.name}
                    onChange={(e) => setNewFormData({ ...newFormData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Código SAP</label>
                  <input
                    type="text"
                    required
                    value={newFormData.sapCode}
                    onChange={(e) => setNewFormData({ ...newFormData, sapCode: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Categoria de Insumo</label>
                  <select
                    value={newFormData.category}
                    onChange={(e) => setNewFormData({ ...newFormData, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 cursor-pointer"
                  >
                    <option value="Matéria-prima">Matéria-prima</option>
                    <option value="Insumo Químico">Insumo Químico</option>
                    <option value="Embalagem">Embalagem</option>
                    <option value="Produto Acabado">Produto Acabado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Parque Industrial (Origem)</label>
                  <input
                    type="text"
                    required
                    value={newFormData.supplier}
                    onChange={(e) => setNewFormData({ ...newFormData, supplier: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Vol. Inicial</label>
                  <input
                    type="number"
                    required
                    value={newFormData.quantityVal}
                    onChange={(e) => setNewFormData({ ...newFormData, quantityVal: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Unidade</label>
                  <input
                    type="text"
                    required
                    value={newFormData.unit}
                    onChange={(e) => setNewFormData({ ...newFormData, unit: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 animate-pulse"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Limite Mín.</label>
                  <input
                    type="number"
                    required
                    value={newFormData.criticalLimit}
                    onChange={(e) => setNewFormData({ ...newFormData, criticalLimit: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Código do Lote</label>
                  <input
                    type="text"
                    required
                    value={newFormData.batch}
                    onChange={(e) => setNewFormData({ ...newFormData, batch: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Data de Validade</label>
                  <input
                    type="date"
                    required
                    value={newFormData.expiryDate}
                    onChange={(e) => setNewFormData({ ...newFormData, expiryDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Endereço no Rack (ex: RA-A2-P1)</label>
                  <input
                    type="text"
                    required
                    value={newFormData.location}
                    onChange={(e) => setNewFormData({ ...newFormData, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Pureza Analisada %</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newFormData.purity}
                    onChange={(e) => setNewFormData({ ...newFormData, purity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Observações de Recebimento</label>
                <textarea
                  placeholder="Instruções de segurança ou relatórios de pureza de entrada."
                  value={newFormData.notes}
                  rows={2}
                  onChange={(e) => setNewFormData({ ...newFormData, notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-sans"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 text-xs">
                <button
                  type="button"
                  onClick={() => setIsNewOpen(false)}
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-805 text-slate-400 border border-slate-800 rounded-xl cursor-pointer font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-550 hover:to-orange-450 text-white font-bold rounded-xl cursor-pointer shadow-lg"
                >
                  Lançar Entrada no Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SPREADSHEET (EXCEL/GOOGLE SHEETS) INTEGRATION MODAL */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4" id="excel-integration-modal">
          <div className="bg-slate-900 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-slate-800 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fade-in" id="excel-modal-content">
            
            {/* Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-850 flex justify-between items-center sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-mono uppercase tracking-widest text-white">
                    Integração de Planilhas Excel / Google Sheets
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">VINCULE, IMPORTE OU EXPORTE DADOS OPERACIONAIS EM MASSA</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsExcelModalOpen(false);
                  setUploadedPreviewData([]);
                  setParsedHeaders([]);
                  setUploadError(null);
                }} 
                className="text-slate-400 hover:text-white font-mono font-bold hover:scale-115 transition-transform p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
              
              {/* Top guidance alert */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Info Card */}
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-850 space-y-2">
                  <span className="text-emerald-500 font-bold block text-[11px] uppercase tracking-wider font-mono">📤 Exportar Banco Ativo</span>
                  <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
                    Gere e salve a base de dados atual do StockPile em formato de planilha. O arquivo resultante é 100% compatível com <strong>Microsoft Excel</strong>, <strong>Google Sheets</strong> e rotinas de ERP.
                  </p>
                  <button
                    onClick={exportDatabaseToCSV}
                    className="mt-2 text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer font-bold"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>EXPORTAR PARA EXCEL (.CSV)</span>
                  </button>
                </div>

                {/* Template Download Card */}
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-850 space-y-2">
                  <span className="text-orange-400 font-bold block text-[11px] uppercase tracking-wider font-mono">📋 Modelo de Cadastro</span>
                  <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
                    Para garantir que suas colunas sejam vinculadas adequadamente aos racks virtuais e às fórmulas de quarentena, sugerimos utilizar nossa planilha modelo com as colunas corretas.
                  </p>
                  <button
                    onClick={downloadCSVTemplate}
                    className="mt-2 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all border border-slate-800 cursor-pointer font-bold"
                  >
                    <Download className="h-3.5 w-3.5 text-orange-500" />
                    <span>BAIXAR PLANILHA MODELO</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-2">
                <span className="text-slate-350 block text-[10px] uppercase font-bold tracking-wider">📥 Carregar Nova Planilha (.csv / .xlsx export / txt)</span>
                
                <div 
                  onClick={() => document.getElementById('spreadsheet-file-picker')?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950/30 hover:bg-slate-950/60 p-6 md:p-8 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group relative"
                >
                  <input
                    type="file"
                    id="spreadsheet-file-picker"
                    accept=".csv, .txt, .xlsx"
                    className="hidden"
                    onChange={handleCSVUpload}
                  />
                  <div className="h-11 w-11 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:border-emerald-500 transition-colors">
                    <Upload className="h-5 w-5 text-slate-450 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <span className="text-slate-200 block font-bold text-xs">Arraste ou clique para selecionar planilha</span>
                    <span className="text-[10px] text-slate-500 block mt-1">Formatos suportados: CSV compatível com Sheets/Excel (; ou , delimitado)</span>
                  </div>
                </div>
              </div>

              {/* Upload Error Alert if any */}
              {uploadError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Falha de Leitura</span>
                    <p className="text-[10px] mt-0.5">{uploadError}</p>
                  </div>
                </div>
              )}

              {/* Parsed Column Mapping Checklist - Shows how user columns link to internal keys */}
              {parsedHeaders.length > 0 && (
                <div className="bg-slate-950/40 p-4.5 rounded-2xl border border-slate-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse font-mono">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Mapeamento de Colunas Vinculadas
                    </span>
                    <span className="text-[9px] text-slate-500 uppercase">Delimitador Detectado: <strong className="text-slate-300">"{detectedDelimiter}"</strong></span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[10px]">
                    {[
                      { key: 'sapCode', label: 'Código SAP' },
                      { key: 'name', label: 'Composto/Nome' },
                      { key: 'category', label: 'Categoria' },
                      { key: 'quantityVal', label: 'Quantidade' },
                      { key: 'unit', label: 'Unidade' },
                      { key: 'batch', label: 'Lote' },
                      { key: 'expiryDate', label: 'Data Validade' },
                      { key: 'location', label: 'Posição no Rack' },
                      { key: 'supplier', label: 'Fornecedor' },
                      { key: 'purity', label: 'Teor Pureza' },
                      { key: 'criticalLimit', label: 'Limite Mínimo' },
                    ].map(field => {
                      const isMapped = !!columnMapping[field.key];
                      return (
                        <div 
                          key={field.key} 
                          className={`flex items-center gap-1.5 p-2 rounded-xl border ${
                            isMapped 
                              ? 'bg-emerald-550/5 border-emerald-500/20 text-emerald-400' 
                              : 'bg-slate-950/50 border-slate-900 text-slate-500'
                          }`}
                        >
                          {isMapped ? (
                            <span className="text-[8px] text-emerald-500">✔</span>
                          ) : (
                            <span className="text-[8px] text-slate-650">✖</span>
                          )}
                          <div className="truncate">
                            <span className="font-bold block text-[9.5px] truncate">{field.label}</span>
                            <span className="text-[8px] font-mono text-slate-500 block truncate">
                              {isMapped ? columnMapping[field.key] : 'padrão/vazio'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Data Preview Table before committing */}
              {uploadedPreviewData.length > 0 && (
                <div className="space-y-2">
                  <span className="text-slate-350 block text-[10px] uppercase font-bold tracking-wider">
                    Pré-visualização do Lote Identificado ({uploadedPreviewData.length} registros)
                  </span>

                  <div className="border border-slate-900 rounded-2xl bg-slate-950/40 overflow-hidden">
                    <div className="max-h-56 overflow-y-auto overflow-x-auto text-[10.5px]">
                      <table className="w-full text-left border-collapse font-sans">
                        <thead>
                          <tr className="border-b border-slate-900 text-[8.5px] font-mono text-slate-500 uppercase tracking-wider bg-slate-950">
                            <th className="py-2.5 px-3">Composto (SAP)</th>
                            <th className="py-2.5 px-3">Categoria</th>
                            <th className="py-2.5 px-3">Efetivo/Lote</th>
                            <th className="py-2.5 px-3">Localização</th>
                            <th className="py-2.5 px-3">Pureza %</th>
                            <th className="py-2.5 px-3">Validade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/40 font-sans text-xs">
                          {uploadedPreviewData.slice(0, 10).map((row, index) => (
                            <tr key={index} className="hover:bg-slate-900/10">
                              <td className="py-2 px-3 animate-fade-in">
                                <div className="font-bold text-slate-200">{row.name || 'Composto não identificado'}</div>
                                <div className="text-[9.5px] font-mono text-slate-500 mt-0.5">{row.sapCode || 'Sem código'}</div>
                              </td>
                              <td className="py-2 px-3">
                                <span className="bg-slate-900/60 text-slate-400 border border-slate-800 p-1 px-2 rounded-md text-[9.5px]">
                                  {row.category || 'Matéria-prima'}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-sans">
                                <div className="font-bold text-slate-350">{row.quantityVal || 0} {row.unit || 'kg'}</div>
                                <div className="text-[9.5px] font-mono text-slate-500 mt-0.5">LOTE: {row.batch || 'Autogerado'}</div>
                              </td>
                              <td className="py-2 px-3 font-mono font-bold text-orange-450">
                                {row.location || 'Sem posição'}
                              </td>
                              <td className="py-2 px-3 font-mono">
                                {row.purity ? `${row.purity}%` : '100%'}
                              </td>
                              <td className="py-2 px-3 font-mono text-slate-450">
                                <span className="p-0.5 px-1.5 rounded bg-orange-500/5 text-orange-400 text-[10px] border border-orange-500/10">
                                  📆 {row.expiryDate || 'Longa'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {uploadedPreviewData.length > 10 && (
                      <div className="p-2 text-center text-[9.5px] text-slate-500 bg-slate-950 font-mono border-t border-slate-900">
                        ... E mais {uploadedPreviewData.length - 10} compostos na fila de carregamento.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Footer Commands with Linking parameters */}
            <div className="p-5 bg-slate-950 border-t border-slate-850 flex flex-col sm:flex-row justify-between gap-3 sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setUploadedPreviewData([]);
                  setParsedHeaders([]);
                  setUploadError(null);
                  setIsExcelModalOpen(false);
                }}
                className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-805 text-slate-400 border border-slate-800 rounded-xl cursor-pointer text-xs font-bold text-center order-2 sm:order-1 font-bold"
              >
                FECHAR GESTOR
              </button>

              {uploadedPreviewData.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
                  {/* Append Action */}
                  <button
                    onClick={() => handleImportAction(false)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer font-bold"
                  >
                    <Database className="h-4 w-4" />
                    <span>VINCULAR & ADICIONAR ITENS</span>
                  </button>

                  {/* Overwrite action */}
                  <button
                    onClick={() => {
                      if (window.confirm('ATENÇÃO: Deseja realmente excluir TODOS os registros atuais do StockPile e substituí-los inteiramente pelo arquivo importado? Esta ação limpa o rack e não pode ser desfeita.')) {
                        handleImportAction(true);
                      }
                    }}
                    className="bg-slate-900 hover:bg-red-950 text-red-400 border border-slate-800 hover:border-red-900 font-bold text-xs py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold"
                  >
                    <span>SOBRESCREVER RACKS</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
