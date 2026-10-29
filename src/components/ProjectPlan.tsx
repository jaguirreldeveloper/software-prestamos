import { useState } from 'react';
import { 
  FileText, Target, Layers, Calendar, Code, Shield, 
  CheckCircle2, Circle, AlertTriangle, TrendingUp, 
  ChevronDown, ChevronRight, Rocket, Package
} from 'lucide-react';

interface Phase {
  id: string;
  name: string;
  weeks: string;
  status: 'completed' | 'in-progress' | 'pending';
  tasks: { name: string; status: 'done' | 'wip' | 'todo' }[];
}

interface Module {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
  status: 'completed' | 'in-progress' | 'pending';
}

const phases: Phase[] = [
  {
    id: '1',
    name: 'Foundation',
    weeks: 'Semanas 1-2',
    status: 'completed',
    tasks: [
      { name: 'Setup del proyecto', status: 'done' },
      { name: 'Definición de tipos', status: 'done' },
      { name: 'Calculadora base', status: 'done' },
      { name: 'Tabla de amortización', status: 'done' },
    ],
  },
  {
    id: '2',
    name: 'Visualización',
    weeks: 'Semanas 3-4',
    status: 'completed',
    tasks: [
      { name: 'Dashboard con gráficos', status: 'done' },
      { name: 'Calendario de pagos', status: 'done' },
      { name: 'Estilos de impresión', status: 'done' },
    ],
  },
  {
    id: '3',
    name: 'Gestión',
    weeks: 'Semanas 5-6',
    status: 'completed',
    tasks: [
      { name: 'Registro de pagos', status: 'done' },
      { name: 'Simulador anticipos', status: 'done' },
      { name: 'Comparador de tasas', status: 'done' },
      { name: 'Historial persistente', status: 'done' },
    ],
  },
  {
    id: '4',
    name: 'Documentación',
    weeks: 'Semana 7',
    status: 'in-progress',
    tasks: [
      { name: 'Plan del proyecto', status: 'done' },
      { name: 'Timeline de commits', status: 'done' },
      { name: 'README y docs', status: 'wip' },
    ],
  },
  {
    id: '5',
    name: 'Backend (Futuro)',
    weeks: 'Semanas 8-12',
    status: 'pending',
    tasks: [
      { name: 'API REST', status: 'todo' },
      { name: 'Base de datos', status: 'todo' },
      { name: 'Autenticación', status: 'todo' },
    ],
  },
];

const modules: Module[] = [
  {
    id: '1',
    name: 'Calculadora',
    icon: '🧮',
    description: 'Cálculo de cuotas con amortización francesa',
    features: ['Sliders interactivos', 'Plantillas rápidas', 'Modal de guardado', 'Resultados en tiempo real'],
    status: 'completed',
  },
  {
    id: '2',
    name: 'Dashboard',
    icon: '📊',
    description: 'Panel visual con gráficos y KPIs',
    features: ['Gráfico de torta', 'Gráfico de área', 'Gráfico de barras', 'Métricas clave'],
    status: 'completed',
  },
  {
    id: '3',
    name: 'Tabla Amortización',
    icon: '📋',
    description: 'Detalle de cada cuota con exportación',
    features: ['Tabla completa', 'Exportar CSV', 'Impresión', 'Totales'],
    status: 'completed',
  },
  {
    id: '4',
    name: 'Calendario',
    icon: '📅',
    description: 'Vista temporal de pagos con mora',
    features: ['Timeline visual', 'Estados de pago', 'Cálculo de mora', 'Alertas'],
    status: 'completed',
  },
  {
    id: '5',
    name: 'Registro Pagos',
    icon: '💳',
    description: 'Registro de pagos con comprobantes',
    features: ['Pago normal', 'Pago extra', 'Comprobantes', 'Historial'],
    status: 'completed',
  },
  {
    id: '6',
    name: 'Simulador',
    icon: '⚡',
    description: 'Simulación de pagos anticipados',
    features: ['Pago extra mensual', 'Frecuencia alterna', 'Pago único', 'Comparación visual'],
    status: 'completed',
  },
  {
    id: '7',
    name: 'Comparador',
    icon: '⚖️',
    description: 'Comparación de tasas y plazos',
    features: ['Hasta 5 escenarios', 'Mejor opción', 'Gráficos', 'Tabla resumen'],
    status: 'completed',
  },
  {
    id: '8',
    name: 'Historial',
    icon: '📂',
    description: 'Persistencia de préstamos',
    features: ['localStorage', 'Cargar préstamos', 'Eliminar', 'Resumen portafolio'],
    status: 'completed',
  },
];

const risks = [
  { risk: 'Pérdida de datos (localStorage)', probability: 'Media', impact: 'Alto', mitigation: 'Implementar backup/export' },
  { risk: 'Errores de cálculo', probability: 'Baja', impact: 'Crítico', mitigation: 'Validación con casos de prueba' },
  { risk: 'Incompatibilidad navegador', probability: 'Baja', impact: 'Medio', mitigation: 'Testing cross-browser' },
  { risk: 'Cambios en requisitos', probability: 'Media', impact: 'Medio', mitigation: 'Arquitectura modular' },
];

const objectives = [
  { text: 'Implementar calculadora de préstamos con fórmula francesa', done: true },
  { text: 'Generar tablas de amortización dinámicas con exportación', done: true },
  { text: 'Visualizar datos financieros mediante gráficos interactivos', done: true },
  { text: 'Registrar pagos con generación de comprobantes', done: true },
  { text: 'Simular impacto de pagos anticipados', done: true },
  { text: 'Calcular automáticamente intereses moratorios', done: true },
  { text: 'Comparar escenarios de tasas y plazos', done: true },
  { text: 'Persistir datos de préstamos en el navegador', done: true },
];

export default function ProjectPlan() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('4');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  const completedPhases = phases.filter(p => p.status === 'completed').length;
  const totalPhases = phases.length;
  const progress = (completedPhases / totalPhases) * 100;

  const completedObjectives = objectives.filter(o => o.done).length;

  const sections = [
    { id: 'overview', label: 'Resumen', icon: FileText },
    { id: 'objectives', label: 'Objetivos', icon: Target },
    { id: 'modules', label: 'Módulos', icon: Layers },
    { id: 'phases', label: 'Fases', icon: Calendar },
    { id: 'tech', label: 'Técnico', icon: Code },
    { id: 'risks', label: 'Riesgos', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Plan del Proyecto
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Sistema de Gestión de Préstamos v2.0
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/PROJECT_PLAN.md"
            download
            className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs text-blue-300 hover:bg-blue-500/30 transition-all flex items-center gap-1"
          >
            📥 Descargar Plan (.md)
          </a>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeSection === section.id
                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                : 'bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-white'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">Módulos</span>
              </div>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-xs text-green-400">100% completados</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400">Fases</span>
              </div>
              <p className="text-2xl font-bold text-white">{completedPhases}/{totalPhases}</p>
              <p className="text-xs text-green-400">{progress.toFixed(0)}% completado</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">Objetivos</span>
              </div>
              <p className="text-2xl font-bold text-white">{completedObjectives}/{objectives.length}</p>
              <p className="text-xs text-green-400">100% cumplidos</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl border border-yellow-500/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-slate-400">Commits</span>
              </div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-xs text-green-400">Todos aplicados</p>
            </div>
          </div>

          {/* Project Summary */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              Resumen Ejecutivo
            </h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Nombre del Proyecto</p>
                  <p className="text-white font-medium">Sistema de Gestión de Préstamos</p>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Versión</p>
                  <p className="text-white font-medium">v2.0</p>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Moneda</p>
                  <p className="text-white font-medium">Bolivianos (Bs.)</p>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">Método Amortización</p>
                  <p className="text-white font-medium">Francés (cuota fija)</p>
                </div>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Descripción</p>
                <p className="text-slate-300">
                  Sistema web completo para la gestión de préstamos personales/comerciales basado en el método 
                  de amortización francesa. Permite calcular cuotas, generar tablas de amortización, registrar 
                  pagos, simular pagos anticipados, calcular moras y comparar escenarios de tasas.
                </p>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-md font-semibold text-white mb-4">📈 Progreso General</h3>
            <div className="space-y-3">
              {phases.map(phase => (
                <div key={phase.id} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-slate-400">{phase.name}</div>
                  <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        phase.status === 'completed' ? 'bg-green-500 w-full' :
                        phase.status === 'in-progress' ? 'bg-yellow-500 w-3/4' :
                        'bg-slate-600 w-0'
                      }`}
                    ></div>
                  </div>
                  <div className="w-20 text-right">
                    <span className={`text-xs ${
                      phase.status === 'completed' ? 'text-green-400' :
                      phase.status === 'in-progress' ? 'text-yellow-400' :
                      'text-slate-500'
                    }`}>
                      {phase.status === 'completed' ? '✅ Completo' :
                       phase.status === 'in-progress' ? '🔄 En curso' :
                       '⏳ Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Objectives Section */}
      {activeSection === 'objectives' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Objetivos del Proyecto
            </h3>
            <div className="space-y-3">
              {objectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-900/30 rounded-lg p-3">
                  {obj.done ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm ${obj.done ? 'text-white' : 'text-slate-400'}`}>
                      {obj.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/30">
              <p className="text-sm text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {completedObjectives}/{objectives.length} objetivos cumplidos (100%)
              </p>
            </div>
          </div>

          {/* Success Criteria */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-green-500/20 p-6">
            <h3 className="text-md font-semibold text-white mb-4">✅ Criterios de Éxito</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-2 font-semibold">Métricas Cuantitativas</p>
                <div className="space-y-2">
                  {[
                    '12 commits específicos aplicados',
                    '8 módulos funcionales',
                    '0 errores de compilación',
                    '100% responsive',
                    '< 2 segundos de carga',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-2 font-semibold">Métricas Cualitativas</p>
                <div className="space-y-2">
                  {[
                    'Interfaz intuitiva',
                    'Cálculos precisos',
                    'Visualización clara',
                    'Documentación completa',
                    'Código mantenible',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modules Section */}
      {activeSection === 'modules' && (
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Módulos del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map(module => (
              <div
                key={module.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-500/20 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                  className="w-full p-4 text-left flex items-center gap-3 hover:bg-slate-700/20 transition-all"
                >
                  <span className="text-2xl">{module.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{module.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">
                        ✓ Completo
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{module.description}</p>
                  </div>
                  {expandedModule === module.id ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {expandedModule === module.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-700/30">
                    <p className="text-xs text-slate-400 mb-2 mt-3">Características:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {module.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phases Section */}
      {activeSection === 'phases' && (
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Fases del Proyecto
          </h3>
          <div className="space-y-3">
            {phases.map(phase => (
              <div
                key={phase.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border overflow-hidden ${
                  phase.status === 'completed' ? 'border-green-500/20' :
                  phase.status === 'in-progress' ? 'border-yellow-500/20' :
                  'border-slate-700/30'
                }`}
              >
                <button
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                  className="w-full p-4 text-left flex items-center gap-3 hover:bg-slate-700/20 transition-all"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    phase.status === 'completed' ? 'bg-green-500/20' :
                    phase.status === 'in-progress' ? 'bg-yellow-500/20' :
                    'bg-slate-700/50'
                  }`}>
                    {phase.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> :
                     phase.status === 'in-progress' ? <Rocket className="w-4 h-4 text-yellow-400" /> :
                     <Circle className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">Fase {phase.id}: {phase.name}</p>
                      <span className="text-xs text-slate-500">{phase.weeks}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {phase.tasks.filter(t => t.status === 'done').length}/{phase.tasks.length} tareas completadas
                    </p>
                  </div>
                  {expandedPhase === phase.id ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {expandedPhase === phase.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-700/30">
                    <div className="space-y-2 mt-3">
                      {phase.tasks.map((task, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          {task.status === 'done' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : task.status === 'wip' ? (
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500" />
                          )}
                          <span className={
                            task.status === 'done' ? 'text-slate-300' :
                            task.status === 'wip' ? 'text-yellow-300' :
                            'text-slate-500'
                          }>
                            {task.name}
                          </span>
                          <span className="text-xs text-slate-600 ml-auto">
                            {task.status === 'done' ? '✅' : task.status === 'wip' ? '🔄' : '⏳'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Section */}
      {activeSection === 'tech' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-400" />
              Stack Tecnológico
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'React 18', category: 'Framework', color: 'blue' },
                { name: 'TypeScript', category: 'Lenguaje', color: 'blue' },
                { name: 'Vite 6', category: 'Build Tool', color: 'purple' },
                { name: 'Tailwind CSS 4', category: 'Estilos', color: 'cyan' },
                { name: 'Recharts', category: 'Gráficos', color: 'green' },
                { name: 'Lucide React', category: 'Iconos', color: 'yellow' },
                { name: 'LocalStorage', category: 'Persistencia', color: 'amber' },
                { name: 'Conventional Commits', category: 'Git', color: 'rose' },
              ].map((tech, idx) => (
                <div key={idx} className="bg-slate-900/30 rounded-lg p-3 border border-slate-700/30">
                  <p className="text-sm font-medium text-white">{tech.name}</p>
                  <p className="text-xs text-slate-400">{tech.category}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formulas */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-md font-semibold text-white mb-4">📐 Fórmulas Matemáticas</h3>
            <div className="space-y-4">
              <div className="bg-slate-900/30 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Amortización Francesa (Cuota Fija)</p>
                <code className="text-sm text-green-400 font-mono">
                  Cuota = P × [r(1+r)^n] / [(1+r)^n - 1]
                </code>
                <p className="text-xs text-slate-500 mt-2">
                  P = Principal | r = Tasa periódica | n = Períodos
                </p>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Cálculo de Mora</p>
                <code className="text-sm text-green-400 font-mono">
                  Mora = Cuota × (Tasa_mora / 30) × Días_atraso
                </code>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-2">Tasa Efectiva Anual</p>
                <code className="text-sm text-green-400 font-mono">
                  TEA = (1 + r_mensual)^12 - 1
                </code>
              </div>
            </div>
          </div>

          {/* File Structure */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-md font-semibold text-white mb-4">📁 Estructura del Proyecto</h3>
            <div className="bg-slate-900/50 rounded-xl p-4 font-mono text-xs">
              <pre className="text-slate-400 overflow-x-auto">
{`src/
├── App.tsx                          # Componente raíz
├── main.tsx                         # Entry point
├── types.ts                         # Interfaces TypeScript
├── index.css                        # Estilos globales
└── components/
    ├── LoanCalculator.tsx           # 🧮 Calculadora
    ├── Dashboard.tsx                # 📊 Panel visual
    ├── AmortizationTable.tsx        # 📋 Tabla
    ├── PaymentCalendar.tsx          # 📅 Calendario
    ├── PaymentRegister.tsx          # 💳 Registro pagos
    ├── EarlyPaymentSimulator.tsx    # ⚡ Simulador
    ├── RateComparator.tsx           # ⚖️ Comparador
    ├── LoanHistory.tsx              # 📂 Historial
    ├── CommitTimeline.tsx           # 🔀 Timeline commits
    └── ProjectPlan.tsx              # 📋 Este plan`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Risks Section */}
      {activeSection === 'risks' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              Matriz de Riesgos
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="px-3 py-2 text-left text-xs text-blue-300 font-semibold">Riesgo</th>
                    <th className="px-3 py-2 text-center text-xs text-blue-300 font-semibold">Probabilidad</th>
                    <th className="px-3 py-2 text-center text-xs text-blue-300 font-semibold">Impacto</th>
                    <th className="px-3 py-2 text-left text-xs text-blue-300 font-semibold">Mitigación</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((risk, idx) => (
                    <tr key={idx} className="border-b border-slate-700/20">
                      <td className="px-3 py-3 text-slate-300">{risk.risk}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          risk.probability === 'Alta' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                          risk.probability === 'Media' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                          'bg-green-500/10 text-green-400 border border-green-500/30'
                        }`}>
                          {risk.probability}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          risk.impact === 'Crítico' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                          risk.impact === 'Alto' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                          risk.impact === 'Medio' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                          'bg-green-500/10 text-green-400 border border-green-500/30'
                        }`}>
                          {risk.impact}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-400 text-xs">{risk.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Next Phases */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
            <h3 className="text-md font-semibold text-white mb-4">🚀 Próximas Fases (Roadmap)</h3>
            <div className="space-y-4">
              <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">Fase 4</span>
                  <p className="text-white font-medium">Backend</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-400">
                  <span>⏳ API REST (Node.js)</span>
                  <span>⏳ Base de datos (PostgreSQL)</span>
                  <span>⏳ Autenticación JWT</span>
                </div>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">Fase 5</span>
                  <p className="text-white font-medium">Funcionalidades Avanzadas</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-400">
                  <span>⏳ Gestión de clientes</span>
                  <span>⏳ Reportes PDF</span>
                  <span>⏳ Notificaciones</span>
                </div>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400">Fase 6</span>
                  <p className="text-white font-medium">Optimización</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-400">
                  <span>⏳ Code splitting</span>
                  <span>⏳ PWA</span>
                  <span>⏳ Tests unitarios</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
