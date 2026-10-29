# 📋 Guía de Commits - Sistema de Préstamos v2.0

Este documento describe la secuencia de 17 commits específicos organizados en 6 fases.

## 🚀 Cómo usar

```bash
# Opción 1: Ejecutar el script automático
chmod +x apply-commits.sh
./apply-commits.sh

# Opción 2: Copiar comandos individuales (ver abajo)
```

---

## 📦 FASE 1: FUNDACIÓN

### Commit 1: Setup inicial
```bash
git add index.html src/index.css src/main.tsx
git commit -m "chore: setup inicial del proyecto con Vite + React + Tailwind"
```
**Archivos:** `index.html`, `src/index.css`, `src/main.tsx`

### Commit 2: Tipos e interfaces
```bash
git add src/types.ts
git commit -m "feat(types): definir interfaces para préstamos, amortización y pagos"
```
**Archivos:** `src/types.ts`

### Commit 3: Componente principal
```bash
git add src/App.tsx
git commit -m "feat(app): crear componente principal con navegación por pestañas y lógica de amortización"
```
**Archivos:** `src/App.tsx`

---

## 🧮 FASE 2: MÓDULOS CORE

### Commit 4: Calculadora
```bash
git add src/components/LoanCalculator.tsx
git commit -m "feat(calculator): agregar calculadora con sliders, presets y modal de guardado"
```

### Commit 5: Dashboard
```bash
git add src/components/Dashboard.tsx
git commit -m "feat(dashboard): agregar panel visual con gráficos de composición, evolución y métricas"
```

### Commit 6: Tabla de amortización
```bash
git add src/components/AmortizationTable.tsx
git commit -m "feat(table): agregar tabla de amortización con exportación CSV e impresión"
```

### Commit 7: Calendario de pagos
```bash
git add src/components/PaymentCalendar.tsx
git commit -m "feat(calendar): agregar calendario con timeline, estados y cálculo de mora"
```

---

## 💳 FASE 3: GESTIÓN

### Commit 8: Registro de pagos
```bash
git add src/components/PaymentRegister.tsx
git commit -m "feat(payments): agregar módulo de registro con comprobantes y pagos extras"
```

### Commit 9: Simulador de pagos anticipados
```bash
git add src/components/EarlyPaymentSimulator.tsx
git commit -m "feat(simulator): agregar simulador de pagos anticipados con comparación visual"
```

### Commit 10: Comparador de tasas
```bash
git add src/components/RateComparator.tsx
git commit -m "feat(comparator): agregar comparador de tasas con hasta 5 escenarios"
```

### Commit 11: Historial de préstamos
```bash
git add src/components/LoanHistory.tsx
git commit -m "feat(history): agregar historial con persistencia en localStorage"
```

---

## 🎨 FASE 4: ESTILOS

### Commit 12: Estilos de impresión
```bash
git add src/index.css
git commit -m "style: agregar estilos de impresión, scrollbar personalizado y animaciones"
```

---

## 📋 FASE 5: DOCUMENTACIÓN

### Commit 13: Plan del proyecto
```bash
git add PROJECT_PLAN.md
git commit -m "chore(docs): crear documento de planificación del proyecto PROJECT_PLAN.md"
```

### Commit 14: Componente ProjectPlan
```bash
git add src/components/ProjectPlan.tsx
git commit -m "feat(plan): agregar componente ProjectPlan con visualización interactiva del proyecto"
```

---

## 💎 FASE 6: MEJORAS AVANZADAS

### Commit 15: Mejoras en tipos
```bash
git add src/types.ts
git commit -m "feat(types): agregar campos status, updatedAt y notes a interfaz SavedLoan"
```

### Commit 16: Handlers en App
```bash
git add src/App.tsx
git commit -m "feat(app): agregar handlers para update, duplicate y export de préstamos"
```

### Commit 17: Mejoras en historial
```bash
git add src/components/LoanHistory.tsx
git commit -m "feat(history): mejorar módulo de historial con edición, duplicación, exportación y estados"
```

---

## 📊 Resumen

| Fase | Commits | Descripción |
|------|---------|-------------|
| 📦 Fundación | 1-3 | Setup, tipos, componente principal |
| 🧮 Módulos Core | 4-7 | Calculadora, dashboard, tabla, calendario |
| 💳 Gestión | 8-11 | Pagos, simulador, comparador, historial |
| 🎨 Estilos | 12 | CSS de impresión y animaciones |
| 📋 Documentación | 13-14 | Plan del proyecto y visualización |
| 💎 Mejoras | 15-17 | Edición, duplicación, exportación |

## 🔍 Ver historial

```bash
git log --oneline --graph
```
