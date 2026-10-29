# 📋 Guía de Commits - Sistema de Préstamos

Este documento describe la secuencia de commits específicos para el proyecto.

## 🚀 Cómo usar

```bash
# Opción 1: Ejecutar el script automático
chmod +x apply-commits.sh
./apply-commits.sh

# Opción 2: Ejecutar manualmente cada commit
# (ver comandos abajo)
```

---

## 📝 Secuencia de Commits

### Commit 1: Setup inicial del proyecto
```bash
git add index.html src/index.css src/main.tsx
git commit -m "chore: setup inicial del proyecto con Vite + React + Tailwind"
```
**Archivos:** `index.html`, `src/index.css`, `src/main.tsx`
**Descripción:** Configuración base del proyecto con las dependencias fundamentales.

---

### Commit 2: Definición de tipos e interfaces
```bash
git add src/types.ts
git commit -m "feat(types): definir interfaces para préstamos, amortización y pagos"
```
**Archivos:** `src/types.ts`
**Descripción:** Tipos TypeScript para LoanParams, AmortizationRow, PaymentRecord, SavedLoan y RateComparison.

---

### Commit 3: Componente principal App con navegación
```bash
git add src/App.tsx
git commit -m "feat(app): crear componente principal con navegación por pestañas y lógica de amortización"
```
**Archivos:** `src/App.tsx`
**Descripción:** Layout principal, sistema de tabs, función calculateAmortization con fórmula francesa.

---

### Commit 4: Calculadora de préstamos
```bash
git add src/components/LoanCalculator.tsx
git commit -m "feat(calculator): agregar calculadora con sliders, presets y modal de guardado"
```
**Archivos:** `src/components/LoanCalculator.tsx`
**Descripción:** Formulario con inputs para monto, tasa, plazo, fecha. Incluye sliders, plantillas rápidas y modal para guardar préstamos.

---

### Commit 5: Dashboard con gráficos
```bash
git add src/components/Dashboard.tsx
git commit -m "feat(dashboard): agregar panel visual con gráficos de composición, evolución y métricas"
```
**Archivos:** `src/components/Dashboard.tsx`
**Descripción:** KPIs, gráfico de torta (capital vs interés), área (saldo), barras (capital/interés por cuota), métricas clave.

---

### Commit 6: Tabla de amortización
```bash
git add src/components/AmortizationTable.tsx
git commit -m "feat(table): agregar tabla de amortización con exportación CSV e impresión"
```
**Archivos:** `src/components/AmortizationTable.tsx`
**Descripción:** Tabla completa con todas las columnas, totales, exportación a CSV y función de impresión.

---

### Commit 7: Calendario de pagos con mora
```bash
git add src/components/PaymentCalendar.tsx
git commit -m "feat(calendar): agregar calendario con timeline, estados y cálculo de mora"
```
**Archivos:** `src/components/PaymentCalendar.tsx`
**Descripción:** Vista timeline con estados (pagado/próximo/pendiente), barras de progreso, alertas de mora y cálculo automático.

---

### Commit 8: Registro de pagos
```bash
git add src/components/PaymentRegister.tsx
git commit -m "feat(payments): agregar módulo de registro con comprobantes y pagos extras"
```
**Archivos:** `src/components/PaymentRegister.tsx`
**Descripción:** Formulario para registrar pagos, pagos extras a capital, comprobantes imprimibles e historial.

---

### Commit 9: Simulador de pagos anticipados
```bash
git add src/components/EarlyPaymentSimulator.tsx
git commit -m "feat(simulator): agregar simulador de pagos anticipados con comparación visual"
```
**Archivos:** `src/components/EarlyPaymentSimulator.tsx`
**Descripción:** Simula pagos extra con diferentes frecuencias, muestra ahorro en intereses y meses reducidos.

---

### Commit 10: Comparador de tasas
```bash
git add src/components/RateComparator.tsx
git commit -m "feat(comparator): agregar comparador de tasas con hasta 5 escenarios"
```
**Archivos:** `src/components/RateComparator.tsx`
**Descripción:** Permite comparar diferentes tasas y plazos, identifica la mejor opción automáticamente.

---

### Commit 11: Historial de préstamos
```bash
git add src/components/LoanHistory.tsx
git commit -m "feat(history): agregar historial con persistencia en localStorage"
```
**Archivos:** `src/components/LoanHistory.tsx`
**Descripción:** Tarjetas de préstamos guardados, resumen del portafolio, cargar/eliminar préstamos.

---

### Commit 12: Estilos de impresión y scrollbar
```bash
git add src/index.css
git commit -m "style: agregar estilos de impresión, scrollbar personalizado y animaciones"
```
**Archivos:** `src/index.css`
**Descripción:** Media queries para impresión, scrollbar custom, estilos para range inputs.

---

## 📊 Resumen

| # | Tipo | Alcance | Descripción |
|---|------|---------|-------------|
| 1 | `chore` | setup | Configuración base |
| 2 | `feat` | types | Interfaces TypeScript |
| 3 | `feat` | app | Layout y lógica central |
| 4 | `feat` | calculator | Calculadora de préstamos |
| 5 | `feat` | dashboard | Panel visual con gráficos |
| 6 | `feat` | table | Tabla de amortización |
| 7 | `feat` | calendar | Calendario con mora |
| 8 | `feat` | payments | Registro de pagos |
| 9 | `feat` | simulator | Pagos anticipados |
| 10 | `feat` | comparator | Comparador de tasas |
| 11 | `feat` | history | Historial persistente |
| 12 | `style` | css | Estilos de impresión |

---

## 🔍 Ver historial de commits

```bash
# Ver todos los commits
git log --oneline

# Ver commits con gráfico
git log --oneline --graph --all

# Ver commits de hoy
git log --since="today" --oneline

# Ver estadísticas por commit
git log --stat
```

## 🔄 Deshacer un commit específico

```bash
# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (descartar cambios)
git reset --hard HEAD~1

# Deshacer commit específico
git revert <commit-hash>
```
