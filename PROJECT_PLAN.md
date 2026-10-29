# 📋 Documento de Planificación del Proyecto
# Sistema de Gestión de Préstamos v2.0

---

## 📑 Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Objetivos](#2-objetivos)
3. [Alcance del Proyecto](#3-alcance-del-proyecto)
4. [Arquitectura Técnica](#4-arquitectura-técnica)
5. [Módulos del Sistema](#5-módulos-del-sistema)
6. [Cronograma de Desarrollo](#6-cronograma-de-desarrollo)
7. [Requisitos Técnicos](#7-requisitos-técnicos)
8. [Metodología](#8-metodología)
9. [Riesgos y Mitigación](#9-riesgos-y-mitigación)
10. [Criterios de Éxito](#10-criterios-de-éxito)
11. [Entregables](#11-entregables)
12. [Próximas Fases](#12-próximas-fases)

---

## 1. Resumen Ejecutivo

### Nombre del Proyecto
**Sistema de Gestión de Préstamos** — Calculadora de Amortización con Gestión Integral

### Descripción
Sistema web completo para la gestión de préstamos personales/comerciales basado en el método de amortización francesa. Permite calcular cuotas, generar tablas de amortización, registrar pagos, simular pagos anticipados, calcular moras y comparar escenarios de tasas.

### Contexto
Desarrollado como respuesta a la necesidad de un sistema que permita:
- Calcular préstamos con precisión matemática
- Visualizar gráficamente la evolución de los pagos
- Gestionar múltiples préstamos simultáneamente
- Tomar decisiones informadas sobre pagos anticipados
- Controlar morosidad con alertas automáticas

### Stakeholders
| Rol | Interés |
|-----|---------|
| Usuario final (prestamista) | Gestión eficiente de cartera |
| Cliente (prestatario) | Transparencia en pagos |
| Administrador | Control y reportes |
| Desarrollador | Mantenibilidad y escalabilidad |

---

## 2. Objetivos

### Objetivo General
Desarrollar un sistema web que permita la gestión integral de préstamos con cálculos precisos de amortización, visualización gráfica y herramientas de análisis financiero.

### Objetivos Específicos
1. ✅ Implementar calculadora de préstamos con fórmula de amortización francesa
2. ✅ Generar tablas de amortización dinámicas con exportación
3. ✅ Visualizar datos financieros mediante gráficos interactivos
4. ✅ Registrar pagos con generación de comprobantes
5. ✅ Simular impacto de pagos anticipados
6. ✅ Calcular automáticamente intereses moratorios
7. ✅ Comparar escenarios de tasas y plazos
8. ✅ Persistir datos de préstamos en el navegador

---

## 3. Alcance del Proyecto

### ✅ INCLUYE (In Scope)

#### Fase 1 — Core (Completado)
- Calculadora de préstamos
- Tabla de amortización francesa
- Dashboard con gráficos
- Calendario de pagos
- Exportación CSV e impresión

#### Fase 2 — Gestión (Completado)
- Registro de pagos con comprobantes
- Simulador de pagos anticipados
- Cálculo de mora configurable
- Comparador de tasas/plazos
- Historial de préstamos (localStorage)
- Timeline de commits

#### Fase 3 — Planificación (En progreso)
- Documentación del proyecto
- Visualización del plan
- Métricas de avance

### ❌ NO INCLUYE (Out of Scope)
- Backend/servidor (actualmente client-side only)
- Base de datos remota
- Autenticación de usuarios
- Multi-tenant
- Integración con pasarelas de pago
- App móvil nativa

---

## 4. Arquitectura Técnica

### Stack Tecnológico

```
┌─────────────────────────────────────────────┐
│              FRONTEND (SPA)                  │
├─────────────────────────────────────────────┤
│  Framework:    React 18 + TypeScript        │
│  Build Tool:   Vite 6                       │
│  Styling:      Tailwind CSS 4               │
│  Charts:       Recharts                     │
│  Icons:        Lucide React                 │
│  Storage:      LocalStorage API             │
└─────────────────────────────────────────────┘
```

### Estructura de Archivos

```
src/
├── App.tsx                          # Componente raíz + lógica central
├── main.tsx                         # Entry point
├── types.ts                         # Interfaces TypeScript
├── index.css                        # Estilos globales
└── components/
    ├── LoanCalculator.tsx           # Calculadora principal
    ├── Dashboard.tsx                # Panel visual con gráficos
    ├── AmortizationTable.tsx        # Tabla de amortización
    ├── PaymentCalendar.tsx          # Calendario con mora
    ├── PaymentRegister.tsx          # Registro de pagos
    ├── EarlyPaymentSimulator.tsx    # Simulador anticipos
    ├── RateComparator.tsx           # Comparador de tasas
    ├── LoanHistory.tsx              # Historial persistente
    ├── CommitTimeline.tsx           # Timeline de commits
    └── ProjectPlan.tsx              # Plan del proyecto
```

### Fórmulas Matemáticas

**Amortización Francesa:**
```
Cuota = P × [r(1+r)^n] / [(1+r)^n - 1]

Donde:
P = Principal (monto del préstamo)
r = Tasa de interés periódica
n = Número de períodos
```

**Mora:**
```
Mora = Cuota × (Tasa_mora / 30) × Días_atraso
```

**Tasa Efectiva Anual:**
```
TEA = (1 + r_mensual)^12 - 1
```

---

## 5. Módulos del Sistema

### M1: Calculadora de Préstamos
| Aspecto | Detalle |
|---------|---------|
| **Propósito** | Calcular cuota mensual y generar tabla |
| **Inputs** | Monto, tasa mensual, plazo, fecha inicio |
| **Outputs** | Cuota fija, total a pagar, interés total |
| **Extras** | Sliders, presets, guardado |

### M2: Dashboard Visual
| Aspecto | Detalle |
|---------|---------|
| **Propósito** | Visualización gráfica de datos |
| **Gráficos** | Pie (composición), Area (saldo), Bar (capital/interés) |
| **KPIs** | Cuota, capital, interés, plazo, TEA |

### M3: Tabla de Amortización
| Aspecto | Detalle |
|---------|---------|
| **Propósito** | Detalle de cada cuota |
| **Columnas** | No., Saldo Ini., Cuota, Interés, Capital, Saldo Fin., Fecha |
| **Acciones** | Exportar CSV, imprimir |

### M4: Calendario de Pagos
| Aspecto | Detalle |
|---------|---------|
| **Propósito** | Vista temporal de pagos |
| **Estados** | Pagado, próximo, pendiente, vencido |
| **Mora** | Cálculo automático con tasa configurable |

### M5: Registro de Pagos
| Aspecto | Detalle |
|---------|---------|
| **Propósito** | Registrar pagos realizados |
| **Funciones** | Pago normal, pago extra, comprobantes |
| **Persistencia** | Vinculado al préstamo guardado |

### M6: Simulador de Pagos Anticipados
| Aspecto | Detalle |
|---------|---------|
| **Propósito** | Evaluar impacto de pagos extra |
| **Variables** | Monto extra, frecuencia, mes de inicio |
| **Outputs** | Ahorro en intereses, meses reducidos |

### M7: Comparador de Tasas
| Aspecto | Detalle |
|---------|---------|
| **Propósito** | Comparar escenarios |
| **Capacidad** | Hasta 5 escenarios simultáneos |
| **Outputs** | Mejor opción, tabla comparativa, gráficos |

### M8: Historial de Préstamos
| Aspecto | Detalle |
|---------|---------|
| **Propósito** | Persistir préstamos |
| **Storage** | localStorage del navegador |
| **Funciones** | Guardar, cargar, eliminar, resumen portafolio |

---

## 6. Cronograma de Desarrollo

### Commits Planificados (12 total)

| # | Commit | Tipo | Estado | Descripción |
|---|--------|------|--------|-------------|
| 1 | `chore: setup inicial` | Configuración | ✅ | Vite + React + Tailwind |
| 2 | `feat(types): interfaces` | Core | ✅ | Tipos TypeScript |
| 3 | `feat(app): componente principal` | Core | ✅ | Layout + lógica amortización |
| 4 | `feat(calculator): calculadora` | Feature | ✅ | Formulario + sliders + presets |
| 5 | `feat(dashboard): panel visual` | Feature | ✅ | Gráficos + KPIs |
| 6 | `feat(table): tabla amortización` | Feature | ✅ | Tabla + CSV + print |
| 7 | `feat(calendar): calendario` | Feature | ✅ | Timeline + mora |
| 8 | `feat(payments): registro pagos` | Feature | ✅ | Comprobantes + extras |
| 9 | `feat(simulator): pagos anticipados` | Feature | ✅ | Simulación + comparación |
| 10 | `feat(comparator): comparador` | Feature | ✅ | Multi-escenario |
| 11 | `feat(history): historial` | Feature | ✅ | localStorage |
| 12 | `style: estilos impresión` | UI | ✅ | CSS print + scrollbar |

### Fases del Proyecto

```
FASE 1: Foundation (Semanas 1-2)
├── Setup del proyecto
├── Definición de tipos
├── Calculadora base
└── Tabla de amortización

FASE 2: Visualización (Semanas 3-4)
├── Dashboard con gráficos
├── Calendario de pagos
└── Estilos de impresión

FASE 3: Gestión (Semanas 5-6)
├── Registro de pagos
├── Simulador anticipos
├── Comparador de tasas
└── Historial persistente

FASE 4: Documentación (Semana 7)
├── Plan del proyecto
├── Timeline de commits
└── README y documentación
```

---

## 7. Requisitos Técnicos

### Requisitos Funcionales
| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-01 | Calcular cuota con amortización francesa | Alta | ✅ |
| RF-02 | Generar tabla de amortización | Alta | ✅ |
| RF-03 | Visualizar gráficos interactivos | Media | ✅ |
| RF-04 | Exportar tabla a CSV | Media | ✅ |
| RF-05 | Imprimir tabla/recibos | Media | ✅ |
| RF-06 | Registrar pagos | Alta | ✅ |
| RF-07 | Calcular mora automática | Alta | ✅ |
| RF-08 | Simular pagos anticipados | Media | ✅ |
| RF-09 | Comparar escenarios | Media | ✅ |
| RF-10 | Guardar préstamos | Alta | ✅ |

### Requisitos No Funcionales
| ID | Requisito | Métrica | Estado |
|----|-----------|---------|--------|
| RNF-01 | Rendimiento | < 2s carga inicial | ✅ |
| RNF-02 | Responsive | Mobile + Desktop | ✅ |
| RNF-03 | Usabilidad | < 3 clicks para calcular | ✅ |
| RNF-04 | Precisión | 2 decimales exactos | ✅ |
| RNF-05 | Persistencia | localStorage | ✅ |
| RNF-06 | Accesibilidad | Contraste WCAG AA | ✅ |

---

## 8. Metodología

### Enfoque
**Desarrollo Iterativo e Incremental** con entregas por funcionalidad.

### Convenciones de Código
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- **Componentes**: Un archivo por componente, PascalCase
- **Tipos**: Centralizados en `types.ts`
- **Estilos**: Tailwind utility-first
- **Estado**: React hooks (useState, useEffect)

### Control de Versiones
```
main ← releases estables
  └── feature/* ← nuevas funcionalidades
  └── fix/* ← correcciones
```

### Criterios de Aceptación
Cada módulo debe cumplir:
1. ✅ Funcionalidad completa según especificación
2. ✅ Responsive en mobile y desktop
3. ✅ Manejo de estados vacíos/error
4. ✅ Código tipado con TypeScript
5. ✅ Sin errores de compilación

---

## 9. Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Pérdida de datos (localStorage) | Media | Alto | Implementar backup/export |
| Errores de cálculo | Baja | Crítico | Validación con casos de prueba |
| Incompatibilidad navegador | Baja | Medio | Testing cross-browser |
| Cambios en requisitos | Media | Medio | Arquitectura modular |
| Limitación localStorage (5MB) | Baja | Bajo | Paginación de historial |

---

## 10. Criterios de Éxito

### Métricas Cuantitativas
- [x] 12 commits específicos aplicados
- [x] 8 módulos funcionales
- [x] 0 errores de compilación
- [x] 100% responsive
- [x] < 2 segundos de carga

### Métricas Cualitativas
- [x] Interfaz intuitiva
- [x] Cálculos precisos
- [x] Visualización clara
- [x] Documentación completa
- [x] Código mantenible

---

## 11. Entregables

| # | Entregable | Formato | Estado |
|---|-----------|---------|--------|
| 1 | Aplicación web funcional | React SPA | ✅ |
| 2 | Código fuente | TypeScript | ✅ |
| 3 | Documento de planificación | Markdown | ✅ |
| 4 | Script de commits | Shell | ✅ |
| 5 | Timeline visual de commits | Componente React | ✅ |
| 6 | Este documento | Markdown | ✅ |

---

## 12. Próximas Fases

### Fase 4: Backend (Futuro)
- [ ] API REST con Node.js/Express
- [ ] Base de datos PostgreSQL
- [ ] Autenticación JWT
- [ ] Endpoints para CRUD de préstamos

### Fase 5: Funcionalidades Avanzadas
- [ ] Gestión de clientes (CRUD)
- [ ] Reportes PDF profesionales
- [ ] Notificaciones por email/SMS
- [ ] Dashboard administrativo
- [ ] Integración con pasarelas de pago
- [ ] App móvil (React Native)

### Fase 6: Optimización
- [ ] Code splitting / lazy loading
- [ ] PWA (Progressive Web App)
- [ ] Tests unitarios (Jest + RTL)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD pipeline

---

## 📝 Notas

- **Moneda**: Bolivianos (Bs.)
- **Método de amortización**: Francés (cuota fija)
- **Almacenamiento**: localStorage (client-side)
- **Licencia**: Uso interno / educativo

---

*Documento generado el: {fecha_actual}*
*Versión del proyecto: 2.0*
*Estado: En desarrollo activo*
