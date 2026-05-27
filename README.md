# AWS Dashboard App

[English](#english) | [Español](#español)

---

## English

### Description

Frontend UI for an **AWS Dashboard API**. The app authenticates users with Auth0, calls the backend over HTTP (Axios + React Query), and presents AWS-related views in a responsive dashboard layout.

The repository currently includes **scaffolding**: routing, layout, auth, and HTTP client are in place; feature pages are placeholders ready to wire to the API.

### Planned views (scaffolding)

| Section    | Route            | Status        |
| ---------- | ---------------- | ------------- |
| Dashboard  | `/home/dashboard` | Placeholder   |
| Costs      | `/home/costs`     | Placeholder   |
| IAM users  | `/home/iam`       | Placeholder   |

### Features

- **Auth0** — Login, session, and access token stored for API calls
- **AWS API client** — Axios instance with Bearer token (`NEXT_PUBLIC_API_BASE_URL`)
- **React Query** — Ready for server state and caching
- **Dashboard shell** — Sidebar, navbar, dark mode, responsive layout
- **TypeScript** — Typed interfaces and shared utilities

### Tech stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **UI:** HeroUI / NextUI
- **Auth:** Auth0 Next.js SDK
- **Data:** TanStack React Query, Axios
- **Charts:** Recharts (for future metrics)

### Architecture

```text
Browser (Next.js UI)
    │
    ├── Auth0 ──► login / session / access token (cookie: token)
    │
    └── Axios (axiosBase) ──► AWS Dashboard API
            Authorization: Bearer <token>
            baseURL: NEXT_PUBLIC_API_BASE_URL
```

The **backend API** is a separate service. This repo only hosts the UI; point `NEXT_PUBLIC_API_BASE_URL` at your API (local or deployed).

### Prerequisites

- **Node.js** 18+
- **npm**, **yarn**, **pnpm**, or **bun**
- **Auth0** application (callback: `http://localhost:3000/api/auth/callback`)
- **AWS Dashboard API** running and reachable from the browser (CORS configured on the API if needed)

### Getting started

#### 1. Install dependencies

```bash
npm install
```

#### 2. Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```env
# Auth0
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_SECRET=your_random_secret_string

# AWS Dashboard API (backend)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Notes:

- Do not wrap values in quotes in `.env`.
- Generate `AUTH0_SECRET` with `openssl rand -hex 32` (or equivalent).
- `AUTH0_BASE_URL` must match the URL where this UI runs.
- `NEXT_PUBLIC_API_BASE_URL` is exposed to the client; use only for the public API base URL.

#### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Development server       |
| `npm run build`   | Production build         |
| `npm run start`   | Production server        |
| `npm run lint`    | ESLint                   |

### Project structure

```text
src/
├── app/
│   ├── api/auth/[auth0]/   # Auth0 route handlers
│   ├── home/               # Protected app area
│   │   ├── dashboard/      # Overview (scaffold)
│   │   ├── costs/          # Costs (scaffold)
│   │   ├── iam/            # IAM users (scaffold)
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── page.tsx
├── api/
│   └── axiosBase.ts        # API client + 401 → logout
├── components/
│   ├── atoms/
│   └── organism/           # NavBar, Sidebar
├── config/
│   └── sidebar.ts          # Navigation items
├── interfaces/
├── provider/               # React Query, theme, Axios interceptor
├── styles/
├── utils/
└── middleware.ts           # Auth0 session → token cookie
```

### Connecting to the AWS API

1. Start your **AWS Dashboard API** and set `NEXT_PUBLIC_API_BASE_URL`.
2. Use `axiosBase` from `src/api/axiosBase.ts` for authenticated requests (Bearer token from cookie).
3. Add hooks or services under `src/api/` (or feature folders) and consume them with React Query in pages under `src/app/home/`.
4. On **401**, the Axios interceptor redirects to logout.

Example (client component):

```tsx
import { useQuery } from '@tanstack/react-query'
import { axiosBase } from '@/api/axiosBase'

const { data } = useQuery({
  queryKey: ['iam-users'],
  queryFn: () => axiosBase.get('/iam/users').then((r) => r.data),
})
```

### Customization

**New sidebar route**

1. Add `src/app/home/<section>/page.tsx`.
2. Register the item in `src/config/sidebar.ts`.

**Styling**

Tailwind theme in `tailwind.config.js`; globals in `src/styles/globals.css`.

### Troubleshooting

| Issue | What to check |
| ----- | ------------- |
| `issuerBaseURL must be a valid uri` | `AUTH0_ISSUER_BASE_URL` has `https://`, no quotes; restart dev server |
| Login redirect fails | Auth0 callback URL includes `/api/auth/callback` |
| API calls fail / CORS | API allows origin `http://localhost:3000`; base URL in `.env` is correct |
| `No token available` | User must be logged in; middleware should set `token` cookie |

### License

Agustina Fassina

---

## Español

### Descripción

Interfaz web (**UI**) para una **API de AWS Dashboard**. La aplicación autentica con Auth0, consume el backend por HTTP (Axios + React Query) y muestra vistas relacionadas con AWS en un layout de dashboard responsive.

El repositorio incluye el **scaffolding** listo: rutas, layout, autenticación y cliente HTTP; las pantallas de negocio son placeholders para conectar con la API.

### Vistas previstas (scaffolding)

| Sección      | Ruta              | Estado        |
| ------------ | ----------------- | ------------- |
| Dashboard    | `/home/dashboard` | Placeholder   |
| Costos       | `/home/costs`     | Placeholder   |
| Usuarios IAM | `/home/iam`       | Placeholder   |

### Características

- **Auth0** — Login, sesión y token de acceso para llamadas a la API
- **Cliente API AWS** — Instancia Axios con Bearer (`NEXT_PUBLIC_API_BASE_URL`)
- **React Query** — Listo para estado remoto y caché
- **Shell del dashboard** — Sidebar, navbar, modo oscuro, diseño responsive
- **TypeScript** — Interfaces y utilidades compartidas

### Stack tecnológico

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS 3
- **UI:** HeroUI / NextUI
- **Auth:** Auth0 Next.js SDK
- **Datos:** TanStack React Query, Axios
- **Gráficos:** Recharts (métricas futuras)

### Arquitectura

```text
Navegador (UI Next.js)
    │
    ├── Auth0 ──► login / sesión / access token (cookie: token)
    │
    └── Axios (axiosBase) ──► API AWS Dashboard
            Authorization: Bearer <token>
            baseURL: NEXT_PUBLIC_API_BASE_URL
```

La **API backend** es un servicio aparte. Este repo solo contiene la UI; configurá `NEXT_PUBLIC_API_BASE_URL` apuntando a tu API (local o desplegada).

### Requisitos previos

- **Node.js** 18+
- **npm**, **yarn**, **pnpm** o **bun**
- Aplicación **Auth0** (callback: `http://localhost:3000/api/auth/callback`)
- **API AWS Dashboard** en ejecución y accesible desde el navegador (CORS en la API si aplica)

### Comenzar

#### 1. Instalar dependencias

```bash
npm install
```

#### 2. Variables de entorno

Copiá `.env.example` a `.env`:

```bash
cp .env.example .env
```

```env
# Auth0
AUTH0_ISSUER_BASE_URL=https://tu-dominio.auth0.com
AUTH0_CLIENT_ID=tu_client_id
AUTH0_CLIENT_SECRET=tu_client_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_SECRET=tu_cadena_secreta_aleatoria

# API AWS Dashboard (backend)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Notas:

- No uses comillas en los valores del `.env`.
- Generá `AUTH0_SECRET` con `openssl rand -hex 32` (o equivalente).
- `AUTH0_BASE_URL` debe coincidir con la URL donde corre esta UI.
- `NEXT_PUBLIC_API_BASE_URL` es visible en el cliente; usalo solo para la URL base pública de la API.

#### 3. Servidor de desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

### Scripts

| Comando           | Descripción              |
| ----------------- | ------------------------ |
| `npm run dev`     | Servidor de desarrollo   |
| `npm run build`   | Build de producción      |
| `npm run start`   | Servidor de producción   |
| `npm run lint`    | ESLint                   |

### Estructura del proyecto

```text
src/
├── app/
│   ├── api/auth/[auth0]/   # Handlers Auth0
│   ├── home/               # Área protegida
│   │   ├── dashboard/      # Resumen (scaffold)
│   │   ├── costs/          # Costos (scaffold)
│   │   ├── iam/            # Usuarios IAM (scaffold)
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── page.tsx
├── api/
│   └── axiosBase.ts        # Cliente API + 401 → logout
├── components/
│   ├── atoms/
│   └── organism/           # NavBar, Sidebar
├── config/
│   └── sidebar.ts          # Ítems de navegación
├── interfaces/
├── provider/               # React Query, tema, interceptor Axios
├── styles/
├── utils/
└── middleware.ts           # Sesión Auth0 → cookie token
```

### Conectar con la API AWS
1. Levantá la **API AWS Dashboard** y configurá `NEXT_PUBLIC_API_BASE_URL`.
2. Usá `axiosBase` en `src/api/axiosBase.ts` para requests autenticados (Bearer desde la cookie).
3. Agregá hooks o servicios en `src/api/` (o por feature) y consumilos con React Query en `src/app/home/`.
4. Ante **401**, el interceptor de Axios redirige al logout.

Ejemplo (componente cliente):

```tsx
import { useQuery } from '@tanstack/react-query'
import { axiosBase } from '@/api/axiosBase'

const { data } = useQuery({
  queryKey: ['iam-users'],
  queryFn: () => axiosBase.get('/iam/users').then((r) => r.data),
})
```

### Personalización
**Nueva ruta en el sidebar**

1. Creá `src/app/home/<seccion>/page.tsx`.
2. Registrá el ítem en `src/config/sidebar.ts`.

**Estilos**

Tema Tailwind en `tailwind.config.js`; globales en `src/styles/globals.css`.

### Solución de problemas
| Problema | Revisar |
| -------- | ------- |
| `issuerBaseURL must be a valid uri` | `AUTH0_ISSUER_BASE_URL` con `https://`, sin comillas; reiniciar dev server |
| Falla el redirect de login | Callback Auth0 incluye `/api/auth/callback` |
| Fallan llamadas API / CORS | API permite origen `http://localhost:3000`; URL base en `.env` correcta |
| `No token available` | Usuario logueado; middleware debe setear cookie `token` |

### Licencia
Agustina Fassina
