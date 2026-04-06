import asyncio
from datetime import date

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.integrations.iseguros import iseguros_client
from app.integrations.mapfre import mapfre_client, mapfre_http_error_detail
from app.integrations.optima import optima_client
from app.integrations.sura import sura_client

_cors = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]

app = FastAPI(
    title="AseguraZion API",
    description="Backend para integraciones con aseguradoras (MAPFRE, SURA, Internacional, Óptima).",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/integrations/status")
async def integrations_status():
    return {
        "mapfre": {"configured": mapfre_client.configured()},
        "sura": {
            "oauth_configured": sura_client.configured_oauth(),
            "full_configured": sura_client.configured_full(),
        },
        "iseguros": {"configured": iseguros_client.configured()},
        "optima": {"configured": optima_client.configured()},
    }


@app.post("/integrations/mapfre/token")
async def mapfre_token():
    try:
        return await mapfre_client.get_token()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except httpx.HTTPStatusError as e:
        # Por si el error escapa sin convertirse en RuntimeError (p. ej. versión antigua desplegada)
        raise HTTPException(status_code=502, detail=mapfre_http_error_detail(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Error de red hacia MAPFRE: {e!s}") from e
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@app.get("/integrations/mapfre/produccion")
async def mapfre_produccion(
    fecha_desde: str = Query(..., description="YYYY-MM-DD"),
    fecha_hasta: str = Query(..., description="YYYY-MM-DD"),
):
    try:
        tok = await mapfre_client.get_token()
        access = tok.get("access_token")
        if not access:
            raise HTTPException(status_code=502, detail="Respuesta sin access_token")
        data = await mapfre_client.get_produccion(access, fecha_desde, fecha_hasta)
        return data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except HTTPException:
        raise
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=mapfre_http_error_detail(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Error de red hacia MAPFRE: {e!s}") from e
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@app.post("/integrations/sura/token")
async def sura_token():
    try:
        return await sura_client.get_client_token()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@app.post("/integrations/sura/user-token")
async def sura_user_token():
    try:
        tok = await sura_client.get_client_token()
        access = tok.get("access_token")
        if not access:
            raise HTTPException(status_code=502, detail="OAuth sin access_token")
        return await sura_client.generar_token_usuario(access)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@app.get("/integrations/iseguros/produccion")
async def iseguros_produccion(
    fec_desde: date = Query(...),
    fec_hasta: date = Query(...),
):
    try:
        return await asyncio.to_thread(iseguros_client.produccion, fec_desde, fec_hasta)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@app.get("/integrations/optima/cartera")
async def optima_cartera():
    try:
        return await asyncio.to_thread(optima_client.cartera)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except NotImplementedError as e:
        raise HTTPException(status_code=501, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
