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
  {
    id: '13',
    hash: 'w7x8y9z',
    type: 'chore',
    scope: 'docs',
    message: 'Crear documento de planificación del proyecto PROJECT_PLAN.md',
    files: [
      { name: 'PROJECT_PLAN.md', description: 'Plan completo con 12 secciones: objetivos, alcance, arquitectura, módulos, cronograma, riesgos, etc.' },
    ],
    description: 'Documento profesional de planificación que cubre resumen ejecutivo, objetivos, alcance, arquitectura técnica, 8 módulos detallados, cronograma con 12 commits, requisitos, metodología, matriz de riesgos, criterios de éxito, entregables y roadmap futuro.',
    color: 'teal',
    icon: '📋',
  },
  {
    id: '14',
    hash: 'a0b1c2d',
    type: 'feat',
    scope: 'plan',
    message: 'Agregar componente ProjectPlan con visualización interactiva del proyecto',
    files: [
      { name: 'src/components/ProjectPlan.tsx', description: '6 secciones navegables: Resumen, Objetivos, Módulos, Fases, Técnico, Riesgos' },
    ],
    description: 'Componente visual con estadísticas, barras de progreso, checklist de objetivos, módulos expandibles, fases con tareas, stack tecnológico, fórmulas matemáticas y matriz de riesgos. Integrado como nueva pestaña en la navegación.',
    color: 'indigo',
    icon: '📊',
  },
  {
    id: '15',
    hash: 'e3f4g5h',
    type: 'feat',
    scope: 'types',
    message: 'Agregar campos status, updatedAt y notes a interfaz SavedLoan',
    files: [
      { name: 'src/types.ts', description: 'Nuevos campos: status (active/completed/cancelled), updatedAt, notes' },
    ],
    description: 'Extensión de la interfaz SavedLoan para soportar estados de préstamo (activo, completado, cancelado), fecha de última edición y campo de notas para observaciones.',
    color: 'purple',
    icon: '📐',
  },
  {
    id: '16',
    hash: 'i6j7k8l',
    type: 'feat',
    scope: 'app',
    message: 'Agregar handlers para update, duplicate y export de préstamos',
    files: [
      { name: 'src/App.tsx', description: 'Nuevas funciones: handleUpdateLoan, handleDuplicateLoan, handleExportLoan' },
    ],
    description: 'Funciones para actualizar préstamos (con recálculo automático si cambian parámetros), duplicar préstamos y exportar datos en formato JSON. Integración con el componente LoanHistory mejorado.',
    color: 'blue',
    icon: '🔧',
  },
  {
    id: '17',
    hash: 'm9n0o1p',
    type: 'feat',
    scope: 'history',
    message: 'Mejorar módulo de historial con edición, duplicación, exportación y estados',
    files: [
      { name: 'src/components/LoanHistory.tsx', description: 'Búsqueda, filtros, edición, duplicar, exportar JSON, estados, notas, progreso, confirmación' },
    ],
    description: 'Rediseño completo del historial: búsqueda por nombre/cliente, filtros por estado, modal de edición con recálculo automático, duplicación de préstamos, exportación JSON, cambio de estado (activo/completado/cancelado), notas, barra de progreso, vista de detalles y confirmación de eliminación.',
    color: 'emerald',
    icon: '💎',
  },
  {
    id: '18',
    hash: 'q2r3s4t',
    type: 'feat',
    scope: 'table',
    message: 'Agregar filtros avanzados por rango de fechas y montos',
    files: [
      { name: 'src/components/AmortizationTable.tsx', description: 'Panel de filtros con fecha desde/hasta, monto mínimo/máximo, indicador visual' },
    ],
    description: 'Panel de filtros avanzados colapsable con filtros por rango de fechas (desde/hasta) y montos (mínimo/máximo). Indicador visual cuando hay filtros activos y botón para limpiar filtros.',
    color: 'blue',
    icon: '🔍',
  },
  {
    id: '19',
    hash: 'u5v6w7x',
    type: 'feat',
    scope: 'table',
    message: 'Integrar gráfico de evolución del préstamo en la tabla',
    files: [
      { name: 'src/components/AmortizationTable.tsx', description: 'Gráfico interactivo con Recharts mostrando saldo, interés y capital' },
    ],
    description: 'Gráfico de evolución integrado en la tabla usando Recharts. Muestra 3 líneas: saldo restante, interés y capital a lo largo del tiempo. Toggle para mostrar/ocultar.',
    color: 'green',
    icon: '📈',
  },
  {
    id: '20',
    hash: 'y8z9a0b',
    type: 'feat',
    scope: 'table',
    message: 'Agregar sparkline charts inline para tendencias',
    files: [
      { name: 'src/components/AmortizationTable.tsx', description: 'Mini gráficos SVG mostrando tendencias de interés y capital' },
    ],
    description: 'Sparkline charts inline en cada fila mostrando la tendencia de interés (rojo) y capital (verde) de los últimos 6 meses. Visualización SVG ligera y eficiente.',
    color: 'purple',
    icon: '📉',
  },
  {
    id: '21',
    hash: 'c1d2e3f',
    type: 'feat',
    scope: 'table',
    message: 'Agregar tooltips informativos al pasar el mouse',
    files: [
      { name: 'src/components/AmortizationTable.tsx', description: 'Tooltips mostrando cálculos de interés, capital y saldo restante' },
    ],
    description: 'Tooltips informativos que aparecen al pasar el mouse sobre cada fila. Muestran el cálculo del interés, cálculo del capital y porcentaje de saldo restante.',
    color: 'cyan',
    icon: '💡',
  },
  {
    id: '22',
    hash: 'g4h5i6j',
    type: 'feat',
    scope: 'table',
    message: 'Agregar agrupación temporal trimestral y anual',
    files: [
      { name: 'src/components/AmortizationTable.tsx', description: 'Vista agrupada por trimestre o año con totales' },
    ],
    description: 'Agrupación temporal que permite ver la tabla agrupada por trimestre (Q1, Q2, Q3, Q4) o por año. Muestra totales de pago, interés y capital por período.',
    color: 'indigo',
    icon: '📅',
  },
  {
    id: '23',
    hash: 'k7l8m9n',
    type: 'feat',
    scope: 'table',
    message: 'Agregar exportación a Word (.docx) con formato profesional',
    files: [
      { name: 'src/components/AmortizationTable.tsx', description: 'Exportación usando librería docx con formato profesional' },
    ],
    description: 'Exportación a Word (.docx) con formato profesional incluyendo encabezado, resumen del préstamo y tabla completa con bordes y estilos.',
    color: 'rose',
    icon: '📄',
  },
  {
    id: '24',
    hash: 'o0p1q2r',
    type: 'style',
    scope: 'print',
    message: 'Optimizar estilos CSS para impresión profesional',
    files: [
      { name: 'src/index.css', description: 'Media queries @media print optimizadas' },
    ],
    description: 'Estilos CSS optimizados para impresión profesional con @media print. Fondo blanco, texto negro, bordes grises, encabezados repetidos, evitar cortes de filas.',
    color: 'pink',
    icon: '🖨️',
  },
  {
    id: '25',
    hash: 's3t4u5v',
    type: 'feat',
    scope: 'table',
    message: 'Agregar alertas de vencimiento con notificaciones visuales',
    files: [
      { name: 'src/components/AmortizationTable.tsx', description: 'Panel de alertas con cuotas vencidas y próximas a vencer' },
    ],
    description: 'Sistema de alertas de vencimiento que muestra cuotas vencidas (rojo) y próximas a vencer en 7 días (amarillo). Badge con contador de alertas.',
    color: 'yellow',
    icon: '🔔',
  },
  {
    id: '26',
    hash: 'w6x7y8z',
    type: 'feat',
    scope: 'table',
    message: 'Implementar sistema de redondeo inteligente al entero superior',
    files: [
      { name: 'src/components/AmortizationTable.tsx', description: 'Columnas de cuota redondeada, diferencia y acumulado' },
      { name: 'src/App.tsx', description: 'Cálculo de redondeo al entero superior con ajuste en última cuota' },
    ],
    description: 'Sistema de redondeo inteligente que redondea la cuota al entero superior. Muestra 3 columnas adicionales: cuota redondeada, diferencia por cuota y diferencia acumulada. La última cuota se ajusta para compensar el acumulado.',
    color: 'teal',
    icon: '💰',
  },
  {
    id: '27',
    hash: 'a9b0c1d',
    type: 'feat',
    scope: 'financial',
    message: 'Agregar dashboard de métricas financieras con KPIs y gráficos',
    files: [
      { name: 'src/components/FinancialDashboard.tsx', description: 'KPIs, gráficos de distribución, evolución y métricas promedio' },
      { name: 'src/App.tsx', description: 'Integración del dashboard financiero' },
    ],
    description: 'Dashboard completo de métricas financieras con KPIs principales (cartera total, recuperado, pendiente, intereses), gráficos de distribución de préstamos, evolución mensual de cobros, distribución de tasas y métricas promedio.',
    color: 'blue',
    icon: '📊',
  },
  {
    id: '28',
    hash: 'e2f3g4h',
    type: 'feat',
    scope: 'theme',
    message: 'Implementar modo oscuro/claro con persistencia en localStorage',
    files: [
      { name: 'src/contexts/ThemeContext.tsx', description: 'Contexto de tema con toggle y persistencia' },
      { name: 'src/App.tsx', description: 'Integración del contexto de tema' },
      { name: 'src/index.css', description: 'Estilos para modo claro' },
    ],
    description: 'Sistema de tema oscuro/claro con toggle en el header. Preferencia guardada en localStorage. Estilos completos para ambos modos con transiciones suaves.',
    color: 'purple',
    icon: '🎨',
  },
  {
    id: '29',
    hash: 'i5j6k7l',
    type: 'feat',
    scope: 'search',
    message: 'Agregar búsqueda global con atajo Ctrl+K',
    files: [
      { name: 'src/components/GlobalSearch.tsx', description: 'Modal de búsqueda con navegación por teclado' },
      { name: 'src/App.tsx', description: 'Integración de búsqueda global' },
    ],
    description: 'Búsqueda global accesible con Ctrl+K o Cmd+K. Búsqueda por nombre, cliente, monto o ID. Navegación con flechas, selección con Enter, cierre con Escape.',
    color: 'green',
    icon: '🔍',
  },
  {
    id: '30',
    hash: 'm8n9o0p',
    type: 'feat',
    scope: 'import',
    message: 'Implementar importación masiva de préstamos desde Excel',
    files: [
      { name: 'src/components/ExcelImport.tsx', description: 'Carga de Excel, validación, vista previa, plantilla' },
      { name: 'src/App.tsx', description: 'Integración de importación masiva' },
    ],
    description: 'Importación masiva de préstamos desde archivos Excel/CSV. Validación automática de datos, plantilla descargable, vista previa antes de importar, manejo de errores por fila.',
    color: 'cyan',
    icon: '📥',
  },
  {
    id: '31',
    hash: 'q1r2s3t',
    type: 'feat',
    scope: 'contract',
    message: 'Agregar generador de contratos PDF profesionales',
    files: [
      { name: 'src/components/ContractGenerator.tsx', description: 'Generación de PDF con jsPDF, cláusulas legales, firmas' },
    ],
    description: 'Generador de contratos PDF profesionales con formato legal completo. Incluye información de las partes, datos del préstamo, 6 cláusulas legales, espacios para firmas y pie de página.',
    color: 'indigo',
    icon: '📄',
  },
  {
    id: '32',
    hash: 'u4v5w6x',
    type: 'feat',
    scope: 'notification',
    message: 'Implementar sistema de notificaciones con alertas de vencimiento',
    files: [
      { name: 'src/components/NotificationSystem.tsx', description: 'Panel de notificaciones, configuración, alertas automáticas' },
      { name: 'src/App.tsx', description: 'Integración del sistema de notificaciones' },
    ],
    description: 'Sistema de notificaciones completo con panel desplegable, configuración de días de anticipación, alertas de cuotas vencidas y próximas. Badge con contador de notificaciones sin leer.',
    color: 'rose',
    icon: '🔔',
  },
  {
    id: '33',
    hash: 'y7z8a9b',
    type: 'feat',
    scope: 'pwa',
    message: 'Agregar soporte PWA con service worker y manifiesto',
    files: [
      { name: 'public/manifest.json', description: 'Manifiesto PWA con íconos y configuración' },
      { name: 'public/sw.js', description: 'Service Worker para caché y offline' },
      { name: 'public/icon-192.svg', description: 'Ícono PWA 192x192' },
      { name: 'public/icon-512.svg', description: 'Ícono PWA 512x512' },
      { name: 'index.html', description: 'Meta tags PWA y registro de service worker' },
    ],
    description: 'Soporte completo para Progressive Web App con manifiesto, service worker para caché y funcionalidad offline, íconos SVG en dos tamaños, y meta tags en HTML. La app es instalable en dispositivos móviles.',
    color: 'yellow',
    icon: '📱',
  },
  {
    id: '34',
    hash: 'c0d1e2f',
    type: 'feat',
    scope: 'auth',
    message: 'Implementar sistema multi-usuario con roles y permisos',
    files: [
      { name: 'src/contexts/AuthContext.tsx', description: 'Contexto de autenticación con 4 roles y permisos' },
      { name: 'src/components/Login.tsx', description: 'Pantalla de login con credenciales de demostración' },
      { name: 'src/App.tsx', description: 'Integración de autenticación' },
    ],
    description: 'Sistema de autenticación multi-usuario con 4 roles (Admin, Gerente, Operador, Viewer), sistema de permisos por rol, pantalla de login profesional y credenciales de demostración.',
    color: 'teal',
    icon: '👥',
  },
  {
    id: '35',
    hash: 'g3h4i5j',
    type: 'feat',
    scope: 'reports',
    message: 'Agregar reportes mensuales automáticos con exportación PDF',
    files: [
      { name: 'src/components/MonthlyReport.tsx', description: 'Reportes mensuales con métricas de cobranza y exportación PDF' },
      { name: 'src/App.tsx', description: 'Integración de reportes mensuales' },
    ],
    description: 'Sistema de reportes mensuales con selección de mes/año, métricas de cobranza (total recaudado, esperado, tasa de recuperación), detalle de pagos del período y exportación a PDF profesional.',
    color: 'blue',
    icon: '📊',
  },
  {
    id: '36',
    hash: 'k6l7m8n',
    type: 'feat',
    scope: 'renegotiation',
    message: 'Implementar renegociación de préstamos con recálculo automático',
    files: [
      { name: 'src/components/LoanRenegotiation.tsx', description: 'Renegociación con ajuste de plazo/tasa y comparación' },
      { name: 'src/App.tsx', description: 'Handler para renegociación' },
    ],
    description: 'Sistema de renegociación de préstamos que permite ajustar plazo y tasa, calcula nueva cuota automáticamente, muestra comparación antes/después y genera nueva tabla de amortización.',
    color: 'purple',
    icon: '🔄',
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
  const [appliedCommits, setAppliedCommits] = useState<Set<string>>(new Set());
  const [showScript, setShowScript] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleApplied = (id: string) => {
    const newSet = new Set(appliedCommits);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setAppliedCommits(newSet);
  };

  const copyCommand = (commit: CommitInfo) => {
    const command = `git add ${commit.files.map(f => f.name).join(' ')} && git commit -m "${commit.type}(${commit.scope}): ${commit.message.toLowerCase()}"`;
    navigator.clipboard.writeText(command);
    setCopiedCommand(commit.id);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const generateScript = () => {
    const script = commits.map(commit => 
      `# Commit ${commit.id}: ${commit.message}\ngit add ${commit.files.map(f => f.name).join(' ')}\ngit commit -m "${commit.type}(${commit.scope}): ${commit.message.toLowerCase()}"\n`
    ).join('\n');
    
    const fullScript = `#!/bin/bash\n# Sistema de Préstamos - Commits\n# Generado: ${new Date().toLocaleString()}\n\n${script}`;
    
    const blob = new Blob([fullScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'apply-commits.sh';
    a.click();
    URL.revokeObjectURL(url);
  };

  const progress = (appliedCommits.size / commits.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-blue-400" />
          Historial de Commits
        </h2>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs">feat</span>
          <span className="px-2 py-1 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-400 text-xs">chore</span>
          <span className="px-2 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs">style</span>
          <button
            onClick={generateScript}
            className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-500/30 transition-all flex items-center gap-1"
            title="Descargar script .sh"
          >
            📥 Descargar Script
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300">Progreso de aplicación</span>
            <span className="text-xs text-slate-500">
              (Marca los commits como aplicados para llevar control)
            </span>
          </div>
          <span className="text-sm font-bold text-blue-400">
            {appliedCommits.size} / {commits.length}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {appliedCommits.size === commits.length && (
          <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
            ✅ ¡Todos los commits aplicados! Ejecuta <code className="bg-slate-900 px-1 rounded">git log --oneline</code> para verificar.
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
          <p className="text-2xl font-bold text-cyan-400">{appliedCommits.size}</p>
          <p className="text-xs text-slate-400">Aplicados</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-yellow-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{commits.length - appliedCommits.size}</p>
          <p className="text-xs text-slate-400">Pendientes</p>
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
                  <div className={`flex-1 rounded-xl border ${colors.border} ${colors.bg} p-4 transition-all ${
                    appliedCommits.has(commit.id) ? 'ring-1 ring-green-500/30' : ''
                  }`}>
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
                          {appliedCommits.has(commit.id) && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400">
                              ✓ aplicado
                            </span>
                          )}
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
                          <code className="text-xs text-green-400 font-mono break-all">
                            git add {commit.files.map(f => f.name).join(' ')}<br/>
                            git commit -m "{commit.type}({commit.scope}): {commit.message.toLowerCase()}"
                          </code>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => copyCommand(commit)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-xs text-slate-300 transition-all"
                          >
                            {copiedCommand === commit.id ? (
                              <>✓ Copiado</>
                            ) : (
                              <>📋 Copiar comando</>
                            )}
                          </button>
                          <button
                            onClick={() => toggleApplied(commit.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs transition-all ${
                              appliedCommits.has(commit.id)
                                ? 'bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30'
                                : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {appliedCommits.has(commit.id) ? (
                              <>✅ Aplicado</>
                            ) : (
                              <>⏳ Marcar como aplicado</>
                            )}
                          </button>
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

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
        <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
          🚀 ¿Cómo aplicar estos commits?
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-xs text-blue-300 font-bold">1</span>
            <div>
              <p className="text-white font-medium">Inicializa Git en tu proyecto</p>
              <code className="text-xs text-green-400 bg-slate-900/50 px-2 py-1 rounded mt-1 inline-block">git init</code>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-xs text-blue-300 font-bold">2</span>
            <div>
              <p className="text-white font-medium">Descarga el script o copia los comandos</p>
              <p className="text-xs text-slate-400">Usa el botón "📥 Descargar Script" o copia cada comando individualmente</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-xs text-blue-300 font-bold">3</span>
            <div>
              <p className="text-white font-medium">Ejecuta en tu terminal</p>
              <code className="text-xs text-green-400 bg-slate-900/50 px-2 py-1 rounded mt-1 inline-block">chmod +x apply-commits.sh && ./apply-commits.sh</code>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center text-xs text-blue-300 font-bold">4</span>
            <div>
              <p className="text-white font-medium">Verifica el historial</p>
              <code className="text-xs text-green-400 bg-slate-900/50 px-2 py-1 rounded mt-1 inline-block">git log --oneline --graph</code>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-xs text-green-300 font-bold">✓</span>
            <div>
              <p className="text-white font-medium">Marca los commits como aplicados aquí</p>
              <p className="text-xs text-slate-400">Usa el botón "⏳ Marcar como aplicado" en cada commit para llevar control</p>
            </div>
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
