"""Cliente MAPFRE Panamá: token OAuth (password grant) y llamadas REST."""

from __future__ import annotations

import base64

import httpx

from app.config import settings


def _b64_utf8(value: str) -> str:
    """MAPFRE Panamá exige username y password en Base64 (UTF-8) en el token."""
    return base64.b64encode(value.encode("utf-8")).decode("ascii")


def _mapfre_http_error_detail(exc: httpx.HTTPStatusError) -> str:
    r = exc.response
    body = (r.text or "")[:800]
    return f"MAPFRE HTTP {r.status_code} {r.request.url!s}: {body or '(sin cuerpo)'}"


class MapfreClient:
    def __init__(self) -> None:
        self._token_url = settings.mapfre_token_url.rstrip("/")
        self._api_base = settings.mapfre_api_base.rstrip("/")

    def configured(self) -> bool:
        return bool(settings.mapfre_username and settings.mapfre_password)

    async def get_token(self) -> dict:
        if not self.configured():
            raise ValueError("MAPFRE_USERNAME y MAPFRE_PASSWORD deben estar en .env")
        data: dict[str, str] = {
            "grant_type": "password",
            "username": _b64_utf8(settings.mapfre_username),
            "password": _b64_utf8(settings.mapfre_password),
        }
        if settings.mapfre_client_id:
            data["client_id"] = settings.mapfre_client_id
        if settings.mapfre_client_secret:
            data["client_secret"] = settings.mapfre_client_secret
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(
                self._token_url,
                data=data,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            try:
                r.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise RuntimeError(_mapfre_http_error_detail(e)) from e
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
            try:
                r.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise RuntimeError(_mapfre_http_error_detail(e)) from e
            return r.json() if r.content else {}


mapfre_client = MapfreClient()
