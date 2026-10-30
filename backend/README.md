# 🖥️ Backend - Sistema de Préstamos

API REST completa para el Sistema de Gestión de Préstamos.

## 🚀 Características

- ✅ **Node.js + Express** con TypeScript
- ✅ **PostgreSQL** con Prisma ORM
- ✅ **Autenticación JWT** completa
- ✅ **Validación** con Zod
- ✅ **Seguridad** con Helmet
- ✅ **CORS** configurado
- ✅ **Logging** con Morgan
- ✅ **Stripe** integrado
- ✅ **PayPal** integrado

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Iniciar servidor
npm run dev
```

## 🔧 Configuración

### Variables de Entorno (.env)

```env
NODE_ENV=development
PORT=3001

# Base de Datos
DATABASE_URL="postgresql://user:password@localhost:5432/prestamos_db?schema=public"

# JWT
JWT_SECRET="tu_secreto_jwt_super_seguro_cambiar_en_produccion"
JWT_EXPIRES_IN="7d"

# CORS
FRONTEND_URL="http://localhost:5173"

# Stripe (opcional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal (opcional)
PAYPAL_CLIENT_ID="tu_client_id"
PAYPAL_CLIENT_SECRET="tu_client_secret"
PAYPAL_MODE="sandbox"
```

## 📚 Endpoints de la API

### Autenticación
```
POST   /api/auth/register     - Registrar usuario
POST   /api/auth/login        - Iniciar sesión
GET    /api/auth/me           - Obtener usuario actual
```

### Préstamos
```
GET    /api/loans             - Listar préstamos
GET    /api/loans/:id         - Obtener préstamo
POST   /api/loans             - Crear préstamo
PUT    /api/loans/:id         - Actualizar préstamo
DELETE /api/loans/:id         - Eliminar préstamo
POST   /api/loans/:id/duplicate - Duplicar préstamo
```

### Pagos
```
GET    /api/payments          - Listar pagos
GET    /api/payments/:id      - Obtener pago
POST   /api/payments          - Registrar pago
DELETE /api/payments/:id      - Eliminar pago
```

### Garantes
```
GET    /api/guarantors        - Listar garantes
GET    /api/guarantors/:id    - Obtener garante
POST   /api/guarantors        - Crear garante
PUT    /api/guarantors/:id    - Actualizar garante
DELETE /api/guarantors/:id    - Eliminar garante
```

### Configuración de Marca
```
GET    /api/brand             - Obtener configuración
PUT    /api/brand             - Actualizar configuración
DELETE /api/brand             - Eliminar configuración
```

### Stripe (Pasarela de Pago)
```
POST   /api/payments/stripe/create-payment-intent - Crear Payment Intent
POST   /api/payments/stripe/confirm-payment       - Confirmar pago
POST   /api/payments/stripe/webhook               - Webhook de Stripe
GET    /api/payments/stripe/transactions          - Listar transacciones
```

### PayPal (Pasarela de Pago)
```
POST   /api/payments/paypal/create-order          - Crear orden
POST   /api/payments/paypal/capture-order         - Capturar orden
POST   /api/payments/paypal/webhook               - Webhook de PayPal
GET    /api/payments/paypal/transactions          - Listar transacciones
```

### Salud
```
GET    /health                - Health check
```

## 🔐 Autenticación

Todos los endpoints (excepto `/auth/register`, `/auth/login` y webhooks) requieren autenticación JWT.

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Obtener token:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## 🗄️ Base de Datos

### Schema de Prisma

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  name          String
  role          String    @default("viewer")
  loans         Loan[]
  payments      Payment[]
  guarantors    Guarantor[]
  brandConfig   BrandConfig?
}

model Loan {
  id            String    @id @default(uuid())
  userId        String
  name          String
  clientName    String
  amount        Decimal
  monthlyRate   Decimal
  term          Int
  startDate     DateTime
  status        String    @default("active")
  notes         String?
  installments  Installment[]
  payments      Payment[]
}

model Installment {
  id                    String    @id @default(uuid())
  loanId                String
  number                Int
  initialBalance        Decimal
  payment               Decimal
  interest              Decimal
  capital               Decimal
  finalBalance          Decimal
  paymentDate           DateTime
  isPaid                Boolean   @default(false)
  paidDate              DateTime?
  paidAmount            Decimal?
  extraPayment          Decimal   @default(0)
  roundedPayment        Decimal?
  roundingDifference    Decimal?
}

model Payment {
  id              String    @id @default(uuid())
  loanId          String
  installmentId   String?
  userId          String
  amount          Decimal
  paidDate        DateTime
  notes           String?
}

model Guarantor {
  id                    String    @id @default(uuid())
  userId                String
  name                  String
  ci                    String
  phone                 String?
  email                 String?
  income                Decimal
  existingGuarantees    Int       @default(0)
}

model BrandConfig {
  id              String    @id @default(uuid())
  userId          String    @unique
  appName         String
  tagline         String?
  primaryColor    String
  secondaryColor  String
  logoUrl         String?
  contactEmail    String?
  contactPhone    String?
  company         String?
}
```

## 🧪 Tests

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm test -- --watch

# Cobertura de tests
npm test -- --coverage
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Iniciar servidor en modo desarrollo
npm run build        # Compilar TypeScript
npm start            # Iniciar servidor en producción
npm test             # Ejecutar tests
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio
```

## 🚀 Deploy

### Usando Docker

```bash
# Construir imagen
docker build -t prestamos-backend .

# Ejecutar contenedor
docker run -p 3001:3001 --env-file .env prestamos-backend
```

### Usando PM2

```bash
# Compilar
npm run build

# Iniciar con PM2
pm2 start dist/index.js --name prestamos-backend

# Guardar configuración
pm2 save
```

## 🔒 Seguridad

- ✅ **Helmet** - Headers de seguridad
- ✅ **CORS** - Cross-Origin Resource Sharing
- ✅ **JWT** - Autenticación segura
- ✅ **Bcrypt** - Hash de contraseñas
- ✅ **Zod** - Validación de datos
- ✅ **Rate Limiting** - Protección contra ataques

## 📊 Monitoreo

- **Health Check:** `GET /health`
- **Logs:** Morgan en modo desarrollo
- **Errores:** Middleware de errores centralizado

## 🛠️ Tecnologías

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT
- **Validación:** Zod
- **Pagos:** Stripe, PayPal

## 📝 Notas

- El backend está diseñado para ser escalable
- Todas las operaciones son transaccionales
- Los datos sensibles están encriptados
- La API sigue las mejores prácticas REST
- Documentación completa con ejemplos

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

MIT

---

**Versión:** 1.0.0  
**Estado:** Producción ✅  
**Última actualización:** Enero 2026
