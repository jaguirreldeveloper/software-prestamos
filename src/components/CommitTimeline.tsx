import { useState } from 'react';
import { GitCommit, FileCode, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

interface CommitInfo {
  id: string;
  hash: string;
  type: string;
  scope: string;
  message: string;
  files: { name: string; description: string; lines?: string }[];
  description: string;
  color: string;
  icon: string;
}

const commits: CommitInfo[] = [
  {
    id: '1',
    hash: 'a1b2c3d',
    type: 'chore',
    scope: 'setup',
    message: 'Setup inicial del proyecto con Vite + React + Tailwind',
    files: [
      { name: 'index.html', description: 'HTML base con título y fuentes' },
      { name: 'src/index.css', description: 'Importación de Tailwind CSS' },
      { name: 'src/main.tsx', description: 'Entry point de React' },
    ],
    description: 'Configuración base del proyecto con las dependencias fundamentales: Vite como bundler, React 18 como framework y Tailwind CSS para estilos.',
    color: 'slate',
    icon: '⚙️',
  },
  {
    id: '2',
    hash: 'e4f5g6h',
    type: 'feat',
    scope: 'types',
    message: 'Definir interfaces para préstamos, amortización y pagos',
    files: [
      { name: 'src/types.ts', description: 'LoanParams, AmortizationRow, PaymentRecord, SavedLoan, RateComparison' },
    ],
    description: 'Tipos TypeScript centralizados para todo el sistema. Define la estructura de datos para parámetros de préstamo, filas de amortización, registros de pago, préstamos guardados y comparaciones de tasas.',
    color: 'purple',
    icon: '📐',
  },
  {
    id: '3',
    hash: 'i7j8k9l',
    type: 'feat',
    scope: 'app',
    message: 'Componente principal con navegación por pestañas y lógica de amortización',
    files: [
      { name: 'src/App.tsx', description: 'Layout, tabs, calculateAmortization(), estado global' },
    ],
    description: 'Componente raíz que orquesta toda la aplicación. Incluye sistema de navegación por pestañas, función calculateAmortization con fórmula de amortización francesa, y gestión de estado para préstamos.',
    color: 'blue',
    icon: '🏗️',
  },
  {
    id: '4',
    hash: 'm0n1o2p',
    type: 'feat',
    scope: 'calculator',
    message: 'Calculadora con sliders, presets y modal de guardado',
    files: [
      { name: 'src/components/LoanCalculator.tsx', description: 'Formulario, sliders, presets, resumen, modal de guardado' },
    ],
    description: 'Calculadora interactiva con inputs para monto, tasa mensual, plazo y fecha de inicio. Incluye sliders con rangos, plantillas rápidas predefinidas, resumen de resultados en tiempo real y modal para guardar préstamos.',
    color: 'cyan',
    icon: '🧮',
  },
  {
    id: '5',
    hash: 'q3r4s5t',
    type: 'feat',
    scope: 'dashboard',
    message: 'Panel visual con gráficos de composición, evolución y métricas',
    files: [
      { name: 'src/components/Dashboard.tsx', description: 'KPIs, PieChart, AreaChart, BarChart, métricas clave' },
    ],
    description: 'Dashboard con 4 KPIs principales, gráfico de torta (capital vs intereses), gráfico de área (evolución del saldo), gráfico de barras (capital/interés por cuota) y métricas clave como tasa efectiva anual.',
    color: 'green',
    icon: '📊',
  },
  {
    id: '6',
    hash: 'u6v7w8x',
    type: 'feat',
    scope: 'table',
    message: 'Tabla de amortización con exportación CSV e impresión',
    files: [
      { name: 'src/components/AmortizationTable.tsx', description: 'Tabla completa, totales, export CSV, print' },
    ],
    description: 'Tabla detallada con todas las columnas de amortización (saldo inicial, cuota, interés, capital, saldo final, fecha). Incluye fila de totales, exportación a CSV y función de impresión optimizada.',
    color: 'indigo',
    icon: '📋',
  },
  {
    id: '7',
    hash: 'y9z0a1b',
    type: 'feat',
    scope: 'calendar',
    message: 'Calendario con timeline, estados y cálculo de mora',
    files: [
      { name: 'src/components/PaymentCalendar.tsx', description: 'Timeline, estados, barras de progreso, alertas de mora' },
    ],
    description: 'Vista de calendario en formato timeline con estados visuales (pagado/próximo/pendiente), barras de progreso capital/interés por cuota, alertas de mora con cálculo automático de días de atraso.',
    color: 'yellow',
    icon: '📅',
  },
  {
    id: '8',
    hash: 'c2d3e4f',
    type: 'feat',
    scope: 'payments',
    message: 'Módulo de registro con comprobantes y pagos extras',
    files: [
      { name: 'src/components/PaymentRegister.tsx', description: 'Formulario, pagos extras, comprobantes, historial' },
    ],
    description: 'Módulo para registrar pagos con selección de cuota, fecha y monto extra. Genera comprobantes imprimibles con diseño profesional. Incluye barra de progreso del préstamo e historial de pagos.',
    color: 'emerald',
    icon: '💳',
  },
  {
    id: '9',
    hash: 'g5h6i7j',
    type: 'feat',
    scope: 'simulator',
    message: 'Simulador de pagos anticipados con comparación visual',
    files: [
      { name: 'src/components/EarlyPaymentSimulator.tsx', description: 'Configuración, simulación, gráficos comparativos' },
    ],
    description: 'Simulador que permite calcular el impacto de pagos extras con diferentes frecuencias (cada mes, alterno, una vez). Muestra ahorro en intereses, meses reducidos y gráfico comparativo de evolución del saldo.',
    color: 'amber',
    icon: '⚡',
  },
  {
    id: '10',
    hash: 'k8l9m0n',
    type: 'feat',
    scope: 'comparator',
    message: 'Comparador de tasas con hasta 5 escenarios',
    files: [
      { name: 'src/components/RateComparator.tsx', description: 'Tarjetas de comparación, gráficos, tabla resumen' },
    ],
    description: 'Permite comparar hasta 5 escenarios diferentes de tasa y plazo. Identifica automáticamente la mejor opción, muestra gráficos de cuotas e intereses, y tabla comparativa con tasa efectiva anual.',
    color: 'rose',
    icon: '⚖️',
  },
  {
    id: '11',
    hash: 'o1p2q3r',
    type: 'feat',
    scope: 'history',
    message: 'Historial con persistencia en localStorage',
    files: [
      { name: 'src/components/LoanHistory.tsx', description: 'Tarjetas, resumen portafolio, cargar/eliminar' },
    ],
    description: 'Sistema de historial que guarda préstamos en localStorage. Muestra tarjetas con información de cada préstamo, permite cargarlos o eliminarlos, y muestra resumen del portafolio total.',
    color: 'teal',
    icon: '📂',
  },
  {
    id: '12',
    hash: 's4t5u6v',
    type: 'style',
    scope: 'css',
    message: 'Estilos de impresión, scrollbar personalizado y animaciones',
    files: [
      { name: 'src/index.css', description: '@media print, scrollbar, range inputs, transiciones' },
    ],
    description: 'Estilos CSS personalizados: media queries para impresión optimizada, scrollbar con diseño dark, estilos para inputs range, eliminación de spinners en inputs number, y transiciones suaves globales.',
    color: 'pink',
    icon: '🎨',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  slate: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', dot: 'bg-slate-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-400' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', dot: 'bg-green-400' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400' },
  teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', dot: 'bg-teal-400' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', dot: 'bg-pink-400' },
};

const typeColors: Record<string, string> = {
  feat: 'text-green-400 bg-green-500/10 border-green-500/30',
  chore: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  fix: 'text-red-400 bg-red-500/10 border-red-500/30',
  style: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  refactor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
};

export default function CommitTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-blue-400" />
          Historial de Commits
        </h2>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">feat</span>
          <span className="px-2 py-1 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-400">chore</span>
          <span className="px-2 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400">style</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/50 rounded-xl border border-blue-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-white">{commits.length}</p>
          <p className="text-xs text-slate-400">Total Commits</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-green-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{commits.filter(c => c.type === 'feat').length}</p>
          <p className="text-xs text-slate-400">Features</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{commits.reduce((sum, c) => sum + c.files.length, 0)}</p>
          <p className="text-xs text-slate-400">Archivos</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-cyan-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">{commits.filter(c => c.scope === 'calculator' || c.scope === 'dashboard' || c.scope === 'table' || c.scope === 'calendar' || c.scope === 'payments' || c.scope === 'simulator' || c.scope === 'comparator' || c.scope === 'history').length}</p>
          <p className="text-xs text-slate-400">Componentes</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30"></div>

          <div className="space-y-3">
            {commits.map((commit) => {
              const colors = colorMap[commit.color];
              const isExpanded = expandedId === commit.id;

              return (
                <div key={commit.id} className="relative flex items-start gap-4 pl-1">
                  {/* Dot */}
                  <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 ${colors.bg} ${colors.border}`}>
                    <span className="text-sm">{commit.icon}</span>
                  </div>

                  {/* Card */}
                  <div className={`flex-1 rounded-xl border ${colors.border} ${colors.bg} p-4 transition-all`}>
                    {/* Header */}
                    <button
                      onClick={() => toggleExpand(commit.id)}
                      className="w-full text-left flex items-start justify-between gap-2"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[commit.type] || typeColors.feat}`}>
                            {commit.type}
                          </span>
                          <span className="text-xs text-slate-500">({commit.scope})</span>
                          <span className="text-xs text-slate-600 font-mono">{commit.hash}</span>
                        </div>
                        <p className="text-sm text-white font-medium">{commit.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{commit.files.length} archivos</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-700/30 space-y-3">
                        <p className="text-sm text-slate-300">{commit.description}</p>
                        
                        <div>
                          <p className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1">
                            <FileCode className="w-3 h-3" /> Archivos modificados:
                          </p>
                          <div className="space-y-1">
                            {commit.files.map((file, idx) => (
                              <div key={idx} className="flex items-start gap-2 bg-slate-900/30 rounded-lg px-3 py-2">
                                <span className="text-xs font-mono text-blue-400 whitespace-nowrap">{file.name}</span>
                                <span className="text-xs text-slate-500">— {file.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Command */}
                        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                          <p className="text-xs text-slate-400 mb-1">Comando Git:</p>
                          <code className="text-xs text-green-400 font-mono">
                            git commit -m "{commit.type}({commit.scope}): {commit.message.toLowerCase()}"
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* File tree */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <h3 className="text-md font-semibold text-white mb-4">🌳 Estructura de Archivos del Proyecto</h3>
        <div className="bg-slate-900/50 rounded-xl p-4 font-mono text-sm">
          <div className="text-slate-400">
            <p className="text-blue-400">📁 src/</p>
            <p className="pl-4">├── <span className="text-purple-400">App.tsx</span> <span className="text-slate-600">— Componente principal</span></p>
            <p className="pl-4">├── <span className="text-purple-400">main.tsx</span> <span className="text-slate-600">— Entry point</span></p>
            <p className="pl-4">├── <span className="text-purple-400">types.ts</span> <span className="text-slate-600">— Interfaces TypeScript</span></p>
            <p className="pl-4">├── <span className="text-purple-400">index.css</span> <span className="text-slate-600">— Estilos globales</span></p>
            <p className="pl-4 text-blue-400">└── 📁 components/</p>
            <p className="pl-8">├── <span className="text-cyan-400">LoanCalculator.tsx</span> <span className="text-slate-600">— Calculadora</span></p>
            <p className="pl-8">├── <span className="text-green-400">Dashboard.tsx</span> <span className="text-slate-600">— Panel visual</span></p>
            <p className="pl-8">├── <span className="text-indigo-400">AmortizationTable.tsx</span> <span className="text-slate-600">— Tabla</span></p>
            <p className="pl-8">├── <span className="text-yellow-400">PaymentCalendar.tsx</span> <span className="text-slate-600">— Calendario</span></p>
            <p className="pl-8">├── <span className="text-emerald-400">PaymentRegister.tsx</span> <span className="text-slate-600">— Registro pagos</span></p>
            <p className="pl-8">├── <span className="text-amber-400">EarlyPaymentSimulator.tsx</span> <span className="text-slate-600">— Simulador</span></p>
            <p className="pl-8">├── <span className="text-rose-400">RateComparator.tsx</span> <span className="text-slate-600">— Comparador</span></p>
            <p className="pl-8">└── <span className="text-teal-400">LoanHistory.tsx</span> <span className="text-slate-600">— Historial</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
