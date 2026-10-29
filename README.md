# 🏦 Sistema de Gestión de Préstamos v2.0

Sistema web completo para la gestión de préstamos personales y comerciales basado en el método de amortización francesa.

![Versión](https://img.shields.io/badge/versión-2.0-blue)
![Estado](https://img.shields.io/badge/estado-completado-green)
![Commits](https://img.shields.io/badge/commits-17-orange)
![Módulos](https://img.shields.io/badge/módulos-10-purple)

---

## 📑 Tabla de Contenidos

- [Características](#-características)
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
- Resultados en tiempo real

### 📊 Dashboard Visual
- Gráfico de torta (composición capital/interés)
- Gráfico de área (evolución del saldo)
- Gráfico de barras (capital/interés por cuota)
- KPIs clave: cuota, tasa efectiva anual, métricas financieras

### 📋 Tabla de Amortización
- Detalle completo de cada cuota
- Exportación a CSV
- Impresión optimizada
- Totales automáticos

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

### 📂 Historial de Préstamos (MEJORADO)
- **Búsqueda** por nombre o cliente
- **Filtros** por estado (activo/completado/cancelado)
- **Edición** completa con recálculo automático
- **Duplicación** para probar variaciones
- **Exportación** JSON para backup
- **Estados** del préstamo (activo/completado/cancelado)
- **Notas** y observaciones
- **Barra de progreso** visual
- **Confirmación** antes de eliminar

### 🔀 Timeline de Commits
- Visualización interactiva de los 17 commits
- Copiar comandos al portapapeles
- Marcar commits como aplicados
- Descargar script automatizado

### 📋 Plan del Proyecto
- Visualización interactiva del plan completo
- 6 secciones navegables
- Barras de progreso y métricas
- Matriz de riesgos
- Roadmap futuro

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

El sistema tiene 10 pestañas principales:

1. **🧮 Calculadora** - Calcular préstamos y guardar
2. **📊 Dashboard** - Visualización gráfica
3. **📋 Tabla** - Tabla de amortización detallada
4. **📅 Calendario** - Timeline de pagos con mora
5. **💳 Pagos** - Registro de pagos
6. **⚡ Pago Anticipado** - Simulador
7. **⚖️ Comparador** - Comparar tasas/plazos
8. **📂 Historial** - Gestión de préstamos
9. **🔀 Commits** - Timeline de commits
10. **📋 Plan** - Plan del proyecto

### Flujo de Trabajo Típico

```
1. Calculadora → Calcular préstamo
2. Dashboard → Analizar visualmente
3. Tabla → Ver detalle de cuotas
4. Historial → Guardar préstamo
5. Pagos → Registrar pagos realizados
6. Calendario → Monitorear vencimientos
```

### Gestión de Préstamos

#### Guardar un Préstamo
1. Calcular préstamo en la Calculadora
2. Hacer clic en "💾 Guardar Préstamo"
3. Ingresar nombre y cliente
4. Confirmar

#### Editar un Préstamo
1. Ir a Historial
2. Hacer clic en ⋮ (más opciones)
3. Seleccionar "✏️ Editar préstamo"
4. Modificar campos (se recalcula automáticamente)
5. Guardar cambios

#### Duplicar un Préstamo
1. Ir a Historial
2. Hacer clic en ⋮
3. Seleccionar "📋 Duplicar"
4. Se crea una copia con "(Copia)" en el nombre

#### Exportar un Préstamo
1. Ir a Historial
2. Hacer clic en ⋮
3. Seleccionar "📥 Exportar JSON"
4. Se descarga archivo `.json` con todos los datos

#### Cambiar Estado
1. Ir a Historial
2. Hacer clic en ⋮
3. Seleccionar estado: Activo / Completado / Cancelado

---

## 📦 Módulos

### Estructura de Componentes

```
src/components/
├── LoanCalculator.tsx       # 🧮 Calculadora principal
├── Dashboard.tsx            # 📊 Panel visual con gráficos
├── AmortizationTable.tsx    # 📋 Tabla de amortización
├── PaymentCalendar.tsx      # 📅 Calendario con mora
├── PaymentRegister.tsx      # 💳 Registro de pagos
├── EarlyPaymentSimulator.tsx # ⚡ Simulador anticipos
├── RateComparator.tsx       # ⚖️ Comparador de tasas
├── LoanHistory.tsx          # 📂 Historial mejorado
├── CommitTimeline.tsx       # 🔀 Timeline de commits
└── ProjectPlan.tsx          # 📋 Plan visual del proyecto
```

### Descripción Detallada

Cada módulo está documentado en [PROJECT_PLAN.md](./PROJECT_PLAN.md) sección 5.

---

## 📚 Documentación

### Documentos Disponibles

| Documento | Descripción |
|-----------|-------------|
| [README.md](./README.md) | Este archivo - Guía principal |
| [PROJECT_PLAN.md](./PROJECT_PLAN.md) | Plan completo del proyecto |
| [COMMITS.md](./COMMITS.md) | Guía de los 17 commits |
| [apply-commits.sh](./apply-commits.sh) | Script automatizado de commits |

### Documentación en la App

- **Pestaña "Plan"** - Visualización interactiva del plan
- **Pestaña "Commits"** - Timeline visual de commits

---

## 🔀 Commits

El proyecto sigue la metodología **Conventional Commits** con 17 commits organizados en 5 fases:

### Fases

| Fase | Commits | Descripción | Estado |
|------|---------|-------------|--------|
| 📦 Foundation | 1-3 | Setup, tipos, componente principal | ✅ |
| 🧮 Módulos Core | 4-7 | Calculadora, dashboard, tabla, calendario | ✅ |
| 💳 Gestión | 8-11 | Pagos, simulador, comparador, historial | ✅ |
| 🎨 Estilos | 12 | CSS de impresión y animaciones | ✅ |
| 📋 Documentación | 13-14 | Plan del proyecto y visualización | ✅ |
| 💎 Mejoras | 15-17 | Edición, duplicación, exportación | ✅ |

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

---

## 🗺️ Roadmap

### Versión 3.0 (Próxima)

#### Backend
- [ ] API REST con Node.js/Express
- [ ] Base de datos PostgreSQL
- [ ] Autenticación JWT
- [ ] Migración de localStorage a BD

#### Funcionalidades Avanzadas
- [ ] Gestión de clientes (CRUD)
- [ ] Reportes PDF profesionales
- [ ] Notificaciones email/SMS
- [ ] Dashboard administrativo
- [ ] Integración pasarelas de pago
- [ ] App móvil (React Native)

#### Optimización
- [ ] Code splitting / lazy loading
- [ ] PWA (Progressive Web App)
- [ ] Tests unitarios (Jest + RTL)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD pipeline

---

## 📊 Estado del Proyecto

```
┌─────────────────────────────────────────────┐
│  SISTEMA DE PRÉSTAMOS v2.0                  │
├─────────────────────────────────────────────┤
│  ✅ 10/10 Módulos completados               │
│  ✅ 17/17 Commits aplicados                 │
│  ✅ 15/15 Requisitos funcionales            │
│  ✅ 8/8 Requisitos no funcionales           │
│  ✅ 5/5 Fases completadas                   │
│  ✅ 100% Documentado                        │
│  🎯 Estado: PRODUCCIÓN                      │
└─────────────────────────────────────────────┘
```

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

---

<div align="center">

**Hecho con ❤️ para la gestión eficiente de préstamos**

[Documentación](./PROJECT_PLAN.md) • [Commits](./COMMITS.md) • [Reportar Bug](issues)

</div>
