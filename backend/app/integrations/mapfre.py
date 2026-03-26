"""Cliente MAPFRE Panamá: token OAuth (password grant) y llamadas REST."""

from __future__ import annotations

import httpx

from app.config import settings


class MapfreClient:
    def __init__(self) -> None:
        self._token_url = settings.mapfre_token_url.rstrip("/")
        self._api_base = settings.mapfre_api_base.rstrip("/")

    def configured(self) -> bool:
        return bool(settings.mapfre_username and settings.mapfre_password)

    async def get_token(self) -> dict:
        if not self.configured():
            raise ValueError("MAPFRE_USERNAME y MAPFRE_PASSWORD deben estar en .env")
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(
                self._token_url,
                data={
                    "grant_type": "password",
                    "username": settings.mapfre_username,
                    "password": settings.mapfre_password,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            r.raise_for_status()
            return r.json()

    async def get_produccion(self, access_token: str, fecha_desde: str, fecha_hasta: str) -> dict:
        """POST api/apiexterno/MAPFRE/produccion (INFORME_TECNICO.md)."""
        url = f"{self._api_base}/api/apiexterno/MAPFRE/produccion"
        async with httpx.AsyncClient(timeout=120.0) as client:
            r = await client.post(
                url,
                json={"fechaDesde": fecha_desde, "fechaHasta": fecha_hasta},
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json",
                },
            )
            r.raise_for_status()
            return r.json() if r.content else {}


mapfre_client = MapfreClient()
