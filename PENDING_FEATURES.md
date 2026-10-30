# 📋 Mejoras Pendientes - Sesión Mañana
# Sistema de Préstamos v3.0 → v3.1

---

## 🎯 Resumen Rápido

**Estado actual**: v3.0 completada (60% del total)  
**Objetivo mañana**: Implementar 8 mejoras restantes  
**Tiempo estimado**: 4-6 horas  
**Prioridad**: Alta → Media → Baja

---

## ⏳ Mejoras Pendientes (8)

### 🔴 PRIORIDAD ALTA (Implementar primero)

#### 1. Tour Interactivo
**Archivo**: `src/components/InteractiveTour.tsx`  
**Librería**: `react-joyride`  
**Tiempo estimado**: 30 min

**Qué hace**:
- Guía paso a paso para nuevos usuarios
- Tooltips explicativos en cada sección
- Se muestra solo la primera vez
- Botón "Ver tour nuevamente" en configuración

**Pasos del tour**:
1. Bienvenida y resumen del sistema
2. Calculadora de préstamos
3. Dashboard y métricas
4. Tabla de amortización (filtros, redondeo)
5. Registro de pagos
6. Historial y gestión
7. Importación Excel
8. Notificaciones y alertas

**Instalación**:
```bash
npm install react-joyride
```

**Implementación**:
```tsx
import Joyride from 'react-joyride';

const steps = [
  { target: '.calculator-tab', content: 'Aquí calculas tu préstamo' },
  { target: '.dashboard-tab', content: 'Visualiza métricas clave' },
  // ... más pasos
];

<Joyride steps={steps} run={showTour} />
```

---

#### 2. Sistema de Garantes
**Archivo**: `src/components/GuarantorSystem.tsx`  
**Tiempo estimado**: 45 min

**Qué hace**:
- Agregar garantes a préstamos
- Validar capacidad de pago del garante
- Historial de garantes
- Notificación al garante

**Estructura de datos**:
```typescript
interface Guarantor {
  id: string;
  name: string;
  ci: string;
  phone: string;
  email: string;
  income: number;
  existingGuarantees: number;
  loans: string[]; // IDs de préstamos garantizados
}
```

**Funcionalidades**:
- CRUD de garantes
- Validar que no exceda capacidad (ingreso - garantías existentes)
- Asociar garante a préstamo
- Reporte de garantías activas

---

#### 3. Cálculo de Penalidades
**Archivo**: `src/components/PenaltyCalculator.tsx`  
**Tiempo estimado**: 30 min

**Qué hace**:
- Calcula interés moratorio automáticamente
- Configurable por préstamo
- Historial de penalidades
- Integración con tabla de amortización

**Fórmula**:
```
Penalización = Saldo_vencido × (Tasa_mora / 30) × Días_atraso
```

**Funcionalidades**:
- Configurar tasa de mora por préstamo
- Calcular días de atraso automáticamente
- Mostrar penalización en tabla
- Exportar reporte de penalidades

---

### 🟡 PRIORIDAD MEDIA

#### 4. Backend Node.js + Express + PostgreSQL
**Carpeta**: `backend/`  
**Tiempo estimado**: 2-3 horas

**Qué hace**:
- API REST para persistencia real
- Base de datos PostgreSQL
- Autenticación JWT real
- Migración desde localStorage

**Estructura**:
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Loan.ts
│   │   └── Payment.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── loans.ts
│   │   └── payments.ts
│   ├── controllers/
│   └── index.ts
├── package.json
└── .env
```

**Endpoints principales**:
```
POST   /api/auth/login
GET    /api/loans
POST   /api/loans
PUT    /api/loans/:id
DELETE /api/loans/:id
GET    /api/payments/:loanId
POST   /api/payments
```

**Instalación**:
```bash
npm install express pg bcrypt jsonwebtoken cors dotenv
npm install -D @types/express @types/pg @types/bcrypt @types/jsonwebtoken
```

---

#### 5. Tests Automatizados
**Carpeta**: `src/__tests__/`  
**Librerías**: `jest`, `@testing-library/react`  
**Tiempo estimado**: 1 hora

**Qué hace**:
- Tests unitarios para funciones de cálculo
- Tests de componentes principales
- Coverage > 80%

**Archivos de test**:
```
src/__tests__/
├── calculateAmortization.test.ts
├── LoanCalculator.test.tsx
├── AmortizationTable.test.tsx
└── PaymentRegister.test.tsx
```

**Instalación**:
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom @types/jest
```

**Ejemplo**:
```typescript
test('calcula cuota correctamente', () => {
  const result = calculateAmortization({
    amount: 1000,
    monthlyRate: 10,
    term: 12,
    startDate: '2024-01-01'
  });
  expect(result.monthlyPayment).toBeCloseTo(146.76, 2);
});
```

---

#### 6. Optimización de Performance
**Tiempo estimado**: 30 min

**Qué hace**:
- Code splitting por ruta
- Lazy loading de componentes
- Memoización de cálculos
- Optimización de imágenes

**Implementación**:
```tsx
// Lazy loading
const FinancialDashboard = lazy(() => import('./components/FinancialDashboard'));
const ExcelImport = lazy(() => import('./components/ExcelImport'));

// Suspense
<Suspense fallback={<Loading />}>
  <FinancialDashboard />
</Suspense>
```

**Configuración Vite**:
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        charts: ['recharts'],
        export: ['jspdf', 'xlsx', 'docx']
      }
    }
  }
}
```

---

### 🟢 PRIORIDAD BAJA

#### 7. Integración con Pasarelas de Pago
**Archivo**: `src/components/PaymentGateway.tsx`  
**Librerías**: `@stripe/stripe-js`, `@paypal/react-paypal-js`  
**Tiempo estimado**: 1 hora

**Qué hace**:
- Pago online de cuotas
- Confirmación automática
- Historial de transacciones

**Nota**: Requiere cuentas de Stripe/PayPal y backend para procesar pagos.

---

#### 8. White Label
**Archivo**: `src/components/WhiteLabelConfig.tsx`  
**Tiempo estimado**: 45 min

**Qué hace**:
- Personalización de marca (logo, colores)
- Configuración guardada en localStorage
- Exportar/importar configuración

**Configuración**:
```typescript
interface BrandConfig {
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
}
```

---

## 📅 Plan de Trabajo para Mañana

### Sesión 1: Prioridad Alta (2 horas)
1. ✅ Tour interactivo (30 min)
2. ✅ Sistema de garantes (45 min)
3. ✅ Cálculo de penalidades (30 min)
4. ✅ Testing manual (15 min)

### Sesión 2: Prioridad Media (2-3 horas)
5. ✅ Backend básico (2 horas)
6. ✅ Tests unitarios (1 hora)
7. ✅ Optimización performance (30 min)

### Sesión 3: Prioridad Baja (1-2 horas)
8. ✅ Pasarelas de pago (1 hora)
9. ✅ White label (45 min)
10. ✅ Documentación final (30 min)

---

## 🚀 Comandos para Retomar

```bash
# 1. Instalar nuevas dependencias
npm install react-joyride
npm install -D jest @testing-library/react @testing-library/jest-dom @types/jest

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Después de implementar, actualizar commits
# Editar COMMITS.md con los nuevos commits
# Editar apply-commits.sh con los nuevos commits
# Editar CommitTimeline.tsx con los nuevos commits

# 4. Build final
npm run build
```

---

## 📊 Checklist de Implementación

### Tour Interactivo
- [ ] Instalar react-joyride
- [ ] Crear componente InteractiveTour.tsx
- [ ] Definir pasos del tour
- [ ] Integrar en App.tsx
- [ ] Agregar botón "Ver tour"
- [ ] Testear

### Sistema de Garantes
- [ ] Crear interfaz Guarantor en types.ts
- [ ] Crear componente GuarantorSystem.tsx
- [ ] Implementar CRUD
- [ ] Validar capacidad de pago
- [ ] Asociar a préstamos
- [ ] Testear

### Cálculo de Penalidades
- [ ] Crear componente PenaltyCalculator.tsx
- [ ] Implementar fórmula de mora
- [ ] Integrar con tabla de amortización
- [ ] Mostrar en UI
- [ ] Testear

### Backend (si hay tiempo)
- [ ] Crear carpeta backend/
- [ ] Configurar Express + PostgreSQL
- [ ] Crear modelos
- [ ] Crear endpoints
- [ ] Migrar localStorage a API
- [ ] Testear

---

## 💡 Notas Importantes

1. **Orden de implementación**: Seguir prioridad Alta → Media → Baja
2. **Testing**: Probar cada funcionalidad antes de pasar a la siguiente
3. **Commits**: Hacer commit después de cada funcionalidad completada
4. **Documentación**: Actualizar PROJECT_PLAN.md y COMMITS.md al final
5. **Backup**: Hacer backup antes de cambios grandes (backend)

---

## 🎯 Criterios de Éxito para Mañana

- [ ] 8 mejoras implementadas
- [ ] 0 errores de compilación
- [ ] Todas las funcionalidades probadas
- [ ] Documentación actualizada
- [ ] Commits organizados
- [ ] Proyecto en v3.1 (100% completado)

---

*Preparado para sesión de mañana*  
*Última actualización: Hoy*  
*Versión actual: v3.0 (60%)*  
*Versión objetivo: v3.1 (100%)*
