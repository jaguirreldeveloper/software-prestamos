#!/bin/bash

# ============================================
# 🚀 Script de Commits - Sistema de Préstamos
# ============================================
# Ejecutar: chmod +x apply-commits.sh && ./apply-commits.sh

set -e  # Detener si hay error

echo "🚀 Iniciando commits del Sistema de Préstamos..."
echo "================================================"
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
    echo "📌 Commit $step_num: $message"
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
    echo "📌 Commit $step_num: $message"
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
echo ""
read -p "Opción (1/2): " mode

if [ "$mode" = "1" ]; then
    COMMIT_FUNC="auto_commit"
    echo "🤖 Modo automático activado"
elif [ "$mode" = "2" ]; then
    COMMIT_FUNC="commit_step"
    echo "🖱️  Modo interactivo activado"
else
    echo "❌ Opción no válida. Usando modo automático."
    COMMIT_FUNC="auto_commit"
fi

# ============================================
# EJECUTAR COMMITS
# ============================================

$COMMIT_FUNC 1 \
    "chore: setup inicial del proyecto con Vite + React + Tailwind" \
    "index.html src/index.css src/main.tsx"

$COMMIT_FUNC 2 \
    "feat(types): definir interfaces para préstamos, amortización y pagos" \
    "src/types.ts"

$COMMIT_FUNC 3 \
    "feat(app): crear componente principal con navegación por pestañas y lógica de amortización" \
    "src/App.tsx"

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

$COMMIT_FUNC 12 \
    "style: agregar estilos de impresión, scrollbar personalizado y animaciones" \
    "src/index.css"

# ============================================
# RESULTADO FINAL
# ============================================
echo ""
echo "================================================"
echo "✅ ¡Commits completados!"
echo "================================================"
echo ""
echo "📊 Resumen:"
git log --oneline -12
echo ""
echo "📈 Estadísticas del repositorio:"
git log --oneline | wc -l | xargs echo "   Total de commits:"
git diff --stat HEAD~1 HEAD 2>/dev/null || echo "   (sin cambios previos para comparar)"
echo ""
echo "🔍 Para ver el historial completo:"
echo "   git log --oneline --graph"
echo ""
echo "🎉 ¡Listo!"
