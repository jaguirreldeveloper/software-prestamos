# 🏦 Sistema de Gestión de Préstamos v3.0

Sistema web completo para la gestión de préstamos personales y comerciales basado en el método de amortización francesa.

![Versión](https://img.shields.io/badge/versión-3.0-blue)
![Estado](https://img.shields.io/badge/estado-60%25_completado-yellow)
![Commits](https://img.shields.io/badge/commits-36-orange)
![Módulos](https://img.shields.io/badge/módulos-20-purple)
![PWA](https://img.shields.io/badge/PWA-ready-green)

---

## 📑 Tabla de Contenidos

- [Características](#-características)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Módulos](#-módulos)
- [Documentación](#-documentación)
- [Commits](#-commits)
- [Arquitectura](#-arquitectura)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)

---

## ✨ Características

### 🧮 Calculadora de Préstamos
- Cálculo preciso con fórmula de amortización francesa
- Sliders interactivos para ajuste rápido
- Plantillas predefinidas para escenarios comunes
- Sistema de redondeo inteligente al entero superior
- Resultados en tiempo real

### 📊 Dashboard Visual
- Gráfico de torta (composición capital/interés)
- Gráfico de área (evolución del saldo)
- Gráfico de barras (capital/interés por cuota)
- KPIs clave: cuota, tasa efectiva anual, métricas financieras

### 📋 Tabla de Amortización Mejorada
- **Filtros avanzados**: Por rango de fechas y montos
- **Gráfico de evolución**: Integrado en la tabla
- **Sparkline charts**: Mini gráficos de tendencia inline
- **Tooltips informativos**: Al pasar el mouse
- **Agrupación temporal**: Mensual, trimestral, anual
- **Sistema de redondeo**: Cuota redondeada + diferencia acumulada
- **Alertas de vencimiento**: Notificaciones visuales
- **Exportación**: Excel, Word, PDF
- **Impresión optimizada**: Estilos profesionales

### 📅 Calendario de Pagos
- Timeline visual con estados (pagado/próximo/pendiente/vencido)
- Cálculo automático de mora configurable
- Barras de progreso por cuota
- Alertas de pagos vencidos

### 💳 Registro de Pagos
- Registro de pagos normales y extras
- Comprobantes imprimibles profesionales
- Historial de pagos con notas
- Barra de progreso del préstamo

### ⚡ Simulador de Pagos Anticipados
- Simulación con diferentes frecuencias (mensual/alterno/único)
- Cálculo de ahorro en intereses
- Reducción de meses del préstamo
- Gráfico comparativo visual

### ⚖️ Comparador de Tasas
- Hasta 5 escenarios simultáneos
- Identificación automática de la mejor opción
- Tabla comparativa detallada
- Gráficos de cuotas e intereses

### 📂 Historial de Préstamos
- **Búsqueda** por nombre o cliente
- **Filtros** por estado (activo/completado/cancelado)
- **Edición** completa con recálculo automático
- **Duplicación** para probar variaciones
- **Exportación** JSON para backup
- **Estados** del préstamo
- **Notas** y observaciones
- **Barra de progreso** visual
- **Confirmación** antes de eliminar

### 📊 Dashboard de Métricas Financieras
- KPIs principales: Cartera total, recuperado, pendiente, intereses
- Gráfico de distribución de préstamos
- Evolución mensual de cobros
- Distribución de tasas de interés
- Métricas promedio del portafolio

### 🔍 Búsqueda Global
- Atajo de teclado: `Ctrl+K` o `Cmd+K`
- Búsqueda por nombre, cliente, monto o ID
- Navegación con flechas ↑↓
- Selección con Enter
- Resultados en tiempo real

### 📥 Importación Masiva Excel
- Carga de archivos Excel/CSV
- Validación automática de datos
- Plantilla descargable
- Vista previa antes de importar
- Manejo de errores por fila

### 📄 Generador de Contratos PDF
- Documento PDF con formato profesional
- Resumen del préstamo
- Cláusulas legales
- Espacios para firmas
- Descarga directa

### 🔔 Sistema de Notificaciones
- Alertas de cuotas próximas a vencer
- Notificaciones de cuotas vencidas
- Configuración de días de anticipación
- Panel de notificaciones con contador
- Badge visual en el header

### 📱 Progressive Web App (PWA)
- Instalable en dispositivos móviles
- Funcionamiento offline
- Service Worker para caché
- Manifiesto de instalación
- Íconos personalizados

### 👥 Multi-usuario con Roles
- 4 roles: Admin, Gerente, Operador, Viewer
- Sistema de permisos por rol
- Login con credenciales
- Sesión persistente
- Credenciales de demostración

### 📊 Reportes Mensuales
- Selección de mes/año
- Métricas de cobranza
- Detalle de pagos del período
- Exportación a PDF profesional
- Tasa de recuperación

### 🔄 Renegociación de Préstamos
- Ajuste de plazo y tasa
- Cálculo de nueva cuota
- Comparación antes/después
- Confirmación de cambios
- Recálculo automático

### 🎨 Modo Oscuro/Claro
- Toggle en el header
- Preferencia guardada en localStorage
- Estilos completos para ambos modos
- Transiciones suaves

### 🔀 Timeline de Commits
- Visualización interactiva de commits
- Copiar comandos al portapapeles
- Marcar commits como aplicados
- Descargar script automatizado

### 📋 Plan del Proyecto
- Visualización interactiva del plan
- 6 secciones navegables
- Barras de progreso y métricas
- Matriz de riesgos
- Roadmap futuro

---

## 📊 Estado del Proyecto

```
┌─────────────────────────────────────────────┐
│  SISTEMA DE PRÉSTAMOS v3.0                  │
├─────────────────────────────────────────────┤
│  ✅ 20/20 Módulos completados               │
│  ✅ 36/36 Commits aplicados                 │
│  ✅ 29/37 Requisitos funcionales            │
│  ✅ 8/10 Requisitos no funcionales          │
│  ✅ 8/8 Fases completadas                   │
│  ⏳ 8/8 Mejoras pendientes                  │
│  📊 Avance: 60%                             │
│  🎯 Estado: EN DESARROLLO                   │
└─────────────────────────────────────────────┘
```

### ✅ Completado (60%)
- 20 componentes funcionales
- 36 commits organizados en 8 fases
- 29 de 37 requisitos funcionales
- PWA instalable
- Multi-usuario con roles
- Sistema de notificaciones
- Importación masiva
- Reportes mensuales
- Renegociación de préstamos

### ⏳ Pendiente (40%)
Ver [PENDING_FEATURES.md](./PENDING_FEATURES.md) para detalles completos.

1. Tour interactivo
2. Sistema de garantes
3. Cálculo de penalidades
4. Backend Node.js + PostgreSQL
5. Tests automatizados
6. Optimización de performance
7. Integración con pasarelas de pago
8. White label

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18 | Framework UI |
| TypeScript | 5.x | Tipado estático |
| Vite | 6.x | Build tool |
| Tailwind CSS | 4.x | Estilos utility-first |
| Recharts | 2.x | Gráficos interactivos |
| Lucide React | 0.x | Iconos |
| jsPDF | 2.x | Generación de PDF |
| xlsx | 0.x | Importación Excel |
| docx | 7.x | Generación de Word |
| react-hotkeys-hook | 4.x | Atajos de teclado |

---

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd sistema-prestamos

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

### Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

---

## 🚀 Uso

### Navegación

El sistema tiene 14 pestañas principales:

1. **🧮 Calculadora** - Calcular préstamos y guardar
2. **📊 Dashboard** - Visualización gráfica
3. **📈 Métricas** - Dashboard financiero
4. **📊 Reportes** - Reportes mensuales
5. **📋 Tabla** - Tabla de amortización detallada
6. **📅 Calendario** - Timeline de pagos con mora
7. **💳 Pagos** - Registro de pagos
8. **⚡ Pago Anticipado** - Simulador
9. **🔄 Renegociar** - Renegociación de préstamos
10. **⚖️ Comparador** - Comparar tasas/plazos
11. **📂 Historial** - Gestión de préstamos
12. **📥 Importar** - Importación masiva Excel
13. **🔀 Commits** - Timeline de commits
14. **📋 Plan** - Plan del proyecto

### Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+K` / `Cmd+K` | Abrir búsqueda global |
| `Escape` | Cerrar modales |
| `↑` `↓` | Navegar en búsqueda |
| `Enter` | Seleccionar resultado |

### Credenciales de Demostración

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| 👑 Admin | admin@prestamos.com | admin123 | Todos |
| 💼 Gerente | gerente@prestamos.com | gerente123 | CRUD completo |
| ⚙️ Operador | operador@prestamos.com | operador123 | Crear, editar, pagos |
| 👁️ Viewer | viewer@prestamos.com | viewer123 | Solo lectura |

### Flujo de Trabajo Típico

```
1. Calculadora → Calcular préstamo
2. Dashboard → Analizar visualmente
3. Tabla → Ver detalle de cuotas
4. Historial → Guardar préstamo
5. Pagos → Registrar pagos realizados
6. Calendario → Monitorear vencimientos
7. Reportes → Generar informes mensuales
```

---

## 📦 Módulos

### Estructura de Componentes

```
src/
├── contexts/
│   ├── ThemeContext.tsx          # Modo oscuro/claro
│   └── AuthContext.tsx           # Autenticación y roles
└── components/
    ├── LoanCalculator.tsx       # 🧮 Calculadora
    ├── Dashboard.tsx            # 📊 Dashboard visual
    ├── AmortizationTable.tsx    # 📋 Tabla mejorada
    ├── PaymentCalendar.tsx      # 📅 Calendario
    ├── PaymentRegister.tsx      # 💳 Registro pagos
    ├── EarlyPaymentSimulator.tsx # ⚡ Simulador
    ├── RateComparator.tsx       # ⚖️ Comparador
    ├── LoanHistory.tsx          # 📂 Historial
    ├── CommitTimeline.tsx       # 🔀 Timeline commits
    ├── ProjectPlan.tsx          # 📋 Plan visual
    ├── FinancialDashboard.tsx   # 📈 Métricas financieras
    ├── ExcelImport.tsx          # 📥 Importación Excel
    ├── GlobalSearch.tsx         # 🔍 Búsqueda global
    ├── ContractGenerator.tsx    # 📄 Contratos PDF
    ├── NotificationSystem.tsx   # 🔔 Notificaciones
    ├── Login.tsx                # 🔐 Login
    ├── MonthlyReport.tsx        # 📊 Reportes mensuales
    └── LoanRenegotiation.tsx    # 🔄 Renegociación
```

---

## 📚 Documentación

### Documentos Disponibles

| Documento | Descripción |
|-----------|-------------|
| [README.md](./README.md) | Este archivo - Guía principal |
| [PROJECT_PLAN.md](./PROJECT_PLAN.md) | Plan completo del proyecto |
| [COMMITS.md](./COMMITS.md) | Guía de los 36 commits |
| [PENDING_FEATURES.md](./PENDING_FEATURES.md) | Mejoras pendientes para mañana |
| [apply-commits.sh](./apply-commits.sh) | Script automatizado de commits |

### Documentación en la App

- **Pestaña "Plan"** - Visualización interactiva del plan
- **Pestaña "Commits"** - Timeline visual de commits

---

## 🔀 Commits

El proyecto sigue la metodología **Conventional Commits** con 36 commits organizados en 8 fases:

### Fases

| Fase | Commits | Descripción | Estado |
|------|---------|-------------|--------|
| 📦 Foundation | 1-3 | Setup, tipos, componente principal | ✅ |
| 🧮 Core Modules | 4-7 | Calculadora, dashboard, tabla, calendario | ✅ |
| 💳 Management | 8-11 | Pagos, simulador, comparador, historial | ✅ |
| 🎨 Styles | 12 | CSS de impresión y animaciones | ✅ |
| 📋 Documentation | 13-14 | Plan del proyecto y visualización | ✅ |
| 💎 Advanced | 15-17 | Edición, duplicación, exportación | ✅ |
| 📊 Table | 18-26 | Filtros, gráficos, redondeo, alertas | ✅ |
| 🚀 New Features | 27-36 | Dashboard, PWA, auth, notificaciones | ✅ |

### Aplicar Commits

```bash
# Opción 1: Script interactivo
chmod +x apply-commits.sh
./apply-commits.sh

# Opción 2: Desde la app
# Ir a pestaña "Commits" → Copiar comandos → Marcar como aplicados
```

Ver detalles completos en [COMMITS.md](./COMMITS.md).

---

## 🏗️ Arquitectura

### Stack Técnico

```
┌─────────────────────────────────────────────┐
│              FRONTEND (SPA + PWA)            │
├─────────────────────────────────────────────┤
│  Framework:    React 18 + TypeScript        │
│  Build Tool:   Vite 6                       │
│  Styling:      Tailwind CSS 4               │
│  Charts:       Recharts                     │
│  Icons:        Lucide React                 │
│  Storage:      LocalStorage API             │
│  PWA:          Service Worker + Manifest    │
│  Export:       jsPDF, xlsx, docx            │
│  Auth:         Context API (simulado)       │
│  Hotkeys:      react-hotkeys-hook           │
└─────────────────────────────────────────────┘
```

### Fórmulas Matemáticas

**Amortización Francesa:**
```
Cuota = P × [r(1+r)^n] / [(1+r)^n - 1]
```

**Mora:**
```
Mora = Cuota × (Tasa_mora / 30) × Días_atraso
```

**Tasa Efectiva Anual:**
```
TEA = (1 + r_mensual)^12 - 1
```

**Redondeo:**
```
Cuota_redondeada = ⌈Cuota⌉ (entero superior)
Diferencia = Cuota_redondeada - Cuota_exacta
```

---

## 🗺️ Roadmap

### v3.1 - Próxima Sesión (Para Mañana)

#### Prioridad Alta
- [ ] Tour interactivo
- [ ] Sistema de garantes
- [ ] Cálculo de penalidades

#### Prioridad Media
- [ ] Backend Node.js + PostgreSQL
- [ ] Tests automatizados
- [ ] Optimización de performance

#### Prioridad Baja
- [ ] Integración con pasarelas de pago
- [ ] White label

Ver detalles completos en [PENDING_FEATURES.md](./PENDING_FEATURES.md).

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan código)
- `refactor:` Reestructuración de código
- `test:` Agregar o corregir tests
- `chore:` Tareas de mantenimiento

---

## 📄 Licencia

Este proyecto está bajo licencia MIT - ver archivo [LICENSE](LICENSE) para detalles.

---

## 📞 Contacto

Para preguntas o soporte:
- 📧 Email: [tu-email@ejemplo.com]
- 📱 WhatsApp: [+591 XXXXXXX]
- 🌐 Web: [tu-sitio-web.com]

---

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Framework UI
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Recharts](https://recharts.org/) - Gráficos
- [Lucide](https://lucide.dev/) - Iconos
- [jsPDF](https://github.com/parallax/jsPDF) - Generación de PDF
- [SheetJS](https://sheetjs.com/) - Importación Excel

---

<div align="center">

**Hecho con ❤️ para la gestión eficiente de préstamos**

[Documentación](./PROJECT_PLAN.md) • [Commits](./COMMITS.md) • [Pendientes](./PENDING_FEATURES.md) • [Reportar Bug](issues)

**Versión 3.0** | **60% Completado** | **En Desarrollo Activo**

</div>
