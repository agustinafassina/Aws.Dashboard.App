# 📊 Dashboard Template — Next.js
[English](#english) | [Español](#español)

Plantilla de dashboard moderna con Auth0, temas claro/oscuro, internacionalización (ES/EN) y arquitectura escalable.

> 📌 Ver también [MEJORAS.md](./MEJORAS.md) para el roadmap y tareas pendientes.


## English 🇬🇧
### 📋 Description
A production-oriented dashboard template built with **Next.js 15** (App Router), **Auth0**, **Tailwind CSS**, and **NextUI**. It includes a collapsible sidebar, avatar menu (theme + language + guide + logout), sample charts, bilingual UI, and CI-ready scripts.

Designed to clone and extend quickly for internal tools, admin panels, and SaaS dashboards.

### ✨ Features
- **Authentication** — Auth0 with middleware-protected routes and JWT cookie caching for faster navigation
- **Light / Dark themes** — Manual toggle in the avatar menu (`next-themes`, persisted; no system theme)
- **Internationalization (i18n)** — Spanish and English via dictionary files; locale stored in `localStorage` + cookie (SSR metadata)
- **Collapsible sidebar** — Expand/collapse with persisted width; prefetch on mount
- **Single client route for sections** — `home/[[...section]]` (Dashboard, Costs, IAM) for instant section switches
- **Sample charts** — Recharts bar/area charts on Dashboard with theme-aware colors
- **Site guide** — `/guide` page (bilingual), opened from the avatar menu in a new tab
- **Responsive layout** — No fixed `min-width`; mobile-friendly content shell
- **Error pages** — Branded 404 and error boundaries with i18n
- **Accessibility** — Focus trap, keyboard navigation, and ARIA on the avatar menu
- **Atomic design** — `atoms` / `molecules` / `organism` component structure
- **Co-located styles** — `styles.ts` per component + shared tokens in `src/styles/`
- **CI** — GitHub Actions workflow (lint + build)

### 🛠️ Tech stack
| Area | Technology |
|------|------------|
| Framework | Next.js **15.5.x** (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| UI | NextUI (`@nextui-org/react`) |
| Auth | Auth0 Next.js SDK 3.5 |
| Themes | next-themes 0.4 |
| Data fetching | TanStack React Query 5 |
| HTTP | Axios |
| Charts | Recharts 2.15 |
| Icons | React Icons |

### 📦 Prerequisites
- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun**
- An **Auth0** application (Regular Web Application)

### 🚀 Getting started
#### 1️⃣ Install dependencies
```bash
npm install
```

#### 2️⃣ Environment variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```env
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_SECRET=your_random_secret_min_32_chars
```

**Auth0 application settings** (Application → Settings):

| Setting | Value (local dev) |
|---------|-------------------|
| Allowed Callback URLs | `http://localhost:3000/api/auth/callback` |
| Allowed Logout URLs | `http://localhost:3000` |
| Allowed Web Origins | `http://localhost:3000` |

**Notes:**

- Do not wrap values in quotes in `.env`
- Generate `AUTH0_SECRET` with: `openssl rand -hex 32`
- `AUTH0_BASE_URL` must match the URL you use to open the app

#### 3️⃣ Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated users are redirected to Auth0 login; after login you land on `/home/dashboard`.

### 📜 Available scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

### 📁 Project structure
```
src/
├── app/
│   ├── api/auth/[auth0]/     # Auth0 route handler
│   ├── guide/                # Bilingual site guide (public)
│   ├── home/
│   │   ├── [[...section]]/   # Dashboard, costs, iam (single page)
│   │   ├── layout.tsx        # Sidebar + main
│   │   ├── loading.tsx       # Section skeleton
│   │   └── error.tsx         # Home error boundary
│   ├── layout.tsx            # Root layout, metadata, NavBar
│   ├── not-found.tsx         # 404 (i18n)
│   └── error.tsx             # Global error boundary
├── components/
│   ├── atoms/                # NavLink, Icons, Skeleton, …
│   ├── molecules/            # UserMenu
│   └── organism/             # NavBar, Sidebar, DashboardCharts, …
├── config/
│   ├── app.ts                # App name, description, default locale
│   ├── sidebar.ts            # Sidebar items (sectionKey + path)
│   └── siteGuide.ts          # Guide section IDs
├── context/                  # Language, Sidebar
├── i18n/
│   ├── dictionaries/         # es.ts, en.ts
│   ├── useTranslation.ts
│   └── getDictionary.ts
├── hooks/                    # useFocusTrap, …
├── provider/                 # Theme, Language, React Query, NextUI
├── styles/                   # globals, pageShell, cn, shared
└── middleware.ts             # Auth0 + JWT cookie refresh
.github/workflows/ci.yml        # Lint + build on push/PR
```

### 🗺️ Routes
| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Redirects to dashboard or login |
| `/home/dashboard` | Protected | Dashboard + sample charts |
| `/home/costs` | Protected | Costs placeholder |
| `/home/iam` | Protected | IAM users placeholder |
| `/guide` | Protected | Site guide (bilingual) |
| `/api/auth/*` | Auth0 | Login, logout, callback |

### 🔐 Authentication flow
1. User hits a protected route.
2. Middleware checks the `token` cookie; if valid, skips `getSession` (performance).
3. If the token is missing or near expiry, `getSession` runs and refreshes the cookie.
4. Unauthenticated users are redirected to Auth0 login.
5. After login, the user returns to the app with session + access token in cookies.

### 🎨 Customization
#### 🏷️ App branding
Edit `src/config/app.ts`:

```ts
export const appConfig = {
  name: 'Dashboard Template',
  description: '…',
  defaultLocale: 'es',
  // …
}
```

Root layout metadata and Open Graph use these values.

#### ➕ Add a new sidebar section
1. Add `sectionKey` to `SectionKey` in `src/i18n/types.ts`.
2. Add labels in `src/i18n/dictionaries/es.ts` and `en.ts` (`sections`, `homeContent`).
3. Register the item in `src/config/sidebar.ts` (`path`, `icon`).
4. Handle content in `src/components/organism/HomeSectionContent/index.tsx` (or a new organism).
5. Optional: add a block in `guide.sections` in both dictionaries.

No new `page.tsx` under `home/` is required — routing is handled by `[[...section]]`.

#### 🌙 Themes
- Toggle: avatar menu → **Appearance** → Light / Dark
- Default: light (`src/provider/index.tsx`)
- Palette: `brand_*` and `gray_*` in `tailwind.config.js`
- Co-located styles: prefer `styles.ts` + `dark:` variants

#### 🌐 Internationalization
- Dictionaries: `src/i18n/dictionaries/{es,en}.ts`
- Client: `useTranslation()` hook
- Server (metadata, 404): `getServerLocale()` reads the `dashboard-locale` cookie

### ☁️ Deployment
- `next.config.mjs` sets `output: 'standalone'` for Docker / container hosts.
- Set all `AUTH0_*` variables in your hosting provider.
- Update Auth0 callback/logout URLs for production domains.

### 🐛 Troubleshooting
**`issuerBaseURL must be a valid uri`**

- Remove quotes from `AUTH0_ISSUER_BASE_URL`
- Use `https://` and restart the dev server

**Auth redirect loop or login fails**

- Verify callback/logout URLs in Auth0
- Ensure `AUTH0_BASE_URL` matches the browser URL

**Guide or 404 shows wrong language**

- Change language in the avatar menu once so the cookie is set
- Or clear cookies and reload

### 📝 License
Agustina Fassina

---

## Español 🇪🇸
### 📋 Descripción
Plantilla de dashboard orientada a producción con **Next.js 15** (App Router), **Auth0**, **Tailwind CSS** y **NextUI**. Incluye sidebar colapsable, menú de avatar (tema + idioma + guía + logout), gráficos de ejemplo, UI bilingüe y scripts listos para CI.

Pensada para clonar y extender rápido en herramientas internas, paneles admin y dashboards SaaS.

### ✨ Características
- **Autenticación** — Auth0 con rutas protegidas por middleware y caché de JWT en cookie para navegación más rápida
- **Temas claro / oscuro** — Selector en el menú del avatar (`next-themes`, persistido; sin tema “system”)
- **Internacionalización (i18n)** — Español e inglés con diccionarios; locale en `localStorage` + cookie (metadata SSR)
- **Sidebar colapsable** — Expandir/colapsar; prefetch al montar
- **Ruta única por secciones** — `home/[[...section]]` (Dashboard, Costos, IAM) para cambios instantáneos
- **Gráficos de ejemplo** — Recharts en Dashboard con colores según tema
- **Guía del sitio** — Página `/guide` (bilingüe), enlace en el menú del avatar (nueva pestaña)
- **Layout responsive** — Sin `min-width` fijo; contenido usable en móvil
- **Páginas de error** — 404 y límites de error con i18n
- **Accesibilidad** — Focus trap y teclado en el menú del avatar
- **Atomic design** — Estructura `atoms` / `molecules` / `organism`
- **Estilos co-localizados** — `styles.ts` por componente + tokens en `src/styles/`
- **CI** — Workflow de GitHub Actions (lint + build)

### 🛠️ Stack tecnológico
| Área | Tecnología |
|------|------------|
| Framework | Next.js **15.5.x** (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 3.4 |
| UI | NextUI (`@nextui-org/react`) |
| Auth | Auth0 Next.js SDK 3.5 |
| Temas | next-themes 0.4 |
| Datos | TanStack React Query 5 |
| HTTP | Axios |
| Gráficos | Recharts 2.15 |
| Iconos | React Icons |

### 📦 Requisitos previos

- **Node.js** 18.x o superior
- **npm**, **yarn**, **pnpm** o **bun**
- Una aplicación **Auth0** (Regular Web Application)

### 🚀 Comenzar
#### 1️⃣ Instalar dependencias
```bash
npm install
```

#### 2️⃣ Variables de entorno
Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

```env
AUTH0_ISSUER_BASE_URL=https://tu-tenant.auth0.com
AUTH0_CLIENT_ID=tu_client_id
AUTH0_CLIENT_SECRET=tu_client_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_SECRET=tu_secreto_aleatorio_min_32_caracteres
```

**Configuración en Auth0** (Application → Settings):

| Campo | Valor (desarrollo local) |
|-------|--------------------------|
| Allowed Callback URLs | `http://localhost:3000/api/auth/callback` |
| Allowed Logout URLs | `http://localhost:3000` |
| Allowed Web Origins | `http://localhost:3000` |

**Importante:**

- No uses comillas en los valores del `.env`
- Genera `AUTH0_SECRET` con: `openssl rand -hex 32`
- `AUTH0_BASE_URL` debe coincidir con la URL con la que abrís la app

#### 3️⃣ Servidor de desarrollo
```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). Si no hay sesión, redirige a Auth0; tras el login llegás a `/home/dashboard`.

### 📜 Scripts disponibles
| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |

### 📁 Estructura del proyecto
```
src/
├── app/
│   ├── api/auth/[auth0]/     # Handler de Auth0
│   ├── guide/                # Guía del sitio (bilingüe)
│   ├── home/
│   │   ├── [[...section]]/   # dashboard, costs, iam
│   │   ├── layout.tsx        # Sidebar + main
│   │   ├── loading.tsx       # Skeleton de carga
│   │   └── error.tsx         # Error boundary del home
│   ├── layout.tsx            # Layout raíz, metadata, NavBar
│   ├── not-found.tsx         # 404 (i18n)
│   └── error.tsx             # Error boundary global
├── components/
│   ├── atoms/
│   ├── molecules/            # UserMenu
│   └── organism/             # NavBar, Sidebar, DashboardCharts, …
├── config/
│   ├── app.ts                # Nombre, descripción, locale por defecto
│   ├── sidebar.ts            # Ítems del sidebar
│   └── siteGuide.ts          # IDs de secciones de la guía
├── context/                  # Language, Sidebar
├── i18n/dictionaries/        # es.ts, en.ts
├── hooks/
├── provider/
├── styles/
└── middleware.ts
.github/workflows/ci.yml
```

### 🗺️ Rutas
| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Pública | Redirige al dashboard o al login |
| `/home/dashboard` | Protegida | Dashboard + gráficos de ejemplo |
| `/home/costs` | Protegida | Placeholder de costos |
| `/home/iam` | Protegida | Placeholder de usuarios IAM |
| `/guide` | Protegida | Guía del sitio (bilingüe) |
| `/api/auth/*` | Auth0 | Login, logout, callback |

### 🔐 Flujo de autenticación
1. El usuario accede a una ruta protegida.
2. El middleware revisa la cookie `token`; si es válida, evita `getSession` (rendimiento).
3. Si falta o está por vencer, ejecuta `getSession` y actualiza la cookie.
4. Sin sesión, redirige al login de Auth0.
5. Tras el login, vuelve a la app con sesión y access token en cookies.

### 🎨 Personalización
#### 🏷️ Branding de la app
Editá `src/config/app.ts` (nombre, descripción, locale por defecto). El layout raíz usa esos valores en metadata y Open Graph.

#### ➕ Agregar una sección al sidebar
1. Sumar `sectionKey` en `src/i18n/types.ts`.
2. Traducciones en `src/i18n/dictionaries/es.ts` y `en.ts` (`sections`, `homeContent`).
3. Ítem en `src/config/sidebar.ts`.
4. Contenido en `src/components/organism/HomeSectionContent/index.tsx` (u organismo nuevo).
5. Opcional: bloque en `guide.sections` en ambos diccionarios.

No hace falta crear `page.tsx` en `home/` — la ruta catch-all `[[...section]]` ya lo resuelve.

#### 🌙 Temas
- Cambio: menú del avatar → **Apariencia** → Claro / Oscuro
- Por defecto: claro
- Colores: `brand_*` y `gray_*` en `tailwind.config.js`

#### 🌐 Internacionalización
- Diccionarios: `src/i18n/dictionaries/{es,en}.ts`
- Cliente: hook `useTranslation()`
- Servidor (metadata, 404): `getServerLocale()` lee la cookie `dashboard-locale`

### ☁️ Despliegue
- `output: 'standalone'` en `next.config.mjs` para Docker.
- Configurá todas las variables `AUTH0_*` en el hosting.
- Actualizá callbacks y logout URLs en Auth0 para producción.

### 🐛 Solución de problemas
**Error `issuerBaseURL must be a valid uri`**

- Sin comillas en `AUTH0_ISSUER_BASE_URL`
- URL con `https://` y reiniciar el servidor

**Login o redirect en bucle**

- Revisar callback/logout en Auth0
- `AUTH0_BASE_URL` igual a la URL del navegador

**Guía o 404 en idioma incorrecto**

- Cambiá el idioma una vez desde el menú del avatar (setea la cookie)
- O borrá cookies y recargá

### 📝 Licencia
Agustina Fassina
