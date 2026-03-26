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
3. Renómbralos (o elige nombres fijos y usa **esos** nombres en las referencias `${{...}}`), por ejemplo:
   - **`api`** → backend
   - **`asegurazion`** (u otro nombre) → frontend

## 2. Root Directory

En **Settings** de cada servicio:

| Servicio (ejemplo) | Root Directory |
|--------------------|----------------|
| `api`              | `backend`      |
| `asegurazion`      | `frontend`     |

## 3. Variables de entorno

### Servicio del frontend (ej. `asegurazion`)

Necesarias en **build** (Vite inyecta `VITE_*` en tiempo de compilación):

| Nombre | Valor sugerido |
|--------|----------------|
| `VITE_API_BASE_URL` | `https://${{api.RAILWAY_PUBLIC_DOMAIN}}` |

Railway sustituye la referencia por el dominio público del servicio `api`. Si el servicio backend tiene otro nombre, cambia `api` por ese nombre en la referencia.

Opcional en local: copia `frontend/.env.example` a `frontend/.env` y usa `http://127.0.0.1:8000`.

### Servicio `api` (backend)

| Nombre | Valor sugerido |
|--------|----------------|
| `CORS_ORIGINS` | `https://${{asegurazion.RAILWAY_PUBLIC_DOMAIN}}` (ajusta el nombre del servicio si no es `asegurazion`) |

Añade también las credenciales de integraciones según `backend/.env.example` (MAPFRE, SURA, etc.). **No** subas secretos al repositorio.

## 4. Dominios públicos

En cada servicio: **Settings → Networking → Generate Domain** para obtener HTTPS.

Orden recomendado: despliega primero el servicio del **backend**, genera su dominio, luego configura `VITE_API_BASE_URL` en el servicio del **frontend** (p. ej. `asegurazion`) y despliega el front. Actualiza `CORS_ORIGINS` en el API con el dominio del front y vuelve a desplegar el API si hace falta. Si renombraste los servicios, usa en las referencias `${{NombreExactoEnRailway.RAILWAY_PUBLIC_DOMAIN}}`.

## 5. Comandos (referencia)

Los archivos `railway.toml` en `backend/` y `frontend/` fijan arranque, healthcheck y rutas de observación de cambios. El backend usa `uvicorn` en el puerto `PORT`. El frontend ejecuta `npm run start`, que llama a `scripts/serve-production.mjs` y sirve `dist/` con **`serve`** escuchando en **`0.0.0.0:$PORT`** (obligatorio en Railway; escuchar solo en `localhost` provoca **502 Bad Gateway** en el dominio público).

## 6. Comprobaciones

- API: `GET https://<dominio-api>/health` → `{"status":"ok"}`
- Web: abrir el dominio del frontend en el navegador.

### Si el front devuelve 502

Comprueba en los logs del deploy una línea como `Accepting connections at http://0.0.0.0:<puerto>` (no solo `localhost`). El **Networking → Port** del servicio debe coincidir con el puerto que asigna Railway (`PORT`), suele ser **3000**.

Cuando el frontend consuma el API, usa `API_BASE_URL` desde `src/lib/api-config.ts` (basado en `VITE_API_BASE_URL`).
