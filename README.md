# Dashboard Agente — Panel de Operadores de Soporte IA

Panel de control web para operadores de un sistema de soporte basado en inteligencia artificial. Permite visualizar métricas operativas en tiempo real, gestionar incidentes (tickets), analizar la calidad del sistema por módulo y administrar el acceso mediante autenticación por email.

---

## Tabla de contenidos

1. [Descripción general](#descripción-general)
2. [Tecnologías usadas](#tecnologías-usadas)
3. [Requisitos previos](#requisitos-previos)
4. [Instalación](#instalación)
5. [Cómo correrlo en local](#cómo-correrlo-en-local)
6. [Estructura de carpetas](#estructura-de-carpetas)
7. [Variables de entorno](#variables-de-entorno)
8. [Sistema de autenticación](#sistema-de-autenticación)
9. [Flag USE\_MOCK — datos reales vs. mock](#flag-use_mock--datos-reales-vs-mock)
10. [Documentación de componentes](#documentación-de-componentes)
    - [App.js](#appjs)
    - [Sidebar.js](#sidebarjs)
    - [Login.js](#loginjs)
    - [Dashboard.js](#dashboardjs)
    - [Metricas.js](#metricasjs)
    - [Tickets.js](#ticketsjs)
    - [api.js](#apijs)
    - [mockData.js](#mockdatajs)

---

## Descripción general

El **Dashboard Agente** es una SPA (Single Page Application) construida con React que sirve como interfaz de operaciones para un agente de soporte con IA. Sus funcionalidades principales son:

- **Autenticación segura**: registro con confirmación por email, login con JWT y cierre de sesión.
- **Dashboard principal**: tarjetas de métricas clave (ingresados, resueltos, no resueltos, escalados), gráfico de distribución tipo torta y listado de los últimos incidentes, con refresco automático cada 30 segundos.
- **Gestión de tickets**: tabla filtrable y ordenable de incidentes con búsqueda por texto libre, filtros por estado, prioridad y rango de fechas, y soporte para parámetros en la URL.
- **Métricas de calidad**: análisis de fallas por módulo del sistema, con gráfico de barras horizontal y tabla de prioridades.
- **Diseño responsivo**: adaptado para escritorio y dispositivos móviles, con sidebar colapsable y panel de filtros en bottom sheet.
- **Soporte dual**: puede funcionar completamente con datos mock (sin backend) o conectado a la API real.

---

## Tecnologías usadas

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2.5 | Framework UI principal |
| React Router DOM | 7.14.2 | Enrutamiento del lado del cliente |
| Axios | 1.16.0 | Peticiones HTTP al backend |
| Recharts | 3.8.1 | Gráficos (torta y barras) |
| Create React App | — | Toolchain (Webpack, Babel, ESLint) |

**Fuentes**: Plus Jakarta Sans (texto) y Syne (títulos), cargadas desde Google Fonts.

**Estilos**: 100 % estilos inline con objetos JavaScript. No se usa ninguna librería CSS externa ni módulos CSS.

---

## Requisitos previos

- **Node.js** >= 16 (recomendado LTS 18 o 20)
- **npm** >= 8 (incluido con Node.js)
- (Opcional) Un backend corriendo en `http://localhost:5038` si se quiere usar datos reales

Para verificar tus versiones:

```bash
node -v
npm -v
```

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd dashboard-agente

# 2. Instalar dependencias
npm install
```

---

## Cómo correrlo en local

### Modo desarrollo (con hot-reload)

```bash
npm start
```

La app queda disponible en [http://localhost:3000](http://localhost:3000).

### Modo producción (build estático)

```bash
npm run build
```

Genera la carpeta `build/` con los archivos optimizados para producción.

### Ejecutar tests

```bash
npm test
```

---

### Flujo típico de desarrollo local

1. Asegurarse de que `USE_MOCK = true` en `src/services/api.js` (ver sección [Flag USE\_MOCK](#flag-use_mock--datos-reales-vs-mock)).
2. Ejecutar `npm start`.
3. Abrir [http://localhost:3000](http://localhost:3000).
4. Iniciar sesión con cualquier email y contraseña (en modo mock no se valida contra el servidor).

Si se quiere usar el backend real:

1. Levantar el servidor backend en `http://localhost:5038`.
2. Cambiar `USE_MOCK = false` en `src/services/api.js`.
3. Registrar un usuario real a través del formulario de la app.

---

## Estructura de carpetas

```
dashboard-agente/
├── public/
│   ├── index.html          # Punto de entrada HTML (incluye Google Fonts)
│   ├── manifest.json       # Configuración PWA
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── dashboard-icon.png  # Icono de nav: Dashboard
│   ├── analytics.png       # Icono de nav: Métricas
│   ├── files.png           # Icono de nav: Incidentes
│   ├── ticket.png          # Icono de tarjeta de ticket
│   └── metricas-icon.png   # Icono de métricas
├── src/
│   ├── index.js            # Punto de entrada React (ReactDOM.render)
│   ├── index.css           # Estilos globales (reset y body)
│   ├── App.js              # Router principal, rutas protegidas e interceptor Axios
│   ├── App.css             # Estilos mínimos del App
│   ├── App.test.js         # Test básico de humo
│   ├── reportWebVitals.js  # Métricas de rendimiento del navegador
│   ├── setupTests.js       # Configuración de Jest DOM
│   ├── components/
│   │   └── Sidebar.js      # Barra lateral de navegación reutilizable
│   ├── pages/
│   │   ├── Login.js        # Página de autenticación (registro + login)
│   │   ├── Dashboard.js    # Página principal con métricas y últimos tickets
│   │   ├── Metricas.js     # Página de métricas de calidad por módulo
│   │   └── Tickets.js      # Página de gestión de incidentes
│   └── services/
│       ├── api.js          # Capa de acceso a datos (mock o API real)
│       └── mockData.js     # Datos de ejemplo para desarrollo
├── .env                    # Variables de entorno (no se commitea en repos públicos)
├── .gitignore
├── package.json
├── package-lock.json
└── vercel.json             # Configuración de rewrites para despliegue en Vercel
```

---

## Variables de entorno

El proyecto usa un único archivo `.env` en la raíz del proyecto.

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `REACT_APP_API_URL` | URL base del backend | `http://localhost:5038` |

### Archivo `.env` de ejemplo

```env
# URL del backend en local
REACT_APP_API_URL=http://localhost:5038

# Para producción (ejemplo):
# REACT_APP_API_URL=https://api.agentai.classicaljo.ar
```

> **Importante**: todas las variables de entorno de Create React App deben comenzar con el prefijo `REACT_APP_` para ser expuestas al código del navegador.

### Cómo se consume en el código

```js
// src/services/api.js
const URL_BACK = process.env.REACT_APP_API_URL || '/api';
```

Si la variable no está definida, se usa `/api` como fallback, lo que en producción (Vercel) queda resuelto por los rewrites de `vercel.json`.

### Configuración en Vercel

`vercel.json` redirige todas las peticiones a `/api/*` hacia el backend de producción:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.agentai.classicaljo.ar/:path*"
    }
  ]
}
```

---

## Sistema de autenticación

### Diagrama de flujo

```
Usuario
  │
  ▼
/login
  │
  ├─── Registro ──► POST /auth/sign-up {email, password}
  │                       │
  │                       ▼
  │              Verificación de email
  │              POST /auth/confirm {email, code}
  │                       │
  │                       ▼
  │              Registro completado
  │
  └─── Login ───► POST /auth/sign-in {email, password}
                          │
                          ▼
                   Guarda en localStorage:
                   - accessToken
                   - userEmail
                          │
                          ▼
                   Redirige a /dashboard
```

### Componentes involucrados

#### `RutaProtegida` (en `App.js`)

Wrapper que envuelve todas las rutas privadas. En cada navegación verifica si existe `accessToken` en `localStorage`. Si no existe, redirige automáticamente a `/login`.

```
/dashboard  ──► RutaProtegida ──► (si hay token) Dashboard
                                └► (si no hay token) /login
```

#### `InterceptorAxios` (en `App.js`)

Componente sin UI que registra un interceptor global de respuestas Axios. Si cualquier petición recibe un error **401 (No autorizado)**, automáticamente:

1. Elimina `accessToken` y `userEmail` de `localStorage`.
2. Redirige al usuario a `/login`.

Esto cubre el caso de tokens vencidos o revocados sin que el usuario tenga que hacer nada.

#### Manejo de headers

Todas las peticiones autenticadas incluyen el header:

```
Authorization: Bearer <accessToken>
```

Esto se aplica en `src/services/api.js` antes de cada llamada a la API real.

### Validaciones del formulario de registro

| Regla | Mensaje |
|---|---|
| Email con formato válido | "Ingresá un email válido" |
| Contraseña ≥ 8 caracteres | "La contraseña debe tener al menos 8 caracteres" |
| Al menos un número | "La contraseña debe contener al menos un número" |
| Al menos una letra | "La contraseña debe contener al menos una letra" |
| Al menos una mayúscula | "La contraseña debe contener al menos una letra mayúscula" |
| Al menos un carácter especial (`!@#$%^&*`) | "La contraseña debe contener al menos un carácter especial" |

### Rutas protegidas

| Ruta | Acceso |
|---|---|
| `/login` | Público |
| `/dashboard` | Requiere autenticación |
| `/metricas` | Requiere autenticación |
| `/tickets` | Requiere autenticación |
| `/` | Redirige a `/dashboard` |

---

## Flag `USE_MOCK` — datos reales vs. mock

### Dónde está

```
src/services/api.js  — línea 4
```

```js
const USE_MOCK = false; // ← cambiar a true para usar datos mock
```

### Qué hace cada valor

| Valor | Comportamiento |
|---|---|
| `true` | Todas las funciones del servicio devuelven los datos de `mockData.js`. No se realiza ninguna petición HTTP. El filtrado se aplica localmente en el cliente. |
| `false` | Se realizan peticiones reales al backend definido en `REACT_APP_API_URL`. Los filtros se pasan como query params. Se requiere `accessToken` válido. |

### Cómo cambiar entre modos

**Para usar datos mock** (no necesitás backend):

```js
// src/services/api.js
const USE_MOCK = true;
```

**Para usar la API real**:

```js
// src/services/api.js
const USE_MOCK = false;
```

Luego reiniciar el servidor de desarrollo con `npm start`.

> En modo mock la autenticación sigue siendo requerida por las rutas protegidas de React Router, pero las peticiones al backend no se realizan. Podés iniciar sesión con cualquier email/contraseña registrada si el backend de auth está activo, o deshabilitar temporalmente `RutaProtegida` para desarrollo puro.

### Estructura interna de `api.js`

Cada función de servicio sigue el mismo patrón:

```js
export const getTickets = async (filtros = {}) => {
  if (USE_MOCK) {
    // filtra mockTickets en memoria y retorna
    return filtrarMock(mockTickets, filtros);
  }
  // petición real al backend con headers de auth
  const response = await axios.get(`${URL_BACK}/tickets`, {
    params: filtros,
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  });
  return response.data;
};
```

### Endpoints de la API real

| Endpoint | Método | Autenticado | Descripción |
|---|---|---|---|
| `/auth/sign-up` | POST | No | Registro de nuevo operador |
| `/auth/sign-in` | POST | No | Login, devuelve `{ accessToken }` |
| `/auth/confirm` | POST | No | Confirmación de email con código |
| `/tickets` | GET | Sí | Lista de tickets con filtros opcionales |
| `/metricas` | GET | Sí | Métricas resumen (ingresados, resueltos, etc.) |
| `/metricas/calidad` | GET | Sí | Fallas por módulo |

#### Query params de `/tickets`

| Parámetro | Tipo | Descripción |
|---|---|---|
| `estado` | string | `'nuevo'`, `'en-progreso'`, `'en-espera'`, etc. |
| `prioridad` | string | `'high'`, `'moderate'`, `'low'` |
| `desde` | ISO 8601 | Fecha de apertura desde |
| `hasta` | ISO 8601 | Fecha de apertura hasta |
| `busqueda` | string | Texto libre para búsqueda |

---

## Documentación de componentes

---

### `App.js`

**Tipo**: Componente raíz / configuración de la aplicación

**Descripción**: Define la estructura de enrutamiento de toda la aplicación. Contiene la lógica de autenticación (rutas protegidas) y el interceptor global de Axios.

**No recibe props** (es el componente raíz montado en `index.js`).

**Sub-componentes internos**:

#### `RutaProtegida`

| Prop | Tipo | Descripción |
|---|---|---|
| `children` | ReactNode | Componente de página a renderizar si está autenticado |

Lee `accessToken` de `localStorage`. Si existe, renderiza `children`; si no, redirige a `/login` con `<Navigate>`.

#### `InterceptorAxios`

Sin props ni UI. Al montarse registra un interceptor de respuestas en Axios que detecta errores 401 y limpia la sesión.

**Árbol de rutas**:

```
/            → redirige a /dashboard
/login       → <Login />
/dashboard   → <RutaProtegida> <Dashboard />
/metricas    → <RutaProtegida> <Metricas />
/tickets     → <RutaProtegida> <Tickets />
```

---

### `Sidebar.js`

**Ruta**: `src/components/Sidebar.js`

**Descripción**: Barra lateral de navegación reutilizable que aparece en todas las páginas autenticadas. Muestra el avatar del usuario, los ítems de navegación y el botón de cerrar sesión.

**Props**:

| Prop | Tipo | Requerida | Descripción |
|---|---|---|---|
| `paginaActiva` | `string` | Sí | Clave de la página actual: `'dashboard'`, `'metricas'` o `'tickets'` |
| `sidebarAbierto` | `boolean` | Sí | Controla si el sidebar está expandido (`true`) o colapsado (`false`) |
| `setSidebarAbierto` | `(boolean) => void` | Sí | Función para cambiar el estado de apertura |

**Comportamiento**:
- En estado colapsado, muestra solo íconos (52 px de ancho).
- En estado expandido, muestra ícono + etiqueta de texto (220 px de ancho).
- El ítem de la página activa se resalta con fondo azul oscuro (`#1A3A5C`).
- El botón de hamburguesa alterna entre los dos estados.
- Al cerrar sesión limpia `accessToken` y `userEmail` de `localStorage` y navega a `/login`.

**Datos del usuario**: Lee `userEmail` de `localStorage` y muestra las dos primeras letras como avatar circular.

**Ítems de navegación**:

| Ícono | Etiqueta | Ruta |
|---|---|---|
| `dashboard-icon.png` | Dashboard | `/dashboard` |
| `analytics.png` | Métricas | `/metricas` |
| `files.png` | Incidentes | `/tickets` |

---

### `Login.js`

**Ruta**: `src/pages/Login.js`

**Descripción**: Página de autenticación que maneja tres flujos en un solo componente: registro, confirmación de email y login.

**No recibe props** (es una página de nivel superior).

**Estado interno**:

| Variable | Tipo | Descripción |
|---|---|---|
| `isRegistro` | boolean | Alterna entre vista de registro y de login |
| `email` | string | Campo de email del formulario |
| `password` | string | Campo de contraseña del formulario |
| `error` | string | Mensaje de error a mostrar |
| `esperandoConfirmacion` | boolean | Muestra el paso de código de confirmación |
| `codigo` | string | Código de confirmación de email |
| `isMobile` | boolean | Detecta pantallas menores a 768 px |

**Flujos**:

1. **Login** (`isRegistro = false`):
   - Valida formato de email.
   - POST a `/auth/sign-in`.
   - En éxito: guarda `accessToken` y `userEmail` en `localStorage`, navega a `/dashboard`.

2. **Registro** (`isRegistro = true`, `esperandoConfirmacion = false`):
   - Valida email y todas las reglas de contraseña.
   - POST a `/auth/sign-up`.
   - En éxito: activa `esperandoConfirmacion = true`.

3. **Confirmación de email** (`esperandoConfirmacion = true`):
   - Muestra campo para ingresar el código recibido por email.
   - POST a `/auth/confirm`.
   - En éxito: muestra mensaje de éxito y vuelve al formulario de login.

**Renderiza**:
- Layout de dos columnas en escritorio (imagen izquierda + formulario derecho).
- Layout de una columna en móvil (solo formulario).
- Formulario con campo de email, contraseña y botón de acción.
- Link para alternar entre registro y login.
- Cuadros de alerta para errores e información.
- Campo de código de confirmación cuando corresponde.

---

### `Dashboard.js`

**Ruta**: `src/pages/Dashboard.js`

**Descripción**: Página principal del panel. Muestra el resumen operativo del sistema de soporte con métricas en tarjetas, un gráfico de distribución y los últimos incidentes registrados.

**No recibe props**.

**Estado interno**:

| Variable | Tipo | Descripción |
|---|---|---|
| `sidebarAbierto` | boolean | Estado del sidebar |
| `isMobile` | boolean | Responsive flag (< 768 px) |
| `metricasBack` | object | Datos de métricas desde la API |
| `ultimosTickets` | array | Últimos 5 tickets ordenados por fecha |

**Estructura de `metricasBack`**:

```js
{
  ingresados: number,    // Total de tickets creados
  resueltos: number,     // Tickets con estado resuelto
  noResueltos: number,   // Tickets abiertos/pendientes
  escalados: number      // Tickets escalados a nivel superior
}
```

**Ciclo de datos**:
- Llama a `getMetricas()` y `getTickets()` al montarse.
- Refresca automáticamente cada **30 segundos** via `setInterval`.
- Los tickets se ordenan por `openedAt` descendente y se toman los primeros 5.

**Renderiza**:

1. **Tarjetas de métricas** (grilla de 4 en escritorio, 2 en móvil):
   - Ingresados, Resueltos, No resueltos, Escalados.
   - Cada tarjeta tiene ícono, número grande y etiqueta.
   - Son clicables: navegan a `/tickets?estado=<valor>` para ver el subconjunto correspondiente.

2. **Gráfico de torta** (Recharts `PieChart`):
   - Tres segmentos: Resueltos (verde), No Resueltos (rojo), Escalados (naranja).
   - Etiquetas con porcentaje y cantidad absoluta.
   - En móvil: radio menor y sin leyenda lateral.

3. **Últimos incidentes**:
   - Lista de los 5 tickets más recientes.
   - Cada ítem muestra: número de incidente, título (truncado), badge de estado con color semántico.
   - Clicable: navega a `/tickets?busqueda=<número>` para ver el detalle de ese ticket.
   - Link "Ver todos los incidentes" al final.

---

### `Metricas.js`

**Ruta**: `src/pages/Metricas.js`

**Descripción**: Página de análisis de calidad. Muestra qué módulos del sistema generan más fallas, con visualización en gráfico de barras y tabla detallada con niveles de prioridad.

**No recibe props**.

**Estado interno**:

| Variable | Tipo | Descripción |
|---|---|---|
| `sidebarAbierto` | boolean | Estado del sidebar |
| `isMobile` | boolean | Responsive flag |
| `fallasPorModulo` | array | Lista de `{modulo, fallas}` desde la API |
| `cargando` | boolean | Indica si hay una petición en curso |
| `errorCarga` | string | Mensaje de error si falla la carga |

**Ciclo de datos**:
- Llama a `getMetricasCalidad()` al montarse.
- Refresca cuando la ventana recupera el foco (`window focus`) o visibilidad (`visibilitychange`).
- Usa una bandera `cancelado` para evitar actualizar estado en componentes desmontados.

**Cálculos derivados**:

| Cálculo | Descripción |
|---|---|
| `totalTickets` | Suma de todas las fallas de todos los módulos |
| `moduloTop` | Módulo con el porcentaje más alto |
| `getPrioridad(porcentaje)` | Asigna prioridad según umbrales |

**Umbrales de `getPrioridad`**:

| Condición | Prioridad | Color |
|---|---|---|
| porcentaje ≥ 30 % | Alta | Rojo (`#E24B4A`) |
| porcentaje ≥ 15 % | Media | Naranja (`#BA7517`) |
| porcentaje ≥ 5 % | Baja | Verde (`#1D9E75`) |
| porcentaje < 5 % | Sin prioridad | Gris (`#64748b`) |

**Renderiza**:

1. **Tarjetas de resumen** (2 columnas):
   - Total de tickets analizados.
   - Módulo más problemático con su porcentaje.

2. **Gráfico de barras horizontal** (Recharts `BarChart`):
   - Eje Y: nombres de módulos.
   - Eje X: cantidad de fallas.
   - Color de barra según criticidad: rojo (módulo top), naranja (≥ 6 fallas), azul (resto).

3. **Tabla de análisis**:
   - Columnas: Módulo / Tickets / % / Prioridad.
   - Ordenada de mayor a menor fallas.
   - Filas con color alterno.
   - Módulos con menos del 5 % se muestran en tono grisáceo.

---

### `Tickets.js`

**Ruta**: `src/pages/Tickets.js`

**Descripción**: Página de gestión de incidentes. Tabla completa con búsqueda por texto libre, filtros avanzados, ordenamiento por columna y soporte responsivo para móvil.

**No recibe props**.

**Estado interno**:

| Variable | Tipo | Descripción |
|---|---|---|
| `sidebarAbierto` | boolean | Estado del sidebar |
| `isMobile` | boolean | Responsive flag |
| `tickets` | array | Lista de tickets actual (filtrada/ordenada) |
| `filtroEstado` | string | Filtro de estado seleccionado |
| `filtroPrioridad` | string | Filtro de prioridad seleccionado |
| `filtroFechaDesde` | string | Fecha inicio del rango |
| `filtroFechaHasta` | string | Fecha fin del rango |
| `busqueda` | string | Texto de búsqueda libre |
| `orden` | `{columna, direccion}` | Columna y dirección de ordenamiento activo |
| `filaExpandida` | number \| null | ID de la fila expandida en móvil |
| `bottomSheetAbierto` | boolean | Estado del panel de filtros en móvil |

**Parámetros de URL soportados**:

Al navegar a `/tickets?estado=resuelto` o `/tickets?busqueda=INC0000064`, la página aplica automáticamente esos filtros. Esto permite que el Dashboard navegue directamente a una vista filtrada.

**Estructura de un ticket**:

```js
{
  id: number,
  number: string,          // Ej: "INC0000064"
  title: string,
  stateLabel: string,      // 'New', 'In Progress', 'On Hold', 'Resolved', 'Closed', 'Canceled', 'Escalado'
  priorityLabel: string,   // 'High', 'Moderate', 'Low'
  openedAt: string,        // ISO 8601
  updatedAt: string,       // ISO 8601
  assignmentGroup?: string // Solo en tickets escalados
}
```

**Ordenamiento**:
- Columnas ordenables: Número, Título, Estado, Prioridad, Fecha de apertura, Última actualización.
- Estado y Prioridad usan pesos numéricos para el ordenamiento semántico.
- Indicadores visuales: ↑ (asc), ↓ (desc), ↕ (sin orden).
- Clic repetido en la misma columna alterna la dirección.

**Búsqueda**:
- Normaliza texto eliminando tildes (`NFD`/`NFC`) para comparación insensible a acentos.
- Busca en: número de ticket, título, estado y prioridad.

**Renderiza**:

1. **Barra de búsqueda**:
   - Input con ícono de lupa.
   - Botón ✕ para limpiar cuando hay texto.

2. **Filtros** (escritorio: fila horizontal; móvil: bottom sheet deslizable):
   - Select de Estado: Todos / Resuelto / Nuevo / En Progreso / En Espera / Cerrado / Cancelado / Escalado.
   - Select de Prioridad: Todas / Alta / Moderada / Baja.
   - Inputs de fecha: Desde / Hasta.
   - Botón "Limpiar filtros" (solo visible cuando hay filtros activos).

3. **Tabla de tickets**:
   - **Escritorio**: columnas Número, Título, Estado, Prioridad, Abierto, Actualizado. Encabezados clicables para ordenar.
   - **Móvil**: columnas Número, Título, Estado, Prioridad + botón de expansión. Al expandir una fila se muestran las fechas.
   - Badges de estado y prioridad con colores semánticos.
   - Filas con color alterno.
   - Texto "Mostrando X incidentes" en la parte inferior.

**Colores de badges**:

| Estado | Color de fondo |
|---|---|
| New | Azul claro |
| In Progress | Naranja claro |
| On Hold | Amarillo claro |
| Resolved | Verde claro |
| Closed | Gris claro |
| Canceled | Rojo claro |
| Escalado | Púrpura claro |

| Prioridad | Color de fondo |
|---|---|
| High | Rojo claro |
| Moderate | Naranja claro |
| Low | Verde claro |

---

### `api.js`

**Ruta**: `src/services/api.js`

**Descripción**: Capa de servicios que abstrae el acceso a datos. Dependiendo del flag `USE_MOCK`, retorna datos locales o realiza peticiones HTTP reales.

**Constantes**:

```js
const USE_MOCK = false;
const URL_BACK = process.env.REACT_APP_API_URL || '/api';
```

**Funciones exportadas**:

| Función | Parámetros | Descripción |
|---|---|---|
| `getTickets(filtros)` | `{estado?, prioridad?, desde?, hasta?, busqueda?}` | Obtiene lista de tickets con filtros opcionales |
| `getMetricas()` | — | Obtiene métricas resumen `{ingresados, resueltos, noResueltos, escalados}` |
| `getMetricasCalidad()` | — | Obtiene métricas de calidad `{fallasPorModulo: [{modulo, fallas}]}` |

Todas las funciones son `async` y retornan una promesa con los datos.

---

### `mockData.js`

**Ruta**: `src/services/mockData.js`

**Descripción**: Datos estáticos de ejemplo usados cuando `USE_MOCK = true`. Permite desarrollar y probar la UI sin necesidad de un backend activo.

**Exports**:

| Export | Tipo | Descripción |
|---|---|---|
| `mockTickets` | `Ticket[]` | 15 incidentes de ejemplo con estados y prioridades variados |
| `mockMetricas` | `object` | `{ingresados: 142, resueltos: 89, noResueltos: 38, escalados: 15}` |
| `mockMetricasCalidad` | `object` | `{fallasPorModulo: [{modulo, fallas}]}` con 5 módulos de ejemplo |

---

## Notas de despliegue

El proyecto está configurado para desplegar en **Vercel**. El archivo `vercel.json` define un rewrite que evita problemas de CORS en producción redirigiendo `/api/*` al backend real. Para otros proveedores de hosting (Netlify, AWS S3 + CloudFront, etc.) se necesitará configurar un proxy equivalente o actualizar `REACT_APP_API_URL` directamente con la URL del backend.

---

## Licencia

Proyecto privado — uso interno.
