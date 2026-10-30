import { SavedLoan } from '../types';
import jsPDF from 'jspdf';
import { FileText, Download } from 'lucide-react';

interface Props {
  loan: SavedLoan;
}

export default function ContractGenerator({ loan }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const generateContract = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Título
    doc.setFontSize(20);
    doc.setTextColor(40, 60, 100);
    doc.text('CONTRATO DE PRÉSTAMO', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Sistema de Gestión de Préstamos', pageWidth / 2, 28, { align: 'center' });
    
    // Línea separadora
    doc.setDrawColor(40, 60, 100);
    doc.line(20, 32, pageWidth - 20, 32);
    
    // Fecha del contrato
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-BO')}`, 20, 40);
    
    // Información de las partes
    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text('I. PARTES DEL CONTRATO', 20, 55);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`PRESTAMISTA: [Nombre del Prestamista]`, 20, 65);
    doc.text(`CI/NIT: [Número de identificación]`, 20, 72);
    doc.text(`Dirección: [Dirección del prestamista]`, 20, 79);
    
    doc.text(`PRESTATARIO: ${loan.clientName}`, 20, 92);
    doc.text(`CI/NIT: [Número de identificación del cliente]`, 20, 99);
    doc.text(`Dirección: [Dirección del cliente]`, 20, 106);
    
    // Información del préstamo
    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text('II. INFORMACIÓN DEL PRÉSTAMO', 20, 122);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Nombre del préstamo: ${loan.name}`, 20, 132);
    doc.text(`Monto del préstamo: Bs. ${formatCurrency(loan.params.amount)}`, 20, 139);
    doc.text(`Tasa de interés mensual: ${loan.params.monthlyRate}%`, 20, 146);
    doc.text(`Plazo: ${loan.params.term} meses`, 20, 153);
    doc.text(`Fecha de inicio: ${formatDate(loan.params.startDate)}`, 20, 160);
    doc.text(`Cuota mensual: Bs. ${formatCurrency(loan.summary.monthlyPayment)}`, 20, 167);
    doc.text(`Total a pagar: Bs. ${formatCurrency(loan.summary.totalPayment)}`, 20, 174);
    doc.text(`Total de intereses: Bs. ${formatCurrency(loan.summary.totalInterest)}`, 20, 181);
    
    // Cláusulas
    doc.setFontSize(12);
    doc.setTextColor(40, 60, 100);
    doc.text('III. CLÁUSULAS', 20, 197);
    
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const clauses = [
      'PRIMERA: El PRESTAMISTA se compromete a entregar al PRESTATARIO la suma de Bs. ' + formatCurrency(loan.params.amount) + ' en la fecha de inicio del préstamo.',
      'SEGUNDA: El PRESTATARIO se compromete a devolver el monto prestado más los intereses correspondientes en ' + loan.params.term + ' cuotas mensuales de Bs. ' + formatCurrency(loan.summary.monthlyPayment) + ' cada una.',
      'TERCERA: La tasa de interés mensual aplicable será del ' + loan.params.monthlyRate + '% sobre el saldo pendiente.',
      'CUARTA: En caso de mora en el pago de cualquier cuota, se aplicará un interés moratorio del 2% mensual sobre el monto vencido.',
      'QUINTA: El PRESTATARIO podrá realizar pagos anticipados total o parcialmente, sin penalidad, lo que reducirá el saldo pendiente y los intereses futuros.',
      'SEXTA: El incumplimiento en el pago de 3 cuotas consecutivas dará derecho al PRESTAMISTA a exigir el pago total del saldo pendiente.',
    ];
    
    let yPos = 207;
    clauses.forEach((clause, idx) => {
      const lines = doc.splitTextToSize(clause, pageWidth - 40);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 5 + 3;
    });
    
    // Firmas
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(40, 60, 100);
    doc.text('IV. FIRMAS', 20, yPos);
    
    yPos += 15;
    doc.setDrawColor(100, 100, 100);
    doc.line(20, yPos, 80, yPos);
    doc.line(pageWidth - 80, yPos, pageWidth - 20, yPos);
    
    yPos += 5;
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text('PRESTAMISTA', 50, yPos, { align: 'center' });
    doc.text('PRESTATARIO', pageWidth - 50, yPos, { align: 'center' });
    
    yPos += 5;
    doc.text('[Nombre del Prestamista]', 50, yPos, { align: 'center' });
    doc.text(loan.clientName, pageWidth - 50, yPos, { align: 'center' });
    
    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Contrato generado el ${new Date().toLocaleString('es-BO')} | ID: ${loan.id}`, pageWidth / 2, 285, { align: 'center' });
    
    // Guardar
    doc.save(`contrato_${loan.name.replace(/\s+/g, '_')}_${loan.id}.pdf`);
  };

  return (
    <button
      onClick={generateContract}
      className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
    >
      <FileText className="w-4 h-4" />
      Generar Contrato PDF
    </button>
  );
}
