#!/bin/bash

# ============================================
# 🚀 Script de Commits - Sistema de Préstamos v4.0
# ============================================
# 52 commits específicos organizados en 10 fases
# Ejecutar: chmod +x apply-commits.sh && ./apply-commits.sh

set -e  # Detener si hay error

echo "🚀 Iniciando commits del Sistema de Préstamos v4.0..."
echo "================================================"
echo "📋 Total de commits: 52"
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
    echo "📌 Commit $step_num/52: $message"
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
    echo "📌 Commit $step_num/52: $message"
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
    echo "# FASE 1: FUNDACIÓN"
    echo "git add index.html src/index.css src/main.tsx && git commit -m \"chore: setup inicial del proyecto con Vite + React + Tailwind\""
    echo "git add src/types.ts && git commit -m \"feat(types): definir interfaces para préstamos, amortización y pagos\""
    echo "git add src/App.tsx && git commit -m \"feat(app): crear componente principal con navegación por pestañas y lógica de amortización\""
    echo ""
    echo "# FASE 2: MÓDULOS CORE"
    echo "git add src/components/LoanCalculator.tsx && git commit -m \"feat(calculator): agregar calculadora con sliders, presets y modal de guardado\""
    echo "git add src/components/Dashboard.tsx && git commit -m \"feat(dashboard): agregar panel visual con gráficos de composición, evolución y métricas\""
    echo "git add src/components/AmortizationTable.tsx && git commit -m \"feat(table): agregar tabla de amortización con exportación CSV e impresión\""
    echo "git add src/components/PaymentCalendar.tsx && git commit -m \"feat(calendar): agregar calendario con timeline, estados y cálculo de mora\""
    echo ""
    echo "# FASE 3: GESTIÓN"
    echo "git add src/components/PaymentRegister.tsx && git commit -m \"feat(payments): agregar módulo de registro con comprobantes y pagos extras\""
    echo "git add src/components/EarlyPaymentSimulator.tsx && git commit -m \"feat(simulator): agregar simulador de pagos anticipados con comparación visual\""
    echo "git add src/components/RateComparator.tsx && git commit -m \"feat(comparator): agregar comparador de tasas con hasta 5 escenarios\""
    echo "git add src/components/LoanHistory.tsx && git commit -m \"feat(history): agregar historial con persistencia en localStorage\""
    echo ""
    echo "# FASE 4: ESTILOS"
    echo "git add src/index.css && git commit -m \"style: agregar estilos de impresión, scrollbar personalizado y animaciones\""
    echo ""
    echo "# FASE 5: DOCUMENTACIÓN"
    echo "git add PROJECT_PLAN.md && git commit -m \"chore(docs): crear documento de planificación del proyecto PROJECT_PLAN.md\""
    echo "git add src/components/ProjectPlan.tsx && git commit -m \"feat(plan): agregar componente ProjectPlan con visualización interactiva del proyecto\""
    echo ""
    echo "# FASE 6: MEJORAS AVANZADAS"
    echo "git add src/types.ts && git commit -m \"feat(types): agregar campos status, updatedAt y notes a interfaz SavedLoan\""
    echo "git add src/App.tsx && git commit -m \"feat(app): agregar handlers para update, duplicate y export de préstamos\""
    echo "git add src/components/LoanHistory.tsx && git commit -m \"feat(history): mejorar módulo de historial con edición, duplicación, exportación y estados\""
    echo ""
    echo "# FASE 7: MEJORAS EN TABLA"
    echo "git add src/components/AmortizationTable.tsx && git commit -m \"feat(table): agregar filtros avanzados por rango de fechas y montos\""
    echo "git add src/components/AmortizationTable.tsx && git commit -m \"feat(table): integrar gráfico de evolución del préstamo en la tabla\""
    echo "git add src/components/AmortizationTable.tsx && git commit -m \"feat(table): agregar sparkline charts inline para tendencias\""
    echo "git add src/components/AmortizationTable.tsx && git commit -m \"feat(table): agregar tooltips informativos al pasar el mouse\""
    echo "git add src/components/AmortizationTable.tsx && git commit -m \"feat(table): agregar agrupación temporal trimestral y anual\""
    echo "git add src/components/AmortizationTable.tsx && git commit -m \"feat(table): agregar exportación a Word (.docx) con formato profesional\""
    echo "git add src/index.css && git commit -m \"style(print): optimizar estilos CSS para impresión profesional\""
    echo "git add src/components/AmortizationTable.tsx && git commit -m \"feat(table): agregar alertas de vencimiento con notificaciones visuales\""
    echo "git add src/components/AmortizationTable.tsx src/App.tsx && git commit -m \"feat(table): implementar sistema de redondeo inteligente al entero superior\""
    echo ""
    echo "# FASE 8: NUEVAS FUNCIONALIDADES"
    echo "git add src/components/FinancialDashboard.tsx src/App.tsx && git commit -m \"feat(financial): agregar dashboard de métricas financieras con KPIs y gráficos\""
    echo "git add src/contexts/ThemeContext.tsx src/App.tsx src/index.css && git commit -m \"feat(theme): implementar modo oscuro/claro con persistencia en localStorage\""
    echo "git add src/components/GlobalSearch.tsx src/App.tsx && git commit -m \"feat(search): agregar búsqueda global con atajo Ctrl+K\""
    echo "git add src/components/ExcelImport.tsx src/App.tsx && git commit -m \"feat(import): implementar importación masiva de préstamos desde Excel\""
    echo "git add src/components/ContractGenerator.tsx && git commit -m \"feat(contract): agregar generador de contratos PDF profesionales\""
    echo "git add src/components/NotificationSystem.tsx src/App.tsx && git commit -m \"feat(notification): implementar sistema de notificaciones con alertas de vencimiento\""
    echo "git add public/manifest.json public/sw.js public/icon-192.svg public/icon-512.svg index.html && git commit -m \"feat(pwa): agregar soporte PWA con service worker y manifiesto\""
    echo "git add src/contexts/AuthContext.tsx src/components/Login.tsx src/App.tsx && git commit -m \"feat(auth): implementar sistema multi-usuario con roles y permisos\""
    echo "git add src/components/MonthlyReport.tsx src/App.tsx && git commit -m \"feat(reports): agregar reportes mensuales automáticos con exportación PDF\""
    echo "git add src/components/LoanRenegotiation.tsx src/App.tsx && git commit -m \"feat(renegotiation): implementar renegociación de préstamos con recálculo automático\""
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
# FASE 7: MEJORAS EN TABLA (Commits 18-26)
# ============================================
echo ""
echo "═══════════════════════════════════════"
echo "  📊 FASE 7: MEJORAS EN TABLA"
echo "═══════════════════════════════════════"

$COMMIT_FUNC 18 \
    "feat(table): agregar filtros avanzados por rango de fechas y montos" \
    "src/components/AmortizationTable.tsx"

$COMMIT_FUNC 19 \
    "feat(table): integrar gráfico de evolución del préstamo en la tabla" \
    "src/components/AmortizationTable.tsx"

$COMMIT_FUNC 20 \
    "feat(table): agregar sparkline charts inline para tendencias" \
    "src/components/AmortizationTable.tsx"

$COMMIT_FUNC 21 \
    "feat(table): agregar tooltips informativos al pasar el mouse" \
    "src/components/AmortizationTable.tsx"

$COMMIT_FUNC 22 \
    "feat(table): agregar agrupación temporal trimestral y anual" \
    "src/components/AmortizationTable.tsx"

$COMMIT_FUNC 23 \
    "feat(table): agregar exportación a Word (.docx) con formato profesional" \
    "src/components/AmortizationTable.tsx"

$COMMIT_FUNC 24 \
    "style(print): optimizar estilos CSS para impresión profesional" \
    "src/index.css"

$COMMIT_FUNC 25 \
    "feat(table): agregar alertas de vencimiento con notificaciones visuales" \
    "src/components/AmortizationTable.tsx"

$COMMIT_FUNC 26 \
    "feat(table): implementar sistema de redondeo inteligente al entero superior" \
    "src/components/AmortizationTable.tsx src/App.tsx"

# ============================================
# FASE 8: NUEVAS FUNCIONALIDADES (Commits 27-36)
# ============================================
echo ""
echo "═══════════════════════════════════════"
echo "  🚀 FASE 8: NUEVAS FUNCIONALIDADES"
echo "═══════════════════════════════════════"

$COMMIT_FUNC 27 \
    "feat(financial): agregar dashboard de métricas financieras con KPIs y gráficos" \
    "src/components/FinancialDashboard.tsx src/App.tsx"

$COMMIT_FUNC 28 \
    "feat(theme): implementar modo oscuro/claro con persistencia en localStorage" \
    "src/contexts/ThemeContext.tsx src/App.tsx src/index.css"

$COMMIT_FUNC 29 \
    "feat(search): agregar búsqueda global con atajo Ctrl+K" \
    "src/components/GlobalSearch.tsx src/App.tsx"

$COMMIT_FUNC 30 \
    "feat(import): implementar importación masiva de préstamos desde Excel" \
    "src/components/ExcelImport.tsx src/App.tsx"

$COMMIT_FUNC 31 \
    "feat(contract): agregar generador de contratos PDF profesionales" \
    "src/components/ContractGenerator.tsx"

$COMMIT_FUNC 32 \
    "feat(notification): implementar sistema de notificaciones con alertas de vencimiento" \
    "src/components/NotificationSystem.tsx src/App.tsx"

$COMMIT_FUNC 33 \
    "feat(pwa): agregar soporte PWA con service worker y manifiesto" \
    "public/manifest.json public/sw.js public/icon-192.svg public/icon-512.svg index.html"

$COMMIT_FUNC 34 \
    "feat(auth): implementar sistema multi-usuario con roles y permisos" \
    "src/contexts/AuthContext.tsx src/components/Login.tsx src/App.tsx"

$COMMIT_FUNC 35 \
    "feat(reports): agregar reportes mensuales automáticos con exportación PDF" \
    "src/components/MonthlyReport.tsx src/App.tsx"

$COMMIT_FUNC 36 \
    "feat(renegotiation): implementar renegociación de préstamos con recálculo automático" \
    "src/components/LoanRenegotiation.tsx src/App.tsx"

# ============================================
# FASE 9: BACKEND NODE.JS (Commits 37-48)
# ============================================
echo ""
echo "═══════════════════════════════════════"
echo "  🖥️ FASE 9: BACKEND NODE.JS"
echo "═══════════════════════════════════════"

$COMMIT_FUNC 37 \
    "chore(backend): inicializar proyecto backend con Node.js, TypeScript y configuración" \
    "backend/package.json backend/tsconfig.json backend/.env.example"

$COMMIT_FUNC 38 \
    "feat(backend): crear schema de base de datos PostgreSQL con Prisma (6 tablas)" \
    "backend/prisma/schema.prisma"

$COMMIT_FUNC 39 \
    "feat(backend): configurar servidor Express con middlewares de seguridad" \
    "backend/src/index.ts backend/src/config/"

$COMMIT_FUNC 40 \
    "feat(backend): implementar middleware de autenticación JWT y manejo de errores" \
    "backend/src/middleware/auth.middleware.ts backend/src/middleware/error.middleware.ts"

$COMMIT_FUNC 41 \
    "feat(backend): implementar controlador y rutas de autenticación (register, login, getMe)" \
    "backend/src/controllers/auth.controller.ts backend/src/routes/auth.routes.ts"

$COMMIT_FUNC 42 \
    "feat(backend): implementar controlador y rutas de préstamos (CRUD completo + duplicar)" \
    "backend/src/controllers/loan.controller.ts backend/src/routes/loan.routes.ts"

$COMMIT_FUNC 43 \
    "feat(backend): implementar controlador y rutas de pagos (CRUD completo)" \
    "backend/src/controllers/payment.controller.ts backend/src/routes/payment.routes.ts"

$COMMIT_FUNC 44 \
    "feat(backend): implementar controlador y rutas de garantes (CRUD completo)" \
    "backend/src/controllers/guarantor.controller.ts backend/src/routes/guarantor.routes.ts"

$COMMIT_FUNC 45 \
    "feat(backend): implementar controlador y rutas de configuración de marca" \
    "backend/src/controllers/brand.controller.ts backend/src/routes/brand.routes.ts"

$COMMIT_FUNC 46 \
    "feat(backend): implementar servicios de negocio (loan, payment, guarantor, brand)" \
    "backend/src/services/"

$COMMIT_FUNC 47 \
    "feat(backend): integrar Stripe para pagos con payment intents y webhooks" \
    "backend/src/controllers/stripe.controller.ts backend/src/routes/stripe.routes.ts backend/src/services/stripe.service.ts"

$COMMIT_FUNC 48 \
    "feat(backend): integrar PayPal para pagos con órdenes y webhooks" \
    "backend/src/controllers/paypal.controller.ts backend/src/routes/paypal.routes.ts backend/src/services/paypal.service.ts"

# ============================================
# FASE 10: TESTS Y OPTIMIZACIÓN (Commits 49-52)
# ============================================
echo ""
echo "═══════════════════════════════════════"
echo "  🧪 FASE 10: TESTS Y OPTIMIZACIÓN"
echo "═══════════════════════════════════════"

$COMMIT_FUNC 49 \
    "test: configurar Jest con React Testing Library y setup global" \
    "jest.config.js src/setupTests.ts"

$COMMIT_FUNC 50 \
    "test: implementar 11 tests unitarios para lógica de cálculo de amortización" \
    "src/__tests__/calculations.test.ts src/utils/calculations.ts"

$COMMIT_FUNC 51 \
    "test: implementar 13 tests de componentes (Login y GuarantorSystem)" \
    "src/__tests__/Login.test.tsx src/__tests__/GuarantorSystem.test.tsx"

$COMMIT_FUNC 52 \
    "perf: implementar lazy loading con React.lazy y Suspense para 9 componentes" \
    "src/App.tsx"

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
echo "  📊 Fase 7: Mejoras en Tabla (9 commits)"
echo "  🚀 Fase 8: Nuevas Funcionalidades (10 commits)"
echo "  🖥️ Fase 9: Backend Node.js (12 commits)"
echo "  🧪 Fase 10: Tests y Optimización (4 commits)"
echo ""
echo "📈 Últimos commits:"
git log --oneline -52
echo ""
echo "🔍 Para ver el historial completo:"
echo "   git log --oneline --graph"
echo ""
echo "🎉 ¡Listo! Sistema de Préstamos v4.0 - 100% Completado"
