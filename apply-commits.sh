#!/bin/bash

# ============================================
# 🚀 Script de Commits - Sistema de Préstamos
# ============================================
# 17 commits específicos organizados por funcionalidad
# Ejecutar: chmod +x apply-commits.sh && ./apply-commits.sh

set -e  # Detener si hay error

echo "🚀 Iniciando commits del Sistema de Préstamos..."
echo "================================================"
echo "📋 Total de commits: 17"
echo ""

# Verificar que estamos en un repositorio git
if [ ! -d .git ]; then
    echo "❌ Error: No se encontró un repositorio Git."
    echo "   Ejecuta primero: git init"
    exit 1
fi

# Función para hacer commit con confirmación
commit_step() {
    local step_num=$1
    local message=$2
    local files=$3
    
    echo ""
    echo "📌 Commit $step_num/17: $message"
    echo "   Archivos: $files"
    
    read -p "   ¿Ejecutar este commit? (s/n): " confirm
    if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
        git add $files
        git commit -m "$message"
        echo "   ✅ Commit $step_num realizado"
    else
        echo "   ⏭️  Commit $step_num omitido"
    fi
}

# Función para commit automático (sin confirmación)
auto_commit() {
    local step_num=$1
    local message=$2
    local files=$3
    
    echo ""
    echo "📌 Commit $step_num/17: $message"
    echo "   Archivos: $files"
    
    git add $files
    git commit -m "$message"
    echo "   ✅ Commit $step_num realizado"
}

# ============================================
# SELECCIONAR MODO
# ============================================
echo "Selecciona el modo de ejecución:"
echo "  1) Automático (todos los commits sin preguntar)"
echo "  2) Interactivo (confirmar cada commit)"
echo "  3) Solo mostrar comandos (no ejecutar)"
echo ""
read -p "Opción (1/2/3): " mode

if [ "$mode" = "1" ]; then
    COMMIT_FUNC="auto_commit"
    echo "🤖 Modo automático activado"
elif [ "$mode" = "3" ]; then
    echo ""
    echo "📋 Comandos a ejecutar:"
    echo "========================"
    echo ""
    echo "# Commit 1: Setup inicial"
    echo "git add index.html src/index.css src/main.tsx"
    echo "git commit -m \"chore: setup inicial del proyecto con Vite + React + Tailwind\""
    echo ""
    echo "# Commit 2: Tipos e interfaces"
    echo "git add src/types.ts"
    echo "git commit -m \"feat(types): definir interfaces para préstamos, amortización y pagos\""
    echo ""
    echo "# Commit 3: Componente principal"
    echo "git add src/App.tsx"
    echo "git commit -m \"feat(app): crear componente principal con navegación por pestañas y lógica de amortización\""
    echo ""
    echo "# Commit 4: Calculadora"
    echo "git add src/components/LoanCalculator.tsx"
    echo "git commit -m \"feat(calculator): agregar calculadora con sliders, presets y modal de guardado\""
    echo ""
    echo "# Commit 5: Dashboard"
    echo "git add src/components/Dashboard.tsx"
    echo "git commit -m \"feat(dashboard): agregar panel visual con gráficos de composición, evolución y métricas\""
    echo ""
    echo "# Commit 6: Tabla de amortización"
    echo "git add src/components/AmortizationTable.tsx"
    echo "git commit -m \"feat(table): agregar tabla de amortización con exportación CSV e impresión\""
    echo ""
    echo "# Commit 7: Calendario de pagos"
    echo "git add src/components/PaymentCalendar.tsx"
    echo "git commit -m \"feat(calendar): agregar calendario con timeline, estados y cálculo de mora\""
    echo ""
    echo "# Commit 8: Registro de pagos"
    echo "git add src/components/PaymentRegister.tsx"
    echo "git commit -m \"feat(payments): agregar módulo de registro con comprobantes y pagos extras\""
    echo ""
    echo "# Commit 9: Simulador de pagos anticipados"
    echo "git add src/components/EarlyPaymentSimulator.tsx"
    echo "git commit -m \"feat(simulator): agregar simulador de pagos anticipados con comparación visual\""
    echo ""
    echo "# Commit 10: Comparador de tasas"
    echo "git add src/components/RateComparator.tsx"
    echo "git commit -m \"feat(comparator): agregar comparador de tasas con hasta 5 escenarios\""
    echo ""
    echo "# Commit 11: Historial de préstamos"
    echo "git add src/components/LoanHistory.tsx"
    echo "git commit -m \"feat(history): agregar historial con persistencia en localStorage\""
    echo ""
    echo "# Commit 12: Estilos de impresión"
    echo "git add src/index.css"
    echo "git commit -m \"style: agregar estilos de impresión, scrollbar personalizado y animaciones\""
    echo ""
    echo "# Commit 13: Documento de planificación"
    echo "git add PROJECT_PLAN.md"
    echo "git commit -m \"chore(docs): crear documento de planificación del proyecto PROJECT_PLAN.md\""
    echo ""
    echo "# Commit 14: Componente ProjectPlan"
    echo "git add src/components/ProjectPlan.tsx"
    echo "git commit -m \"feat(plan): agregar componente ProjectPlan con visualización interactiva del proyecto\""
    echo ""
    echo "# Commit 15: Mejoras en tipos"
    echo "git add src/types.ts"
    echo "git commit -m \"feat(types): agregar campos status, updatedAt y notes a interfaz SavedLoan\""
    echo ""
    echo "# Commit 16: Handlers en App"
    echo "git add src/App.tsx"
    echo "git commit -m \"feat(app): agregar handlers para update, duplicate y export de préstamos\""
    echo ""
    echo "# Commit 17: Mejoras en historial"
    echo "git add src/components/LoanHistory.tsx"
    echo "git commit -m \"feat(history): mejorar módulo de historial con edición, duplicación, exportación y estados\""
    echo ""
    echo "========================"
    echo "✅ Comandos listos para copiar y ejecutar"
    exit 0
else
    COMMIT_FUNC="commit_step"
    echo "🖱️  Modo interactivo activado"
fi

# ============================================
# FASE 1: FUNDACIÓN (Commits 1-3)
# ============================================
echo ""
echo "═══════════════════════════════════════"
echo "  📦 FASE 1: FUNDACIÓN"
echo "═══════════════════════════════════════"

$COMMIT_FUNC 1 \
    "chore: setup inicial del proyecto con Vite + React + Tailwind" \
    "index.html src/index.css src/main.tsx"

$COMMIT_FUNC 2 \
    "feat(types): definir interfaces para préstamos, amortización y pagos" \
    "src/types.ts"

$COMMIT_FUNC 3 \
    "feat(app): crear componente principal con navegación por pestañas y lógica de amortización" \
    "src/App.tsx"

# ============================================
# FASE 2: MÓDULOS CORE (Commits 4-7)
# ============================================
echo ""
echo "═══════════════════════════════════════"
echo "  🧮 FASE 2: MÓDULOS CORE"
echo "═══════════════════════════════════════"

$COMMIT_FUNC 4 \
    "feat(calculator): agregar calculadora con sliders, presets y modal de guardado" \
    "src/components/LoanCalculator.tsx"

$COMMIT_FUNC 5 \
    "feat(dashboard): agregar panel visual con gráficos de composición, evolución y métricas" \
    "src/components/Dashboard.tsx"

$COMMIT_FUNC 6 \
    "feat(table): agregar tabla de amortización con exportación CSV e impresión" \
    "src/components/AmortizationTable.tsx"

$COMMIT_FUNC 7 \
    "feat(calendar): agregar calendario con timeline, estados y cálculo de mora" \
    "src/components/PaymentCalendar.tsx"

# ============================================
# FASE 3: GESTIÓN (Commits 8-11)
# ============================================
echo ""
echo "═══════════════════════════════════════"
echo "  💳 FASE 3: GESTIÓN"
echo "═══════════════════════════════════════"

$COMMIT_FUNC 8 \
    "feat(payments): agregar módulo de registro con comprobantes y pagos extras" \
    "src/components/PaymentRegister.tsx"

$COMMIT_FUNC 9 \
    "feat(simulator): agregar simulador de pagos anticipados con comparación visual" \
    "src/components/EarlyPaymentSimulator.tsx"

$COMMIT_FUNC 10 \
    "feat(comparator): agregar comparador de tasas con hasta 5 escenarios" \
    "src/components/RateComparator.tsx"

$COMMIT_FUNC 11 \
    "feat(history): agregar historial con persistencia en localStorage" \
    "src/components/LoanHistory.tsx"

# ============================================
# FASE 4: ESTILOS (Commit 12)
# ============================================
echo ""
echo "═══════════════════════════════════════"
echo "  🎨 FASE 4: ESTILOS"
echo "═══════════════════════════════════════"

$COMMIT_FUNC 12 \
    "style: agregar estilos de impresión, scrollbar personalizado y animaciones" \
    "src/index.css"

# ============================================
# FASE 5: DOCUMENTACIÓN (Commits 13-14)
# ============================================
echo ""
echo "═══════════════════════════════════════"
echo "  📋 FASE 5: DOCUMENTACIÓN"
echo "═══════════════════════════════════════"

$COMMIT_FUNC 13 \
    "chore(docs): crear documento de planificación del proyecto PROJECT_PLAN.md" \
    "PROJECT_PLAN.md"

$COMMIT_FUNC 14 \
    "feat(plan): agregar componente ProjectPlan con visualización interactiva del proyecto" \
    "src/components/ProjectPlan.tsx"

# ============================================
# FASE 6: MEJORAS AVANZADAS (Commits 15-17)
# ============================================
echo ""
echo "═══════════════════════════════════════"
echo "  💎 FASE 6: MEJORAS AVANZADAS"
echo "═══════════════════════════════════════"

$COMMIT_FUNC 15 \
    "feat(types): agregar campos status, updatedAt y notes a interfaz SavedLoan" \
    "src/types.ts"

$COMMIT_FUNC 16 \
    "feat(app): agregar handlers para update, duplicate y export de préstamos" \
    "src/App.tsx"

$COMMIT_FUNC 17 \
    "feat(history): mejorar módulo de historial con edición, duplicación, exportación y estados" \
    "src/components/LoanHistory.tsx"

# ============================================
# RESULTADO FINAL
# ============================================
echo ""
echo "================================================"
echo "✅ ¡Commits completados!"
echo "================================================"
echo ""
echo "📊 Resumen de fases:"
echo "  📦 Fase 1: Fundación (3 commits)"
echo "  🧮 Fase 2: Módulos Core (4 commits)"
echo "  💳 Fase 3: Gestión (4 commits)"
echo "  🎨 Fase 4: Estilos (1 commit)"
echo "  📋 Fase 5: Documentación (2 commits)"
echo "  💎 Fase 6: Mejoras Avanzadas (3 commits)"
echo ""
echo "📈 Últimos commits:"
git log --oneline -17
echo ""
echo "🔍 Para ver el historial completo:"
echo "   git log --oneline --graph"
echo ""
echo "🎉 ¡Listo! Sistema de Préstamos v2.0"
