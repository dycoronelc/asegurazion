# Despliegue en Railway (monorepo: API + web)

Este repositorio tiene **dos aplicaciones** en la misma raíz:

| Carpeta     | Rol                          |
|------------|------------------------------|
| `backend/` | FastAPI (integraciones aseguradoras) |
| `frontend/`| React + Vite (SPA)           |

En Railway se montan como **dos servicios** dentro de **un solo proyecto**, cada uno con su **Root Directory** y dominio público.

## 1. Crear el proyecto y los servicios

1. En [Railway](https://railway.com): **New project** → **Empty project** (o importar el repo y luego ajustar).
2. Añade **dos servicios** desde el mismo repositorio GitHub/GitLab.
3. Renómbralos para que coincidan con las variables de referencia de abajo, por ejemplo:
   - **`api`** → backend
   - **`web`** → frontend

## 2. Root Directory

En **Settings** de cada servicio:

| Servicio | Root Directory |
|----------|----------------|
| `api`    | `backend`      |
| `web`    | `frontend`     |

## 3. Variables de entorno

### Servicio `web` (frontend)

Necesarias en **build** (Vite inyecta `VITE_*` en tiempo de compilación):

| Nombre | Valor sugerido |
|--------|----------------|
| `VITE_API_BASE_URL` | `https://${{api.RAILWAY_PUBLIC_DOMAIN}}` |

Railway sustituye la referencia por el dominio público del servicio `api`. Si el servicio backend tiene otro nombre, cambia `api` por ese nombre en la referencia.

Opcional en local: copia `frontend/.env.example` a `frontend/.env` y usa `http://127.0.0.1:8000`.

### Servicio `api` (backend)

| Nombre | Valor sugerido |
|--------|----------------|
| `CORS_ORIGINS` | `https://${{web.RAILWAY_PUBLIC_DOMAIN}}` |

Añade también las credenciales de integraciones según `backend/.env.example` (MAPFRE, SURA, etc.). **No** subas secretos al repositorio.

## 4. Dominios públicos

En cada servicio: **Settings → Networking → Generate Domain** para obtener HTTPS.

Orden recomendado: despliega primero `api`, genera su dominio, luego configura `VITE_API_BASE_URL` en `web` y despliega `web`. Actualiza `CORS_ORIGINS` en `api` con el dominio de `web` y vuelve a desplegar `api` si hace falta.

## 5. Comandos (referencia)

Los archivos `railway.toml` en `backend/` y `frontend/` fijan arranque, healthcheck y rutas de observación de cambios. El backend usa `Procfile` + `uvicorn`; el frontend usa `npm run start` → `vite preview` sirviendo `dist/` con el puerto `PORT` de Railway.

## 6. Comprobaciones

- API: `GET https://<dominio-api>/health` → `{"status":"ok"}`
- Web: abrir el dominio del frontend en el navegador.

Cuando el frontend consuma el API, usa `API_BASE_URL` desde `src/lib/api-config.ts` (basado en `VITE_API_BASE_URL`).
