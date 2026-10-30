import { useState } from 'react';
import * as XLSX from 'xlsx';
import { LoanParams } from '../types';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from 'lucide-react';

interface Props {
  onImport: (loans: Array<{ params: LoanParams; name: string; clientName: string }>) => void;
}

interface ImportedLoan {
  name: string;
  clientName: string;
  amount: number;
  monthlyRate: number;
  term: number;
  startDate: string;
  isValid: boolean;
  errors: string[];
}

export default function ExcelImport({ onImport }: Props) {
  const [importedLoans, setImportedLoans] = useState<ImportedLoan[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const loans: ImportedLoan[] = jsonData.map((row: any, index: number) => {
        const errors: string[] = [];
        
        const name = row['Nombre'] || row['name'] || `Préstamo ${index + 1}`;
        const clientName = row['Cliente'] || row['client'] || row['clientName'] || 'Sin nombre';
        const amount = parseFloat(row['Monto'] || row['amount'] || 0);
        const monthlyRate = parseFloat(row['Tasa'] || row['rate'] || row['monthlyRate'] || 0);
        const term = parseInt(row['Plazo'] || row['term'] || 0);
        const startDate = row['Fecha'] || row['startDate'] || new Date().toISOString().split('T')[0];

        if (!amount || amount <= 0) errors.push('Monto inválido');
        if (!monthlyRate || monthlyRate <= 0) errors.push('Tasa inválida');
        if (!term || term <= 0) errors.push('Plazo inválido');

        return {
          name,
          clientName,
          amount,
          monthlyRate,
          term,
          startDate,
          isValid: errors.length === 0,
          errors,
        };
      });

      setImportedLoans(loans);
      setShowModal(true);
    };

    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    const validLoans = importedLoans.filter(l => l.isValid);
    if (validLoans.length === 0) return;

    onImport(validLoans.map(l => ({
      params: {
        amount: l.amount,
        monthlyRate: l.monthlyRate,
        term: l.term,
        startDate: l.startDate,
      },
      name: l.name,
      clientName: l.clientName,
    })));

    setImportedLoans([]);
    setFileName('');
    setShowModal(false);
  };

  const downloadTemplate = () => {
    const template = [
      { Nombre: 'Préstamo 1', Cliente: 'Juan Pérez', Monto: 1000, Tasa: 10, Plazo: 12, Fecha: '2024-01-05' },
      { Nombre: 'Préstamo 2', Cliente: 'María López', Monto: 5000, Tasa: 8, Plazo: 24, Fecha: '2024-02-10' },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Préstamos');
    XLSX.writeFile(wb, 'plantilla_prestamos.xlsx');
  };

  const validCount = importedLoans.filter(l => l.isValid).length;
  const invalidCount = importedLoans.filter(l => !l.isValid).length;

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-400" />
          Importar Préstamos desde Excel
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all cursor-pointer">
              <FileSpreadsheet className="w-5 h-5" />
              <span>Seleccionar archivo Excel</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={downloadTemplate}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-all"
            >
              📥 Descargar Plantilla
            </button>
          </div>

          {fileName && (
            <p className="text-sm text-slate-400">
              Archivo cargado: <span className="text-white font-medium">{fileName}</span>
            </p>
          )}

          <div className="bg-slate-900/30 rounded-lg p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-2">📋 Formato esperado del Excel:</p>
            <p>Columnas: Nombre, Cliente, Monto, Tasa (%), Plazo (meses), Fecha</p>
            <p className="mt-2 text-slate-500">Ejemplo: Juan Pérez | 1000 | 10 | 12 | 2024-01-05</p>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full border border-blue-500/30 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">
                Importar {importedLoans.length} préstamos
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-xs text-slate-400">Válidos</p>
                <p className="text-2xl font-bold text-green-400">{validCount}</p>
              </div>
              <div className="flex-1 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-xs text-slate-400">Inválidos</p>
                <p className="text-2xl font-bold text-red-400">{invalidCount}</p>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
              {importedLoans.map((loan, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-3 border ${
                    loan.isValid
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {loan.isValid ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-sm font-medium text-white">{loan.name}</span>
                        <span className="text-xs text-slate-400">- {loan.clientName}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-slate-400 ml-6">
                        <span>Monto: Bs. {loan.amount}</span>
                        <span>Tasa: {loan.monthlyRate}%</span>
                        <span>Plazo: {loan.term} meses</span>
                      </div>
                      {loan.errors.length > 0 && (
                        <div className="ml-6 mt-1">
                          {loan.errors.map((error, i) => (
                            <p key={i} className="text-xs text-red-400">• {error}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleImport}
                disabled={validCount === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Importar {validCount} préstamos válidos
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
