# 🚀 Guía de Implementación - Completar Backend y Pasarelas de Pago

## 📋 Estado Actual

**Proyecto:** Sistema de Préstamos v3.1  
**Estado:** 90% Completado  
**Backend:** Estructura base creada (30%)  
**Pasarelas:** Estructura base creada (20%)

---

## 🎯 Qué Falta por Implementar

### 1. Backend Node.js - Completar (30% → 100%)

#### ✅ Ya Creado
- ✅ Estructura de proyecto
- ✅ Configuración TypeScript
- ✅ Schema de base de datos (Prisma)
- ✅ Middleware de autenticación
- ✅ Middleware de errores
- ✅ Controlador de autenticación
- ✅ Validadores con Zod
- ✅ Rutas de autenticación
- ✅ Servidor Express base
- ✅ Variables de entorno

#### ⏳ Falta Implementar

**Controladores:**
```bash
# Crear estos archivos:
backend/src/controllers/
├── loan.controller.ts
├── payment.controller.ts
├── guarantor.controller.ts
└── brand.controller.ts
```

**Servicios:**
```bash
# Crear estos archivos:
backend/src/services/
├── loan.service.ts
├── payment.service.ts
├── guarantor.service.ts
├── brand.service.ts
├── stripe.service.ts ✅ (ya creado)
└── paypal.service.ts ✅ (ya creado)
```

**Rutas:**
```bash
# Crear estos archivos:
backend/src/routes/
├── loan.routes.ts
├── payment.routes.ts
├── guarantor.routes.ts
├── brand.routes.ts
├── stripe.routes.ts
└── paypal.routes.ts
```

**Pasos para Completar:**

1. **Instalar dependencias del backend:**
```bash
cd backend
npm install
```

2. **Configurar base de datos:**
```bash
# Crear base de datos PostgreSQL
createdb prestamos_db

# Configurar .env
cp .env.example .env
# Editar .env con tus credenciales

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init
```

3. **Implementar controladores:**
```typescript
// Ejemplo: loan.controller.ts
import { Request, Response } from 'express';
import prisma from '../config/database';
import { loanSchema } from '../utils/validators';

export const createLoan = async (req: any, res: Response) => {
  try {
    const validatedData = loanSchema.parse(req.body);
    
    const loan = await prisma.loan.create({
      data: {
        ...validatedData,
        userId: req.userId,
        startDate: new Date(validatedData.startDate),
      },
      include: {
        installments: true,
      },
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create loan' });
  }
};

export const getLoans = async (req: any, res: Response) => {
  try {
    const loans = await prisma.loan.findMany({
      where: { userId: req.userId },
      include: {
        installments: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get loans' });
  }
};

// ... implementar updateLoan, deleteLoan, etc.
```

4. **Implementar rutas:**
```typescript
// Ejemplo: loan.routes.ts
import { Router } from 'express';
import { createLoan, getLoans, getLoan, updateLoan, deleteLoan } from '../controllers/loan.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createLoan);
router.get('/', getLoans);
router.get('/:id', getLoan);
router.put('/:id', updateLoan);
router.delete('/:id', deleteLoan);

export default router;
```

5. **Integrar en index.ts:**
```typescript
// Agregar en backend/src/index.ts
import loanRoutes from './routes/loan.routes';
import paymentRoutes from './routes/payment.routes';
import guarantorRoutes from './routes/guarantor.routes';
import brandRoutes from './routes/brand.routes';

app.use('/api/loans', loanRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/guarantors', guarantorRoutes);
app.use('/api/brand', brandRoutes);
```

6. **Probar el backend:**
```bash
npm run dev
# El servidor debería correr en http://localhost:3001
```

---

### 2. Pasarelas de Pago - Completar (20% → 100%)

#### ✅ Ya Creado
- ✅ Servicio de Stripe
- ✅ Servicio de PayPal
- ✅ Estructura base

#### ⏳ Falta Implementar

**Controladores:**
```bash
# Crear estos archivos:
backend/src/controllers/
├── stripe.controller.ts
└── paypal.controller.ts
```

**Rutas:**
```bash
# Crear estos archivos:
backend/src/routes/
├── stripe.routes.ts
└── paypal.routes.ts
```

**Pasos para Completar:**

1. **Instalar dependencias de pasarelas:**
```bash
cd backend
npm install stripe @paypal/checkout-server-sdk
```

2. **Implementar controlador de Stripe:**
```typescript
// backend/src/controllers/stripe.controller.ts
import { Request, Response } from 'express';
import { createPaymentIntent, confirmPayment, handleWebhook } from '../services/stripe.service';

export const createPayment = async (req: Request, res: Response) => {
  return createPaymentIntent(req, res);
};

export const confirmPaymentController = async (req: Request, res: Response) => {
  return confirmPayment(req, res);
};

export const webhookHandler = async (req: Request, res: Response) => {
  return handleWebhook(req, res);
};
```

3. **Implementar rutas de Stripe:**
```typescript
// backend/src/routes/stripe.routes.ts
import { Router } from 'express';
import { createPayment, confirmPaymentController, webhookHandler } from '../controllers/stripe.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/create-payment-intent', authMiddleware, createPayment);
router.post('/confirm-payment', authMiddleware, confirmPaymentController);
router.post('/webhook', webhookHandler); // Sin auth middleware

export default router;
```

4. **Implementar controlador de PayPal:**
```typescript
// backend/src/controllers/paypal.controller.ts
import { Request, Response } from 'express';
import { createOrder, captureOrder, handleWebhook } from '../services/paypal.service';

export const createOrderController = async (req: Request, res: Response) => {
  return createOrder(req, res);
};

export const captureOrderController = async (req: Request, res: Response) => {
  return captureOrder(req, res);
};

export const webhookHandler = async (req: Request, res: Response) => {
  return handleWebhook(req, res);
};
```

5. **Implementar rutas de PayPal:**
```typescript
// backend/src/routes/paypal.routes.ts
import { Router } from 'express';
import { createOrderController, captureOrderController, webhookHandler } from '../controllers/paypal.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/create-order', authMiddleware, createOrderController);
router.post('/capture-order', authMiddleware, captureOrderController);
router.post('/webhook', webhookHandler); // Sin auth middleware

export default router;
```

6. **Integrar en index.ts:**
```typescript
// Agregar en backend/src/index.ts
import stripeRoutes from './routes/stripe.routes';
import paypalRoutes from './routes/paypal.routes';

app.use('/api/payments/stripe', stripeRoutes);
app.use('/api/payments/paypal', paypalRoutes);
```

7. **Configurar webhooks:**
```bash
# Para Stripe (usando Stripe CLI)
stripe listen --forward-to localhost:3001/api/payments/stripe/webhook

# Para PayPal
# Configurar webhook URL en dashboard de PayPal
# URL: https://tu-dominio.com/api/payments/paypal/webhook
```

8. **Probar pasarelas:**
```bash
# Stripe
# Usar tarjetas de prueba: 4242 4242 4242 4242

# PayPal
# Usar cuentas sandbox de PayPal
```

---

### 3. Integración Frontend con Backend

#### Pasos para Conectar Frontend con Backend

1. **Crear API client en frontend:**
```typescript
// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

2. **Actualizar AuthContext para usar API:**
```typescript
// frontend/src/contexts/AuthContext.tsx
import api from '../services/api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const { user, token } = response.data;
  localStorage.setItem('token', token);
  setUser(user);
  return user;
};
```

3. **Actualizar componentes para usar API:**
```typescript
// Ejemplo: LoanCalculator.tsx
import api from '../services/api';

const handleSaveLoan = async (name: string, clientName: string) => {
  try {
    const response = await api.post('/loans', {
      name,
      clientName,
      amount: loanParams.amount,
      monthlyRate: loanParams.monthlyRate,
      term: loanParams.term,
      startDate: loanParams.startDate,
    });
    
    const newLoan = response.data;
    setSavedLoans([...savedLoans, newLoan]);
  } catch (error) {
    console.error('Error saving loan:', error);
  }
};
```

4. **Migrar de localStorage a API:**
```typescript
// Antes (localStorage)
const savedLoans = JSON.parse(localStorage.getItem('savedLoans') || '[]');

// Después (API)
const [savedLoans, setSavedLoans] = useState([]);

useEffect(() => {
  const fetchLoans = async () => {
    const response = await api.get('/loans');
    setSavedLoans(response.data);
  };
  fetchLoans();
}, []);
```

---

## 📝 Checklist de Implementación

### Backend (30% → 100%)
- [ ] Instalar dependencias del backend
- [ ] Configurar base de datos PostgreSQL
- [ ] Ejecutar migraciones de Prisma
- [ ] Implementar loan.controller.ts
- [ ] Implementar payment.controller.ts
- [ ] Implementar guarantor.controller.ts
- [ ] Implementar brand.controller.ts
- [ ] Implementar loan.service.ts
- [ ] Implementar payment.service.ts
- [ ] Implementar guarantor.service.ts
- [ ] Implementar brand.service.ts
- [ ] Implementar loan.routes.ts
- [ ] Implementar payment.routes.ts
- [ ] Implementar guarantor.routes.ts
- [ ] Implementar brand.routes.ts
- [ ] Integrar rutas en index.ts
- [ ] Probar endpoints con Postman
- [ ] Escribir tests de backend
- [ ] Documentar API con Swagger

### Pasarelas de Pago (20% → 100%)
- [ ] Instalar dependencias de Stripe y PayPal
- [ ] Configurar cuentas de Stripe y PayPal
- [ ] Implementar stripe.controller.ts
- [ ] Implementar paypal.controller.ts
- [ ] Implementar stripe.routes.ts
- [ ] Implementar paypal.routes.ts
- [ ] Configurar webhooks de Stripe
- [ ] Configurar webhooks de PayPal
- [ ] Probar pagos con tarjetas de prueba
- [ ] Implementar UI de pagos en frontend
- [ ] Integrar con frontend

### Integración Frontend-Backend
- [ ] Crear API client en frontend
- [ ] Actualizar AuthContext para usar API
- [ ] Actualizar componentes para usar API
- [ ] Migrar de localStorage a API
- [ ] Probar integración completa
- [ ] Tests de integración

---

## 🚀 Comandos Rápidos

### Backend
```bash
# Instalar dependencias
cd backend && npm install

# Configurar base de datos
cp .env.example .env
# Editar .env con tus credenciales

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Iniciar servidor
npm run dev
```

### Frontend
```bash
# Instalar dependencias (si faltan)
npm install

# Configurar variable de entorno
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Iniciar frontend
npm run dev
```

### Tests
```bash
# Tests del frontend
npm test

# Tests del backend (cuando se implementen)
cd backend && npm test
```

---

## 📊 Estado Final Esperado

Después de completar la implementación:

```
┌─────────────────────────────────────────────┐
│  SISTEMA DE PRÉSTAMOS v4.0                  │
├─────────────────────────────────────────────┤
│  ✅ 100% Completado                         │
│  ✅ Backend completo                        │
│  ✅ Pasarelas de pago integradas            │
│  ✅ Frontend conectado a API                │
│  ✅ Base de datos PostgreSQL                │
│  ✅ 50+ tests                               │
│  ✅ Documentación API completa              │
│  🎯 Estado: PRODUCCIÓN ENTERPRISE           │
└─────────────────────────────────────────────┘
```

---

## 💡 Recomendaciones

### Para Implementación Rápida (2-3 días)
1. Completar controladores y rutas del backend
2. Integrar frontend con backend
3. Probar funcionalidades básicas
4. Deploy a producción

### Para Implementación Completa (1-2 semanas)
1. Todo lo anterior
2. Implementar pasarelas de pago completas
3. Escribir tests completos
4. Documentar API con Swagger
5. Configurar CI/CD
6. Deploy con Docker

### Para Producción Enterprise (1 mes)
1. Todo lo anterior
2. Multi-tenant
3. API pública
4. App móvil
5. Monitoreo y logging
6. Backup automático
7. Escalabilidad horizontal

---

**Última actualización:** Enero 2026  
**Versión:** 3.1  
**Estado:** 90% Completado  
**Próximo paso:** Completar Backend
