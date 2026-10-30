# 🚀 Guía de Uso Rápido - Sistema de Préstamos v3.1

## 📋 Contenido

1. [Primeros Pasos](#primeros-pasos)
2. [Tour Interactivo](#tour-interactivo)
3. [Dashboard](#dashboard)
4. [Calculadora](#calculadora)
5. [Tabla de Amortización](#tabla-de-amortización)
6. [Calendario de Pagos](#calendario-de-pagos)
7. [Registro de Pagos](#registro-de-pagos)
8. [Historial de Préstamos](#historial-de-préstamos)
9. [Sistema de Garantes](#sistema-de-garantes)
10. [Cálculo de Penalidades](#cálculo-de-penalidades)
11. [Modo Claro/Oscuro](#modo-clarooscuro)

---

## 🎯 Primeros Pasos

### 1. Iniciar la Aplicación
```bash
npm run dev
```
Abre tu navegador en `http://localhost:5173`

### 2. Tour Automático
La primera vez que abras la aplicación, verás un **tour interactivo** automático que te guiará por las principales funcionalidades.

### 3. Credenciales de Demo
Usa estas credenciales para probar el sistema:
- **Email:** admin@prestamos.com
- **Password:** admin123

---

## 🎓 Tour Interactivo

### ¿Cómo usarlo?
- **Automático:** Se muestra en tu primera visita
- **Manual:** Haz clic en el botón 🎓 "Tour" en la barra superior

### Pasos del Tour
1. **Bienvenida** - Introducción al sistema
2. **Dashboard** - Métricas principales
3. **Calculadora** - Cómo calcular préstamos
4. **Tabla** - Visualización de amortización
5. **Calendario** - Gestión de pagos
6. **Historial** - Administración de préstamos
7. **Finalización** - Resumen de funcionalidades

### Controles
- **Siguiente:** Avanza al siguiente paso
- **Anterior:** Regresa al paso anterior
- **Omitir:** Salta el tour completo
- **Cerrar:** Cierra el tour en cualquier momento

---

## 📊 Dashboard

### ¿Qué verás?
- **4 tarjetas de métricas** con gradientes de colores
- **Préstamos recientes** con avatares de clientes
- **Accesos rápidos** a funcionalidades principales

### Métricas Principales
1. **Monto Total** (Azul) - Suma de todos los préstamos
2. **Intereses Ganados** (Verde) - Total de intereses proyectados
3. **Préstamos Activos** (Ícono) - Número de préstamos en curso
4. **Total a Recaudar** (Amarillo) - Monto total pendiente

### Accesos Rápidos
- 🧮 **Nuevo Préstamo** - Ir a la calculadora
- 💳 **Registrar Pago** - Ir al registro de pagos
- 📊 **Ver Reportes** - Ir a métricas financieras
- 📥 **Importar Datos** - Ir a importación Excel

---

## 🧮 Calculadora

### ¿Cómo calcular un préstamo?

1. **Ingresa los datos:**
   - **Monto:** Cantidad a prestar (Bs.)
   - **Tasa mensual:** Porcentaje de interés mensual
   - **Plazo:** Número de meses
   - **Fecha de inicio:** Cuando comienza el préstamo

2. **Usa los sliders** para ajuste rápido

3. **Plantillas rápidas:**
   - 💰 500 Bs. / 6 meses
   - 💵 1.000 Bs. / 12 meses
   - 💎 5.000 Bs. / 24 meses
   - 🏦 10.000 Bs. / 36 meses

4. **Haz clic en "Calcular Amortización"**

### Resultados
- **Cuota mensual exacta** - Con decimales
- **Cuota redondeada** - Al entero superior
- **Total a pagar** - Suma de todas las cuotas
- **Interés total** - Costo del préstamo
- **Capital prestado** - Monto original

### Guardar Préstamo
1. Haz clic en "💾 Guardar Préstamo"
2. Ingresa un nombre descriptivo
3. Ingresa el nombre del cliente
4. Haz clic en "Guardar"

---

## 📋 Tabla de Amortización

### Vistas Disponibles

#### 1. Vista Compacta
- Solo columnas esenciales
- Ideal para impresión

#### 2. Vista Estándar (Default)
- Todas las columnas
- Balance completo de información

#### 3. Vista Detallada
- Barras de progreso
- Métricas adicionales
- Sparkline charts
- Tooltips informativos

### Métricas Rápidas
- **Total Pagado** - Suma de todas las cuotas
- **Capital** - Total amortizado
- **Intereses** - Total de intereses
- **Cuotas** - Número total de períodos

### Controles
- **Búsqueda:** Busca por número de cuota o fecha
- **Filtros:** Filtra por rango de fechas o montos
- **Exportar:** Excel, Word, PDF

### Funcionalidades Especiales
- **Sistema de redondeo:** Muestra cuota exacta vs redondeada
- **Punto de equilibrio:** Cuota donde capital > interés
- **Agrupación temporal:** Mensual, trimestral, anual

---

## 📅 Calendario de Pagos

### Estados de Pagos
- ✅ **Pagado** (Verde) - Cuota ya pagada
- ⏰ **Próximo** (Amarillo) - Vence en 7 días
- ⚠️ **Pendiente** (Gris) - Pago futuro
- ❌ **Vencido** (Rojo) - Pago atrasado

### Métricas
- **Pagados** - Número de cuotas pagadas
- **Pendientes** - Número de cuotas por pagar
- **Vencidos** - Número de cuotas atrasadas
- **Total** - Total de cuotas del préstamo

### Timeline Visual
Cada cuota muestra:
- Número de cuota
- Fecha de vencimiento
- Monto a pagar
- Estado actual
- Barra de progreso

---

## 💳 Registro de Pagos

### ¿Cómo registrar un pago?

1. **Selecciona la cuota** del menú desplegable
2. **Ingresa la fecha** de pago
3. **Confirma el monto** (pre-llenado)
4. **Agrega notas** (opcional)
5. **Haz clic en "💳 Registrar Pago"**

### Historial de Pagos
- Lista de últimos 5 pagos
- Muestra cuota, monto y fecha
- Icono de confirmación ✅

### Validaciones
- ✅ Monto debe ser mayor a 0
- ✅ Fecha no puede ser futura
- ✅ Cuota debe existir y estar pendiente

---

## 📁 Historial de Préstamos

### Búsqueda y Filtros
- **Búsqueda:** Por nombre del préstamo o cliente
- **Filtros por estado:**
  - Todos
  - Activos
  - Completados
  - Cancelados

### Acciones por Préstamo
Haz clic en el menú ⋮ para:
- 👁️ **Cargar** - Ver detalles y tabla
- ✏️ **Editar** - Modificar parámetros
- 📋 **Duplicar** - Crear copia
- 📥 **Exportar JSON** - Backup
- 🔄 **Cambiar estado** - Activo/Completado/Cancelado
- 🗑️ **Eliminar** - Borrar préstamo

### Información Mostrada
- Nombre del préstamo
- Nombre del cliente
- Monto original
- Tasa de interés
- Plazo en meses
- Cuota mensual
- Fecha de creación
- Estado actual
- Barra de progreso

---

## 👥 Sistema de Garantes

### ¿Qué es un garante?
Persona que respalda un préstamo con su patrimonio y capacidad de pago.

### ¿Cómo agregar un garante?

1. **Haz clic en "➕ Nuevo Garante"**
2. **Completa el formulario:**
   - Nombre completo (obligatorio)
   - CI/NIT (obligatorio)
   - Teléfono (opcional)
   - Email (opcional)
   - Ingreso mensual (obligatorio)
   - Garantías existentes (opcional)
3. **Haz clic en "Guardar Garante"**

### Métricas de Garantes
- **Total Garantes** - Número de garantes registrados
- **Ingreso Promedio** - Promedio de ingresos
- **Garantías Activas** - Total de garantías

### Gestión de Garantes
- **Editar:** Modifica datos del garante
- **Eliminar:** Elimina con confirmación
- **Ver detalles:** Información completa

### Validaciones
- ✅ Nombre es obligatorio
- ✅ CI/NIT es obligatorio
- ✅ Ingreso debe ser mayor a 0
- ✅ Email debe ser válido (si se ingresa)

---

## ⚠️ Cálculo de Penalidades

### ¿Qué son las penalidades?
Intereses moratorios que se aplican cuando un pago se atrasa.

### Configuración
- **Tasa de mora:** Configurable en el Topbar (default: 2% mensual)
- **Cálculo automático:** Se calcula diariamente sobre el saldo

### Fórmula
```
Tasa diaria = (Tasa mensual / 100) / 30
Penalidad = Cuota × Tasa diaria × Días de atraso
Total a pagar = Cuota original + Penalidad
```

### Ejemplo
- Cuota: Bs. 147.00
- Tasa mora: 2% mensual
- Días atraso: 15 días
- Tasa diaria: 0.000667
- Penalidad: 147 × 0.000667 × 15 = Bs. 1.47
- Total a pagar: 147 + 1.47 = Bs. 148.47

### Métricas
- **Cuotas Vencidas** - Número de cuotas con penalidad
- **Total Penalidades** - Suma de todas las penalidades
- **Total a Cobrar** - Cuotas + penalidades
- **Préstamos Afectados** - Número de préstamos con atrasos

### Tabla de Detalle
Para cada cuota vencida muestra:
- Cliente
- Préstamo
- Número de cuota
- Fecha de vencimiento
- Días de atraso
- Cuota original
- Penalidad calculada
- Total a pagar

---

## 🌓 Modo Claro/Oscuro

### ¿Cómo cambiar?
Haz clic en el botón ☀️/🌙 en la barra superior

### Características
- **Transición suave** entre modos
- **Persistencia** en localStorage
- **Diseño optimizado** para ambos modos
- **Contraste WCAG AA** para accesibilidad

### Modo Oscuro (Default)
- Fondo: Azul muy oscuro (#0f172a)
- Texto: Blanco suave (#f1f5f9)
- Cards: Gris oscuro (#1e293b)
- Ideal para: Uso nocturno, reducir fatiga visual

### Modo Claro
- Fondo: Blanco (#ffffff)
- Texto: Gris oscuro (#0f172a)
- Cards: Gris muy claro (#f8fafc)
- Ideal para: Uso diurno, ambientes iluminados

---

## 💡 Consejos y Trucos

### 1. Usa las Plantillas Rápidas
En la calculadora, usa las plantillas predefinidas para ahorrar tiempo.

### 2. Exporta Regularmente
Exporta tus préstamos a JSON como backup periódico.

### 3. Aprovecha los Filtros
En la tabla de amortización, usa filtros para encontrar cuotas específicas.

### 4. Revisa las Penalidades
Consulta regularmente la sección de penalidades para identificar atrasos.

### 5. Usa el Tour
Si olvidas cómo usar alguna funcionalidad, vuelve a ver el tour.

### 6. Cambia el Tema
Adapta el modo claro/oscuro según tu entorno y preferencia.

### 7. Busca Rápidamente
Usa la búsqueda en el historial para encontrar préstamos rápidamente.

### 8. Duplica para Probar
Duplica un préstamo para probar diferentes escenarios sin afectar el original.

---

## 🔧 Solución de Problemas

### No puedo iniciar sesión
- Verifica que estés usando las credenciales correctas
- Limpia el caché del navegador
- Reinicia la aplicación

### Los datos no se guardan
- Verifica que el navegador permita localStorage
- No uses modo incógnito
- Reinicia la aplicación

### El tour no aparece
- Haz clic en el botón 🎓 "Tour" en la barra superior
- Limpia el localStorage: `localStorage.removeItem('tourCompleted')`

### Los cálculos son incorrectos
- Verifica que la tasa de interés sea mensual
- Asegúrate de que el plazo esté en meses
- Revisa la fecha de inicio

### No puedo exportar
- Verifica que el navegador permita descargas
- Desactiva bloqueadores de popups
- Intenta con otro navegador

---

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa esta guía
2. Usa el tour interactivo
3. Consulta la documentación en PROJECT_PLAN.md
4. Revisa el log de sesión en SESSION_LOG.md

---

## 🎉 ¡Listo!

Ahora estás listo para usar el Sistema de Préstamos v3.1 de manera eficiente. 

**Características principales:**
- ✅ Diseño SaaS profesional
- ✅ Tour interactivo
- ✅ Sistema de garantes
- ✅ Cálculo de penalidades
- ✅ Modo claro/oscuro
- ✅ Exportación múltiple
- ✅ Gestión completa

¡Disfruta de tu sistema de gestión de préstamos! 🚀

---

**Versión:** 3.1  
**Última actualización:** Enero 2026  
**Estado:** Producción ✅
