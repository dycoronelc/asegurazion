"""Cliente SURA Panamá: OAuth client_credentials → GenerarTokenUsuario → APIs /sbus/Corredores/*."""

from __future__ import annotations

from datetime import datetime

import httpx

from app.config import settings


def sura_http_error_detail(exc: httpx.HTTPStatusError) -> str:
    r = exc.response
    body = (r.text or "")[:1200]
    return f"SURA HTTP {r.status_code} {r.request.url!s}: {body or '(sin cuerpo)'}"


def _sura_instant_desde(fecha_yyyy_mm_dd: str) -> str:
    d = datetime.strptime(fecha_yyyy_mm_dd.strip(), "%Y-%m-%d")
    return d.strftime("%Y-%m-%dT00:00:00.000-0500")


def _sura_instant_hasta(fecha_yyyy_mm_dd: str) -> str:
    d = datetime.strptime(fecha_yyyy_mm_dd.strip(), "%Y-%m-%d")
    return d.strftime("%Y-%m-%dT23:59:59.999-0500")


def _validar_rango_mensual(fecha_desde: str, fecha_hasta: str, max_days: int = 32) -> None:
    d1 = datetime.strptime(fecha_desde.strip(), "%Y-%m-%d").date()
    d2 = datetime.strptime(fecha_hasta.strip(), "%Y-%m-%d").date()
    if d2 < d1:
        raise ValueError("fecha_hasta debe ser >= fecha_desde")
    if (d2 - d1).days > max_days:
        raise ValueError(
            f"SURA limita el rango de fechas (documentación: máx. ~1 mes). "
            f"Rango actual: {(d2 - d1).days + 1} días; máximo permitido aquí: {max_days + 1} días."
        )


def _extraer_token_usuario(resp: dict) -> str | None:
    """Localiza el JWT/token de usuario en la respuesta de GenerarTokenUsuario (nombres variables en v1.2)."""
    if not isinstance(resp, dict):
        return None
    for key in (
        "access_token",
        "token",
        "TOKEN",
        "Token",
        "jwt",
        "JWT",
        "tokenUsuario",
        "TOKEN_USUARIO",
    ):
        v = resp.get(key)
        if isinstance(v, str) and v.strip():
            return v.strip()
    for nest in ("data", "DATA", "resultado", "RESULTADO", "response", "Response"):
        inner = resp.get(nest)
        if isinstance(inner, dict):
            t = _extraer_token_usuario(inner)
            if t:
                return t
    return None


class SuraClient:
    def __init__(self) -> None:
        self._oauth_url = settings.sura_oauth_url.rstrip("/")
        self._api_base = settings.sura_api_base.rstrip("/")

    def configured_oauth(self) -> bool:
        return bool(settings.sura_client_id and settings.sura_client_secret)

    def configured_full(self) -> bool:
        return self.configured_oauth() and bool(
            settings.sura_corredor_user and settings.sura_corredor_password
        )

    async def get_client_token(self) -> dict:
        if not self.configured_oauth():
            raise ValueError("SURA_CLIENT_ID y SURA_CLIENT_SECRET deben estar en .env")
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(
                self._oauth_url,
                data={
                    "grant_type": "client_credentials",
                    "client_id": settings.sura_client_id,
                    "client_secret": settings.sura_client_secret,
                },
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                },
            )
            try:
                r.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise RuntimeError(sura_http_error_detail(e)) from e
            return r.json()

    async def generar_token_usuario(self, oauth_access_token: str) -> dict:
        if not settings.sura_corredor_user or not settings.sura_corredor_password:
            raise ValueError("SURA_CORREDOR_USER y SURA_CORREDOR_PASSWORD requeridos")
        url = f"{self._api_base}/sbus/GenerarTokenUsuario"
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(
                url,
                json={
                    "USUARIO": settings.sura_corredor_user,
                    "PASSWORD": settings.sura_corredor_password,
                },
                headers={
                    "Authorization": f"Bearer {oauth_access_token}",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            )
            try:
                r.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise RuntimeError(sura_http_error_detail(e)) from e
            return r.json() if r.content else {}

    async def _token_usuario_bearer(self) -> str:
        tok = await self.get_client_token()
        client_access = tok.get("access_token")
        if not client_access:
            raise RuntimeError("SURA OAuth no devolvió access_token")
        user_resp = await self.generar_token_usuario(client_access)
        user_token = _extraer_token_usuario(user_resp)
        if not user_token:
            raise RuntimeError(
                "No se pudo extraer el token de usuario de GenerarTokenUsuario. "
                f"Claves en respuesta: {list(user_resp.keys()) if isinstance(user_resp, dict) else type(user_resp)}. "
                "Revisar manual SURA v1.2 o pegar un fragmento de la respuesta (sin secretos)."
            )
        return user_token

    async def _post_corredores(
        self,
        operacion: str,
        fecha_desde: str,
        fecha_hasta: str,
        nro_pagina: int = 1,
        cuerpo_extra: dict | None = None,
    ) -> dict | list:
        """
        POST /sbus/Corredores/{operacion}
        Cuerpo base: FECHA_DESDE, FECHA_HASTA, NRO_PAGINA (convención típica; ajustar si el PDF difiere).
        """
        if not self.configured_full():
            raise ValueError(
                "Se requieren SURA_CLIENT_ID, SURA_CLIENT_SECRET, SURA_CORREDOR_USER y SURA_CORREDOR_PASSWORD"
            )
        _validar_rango_mensual(fecha_desde, fecha_hasta)
        bearer = await self._token_usuario_bearer()
        url = f"{self._api_base}/sbus/Corredores/{operacion}"
        body: dict = {
            "FECHA_DESDE": _sura_instant_desde(fecha_desde),
            "FECHA_HASTA": _sura_instant_hasta(fecha_hasta),
            "NRO_PAGINA": nro_pagina,
        }
        if cuerpo_extra:
            body.update(cuerpo_extra)
        async with httpx.AsyncClient(timeout=120.0) as client:
            r = await client.post(
                url,
                json=body,
                headers={
                    "Authorization": f"Bearer {bearer}",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            )
            try:
                r.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise RuntimeError(sura_http_error_detail(e)) from e
            return r.json() if r.content else {}

    async def obtener_polizas_corredores(
        self, fecha_desde: str, fecha_hasta: str, nro_pagina: int = 1
    ) -> dict | list:
        return await self._post_corredores(
            "ObtenerPolizasCorredores", fecha_desde, fecha_hasta, nro_pagina
        )

    async def obtener_polizas_auto(
        self, fecha_desde: str, fecha_hasta: str, nro_pagina: int = 1
    ) -> dict | list:
        return await self._post_corredores("ObtenerPolizasAuto", fecha_desde, fecha_hasta, nro_pagina)

    async def obtener_morosidad(
        self, fecha_desde: str, fecha_hasta: str, nro_pagina: int = 1
    ) -> dict | list:
        return await self._post_corredores("ObtenerMorosidad", fecha_desde, fecha_hasta, nro_pagina)

    async def obtener_pagos(
        self, fecha_desde: str, fecha_hasta: str, nro_pagina: int = 1
    ) -> dict | list:
        return await self._post_corredores("ObtenerPagos", fecha_desde, fecha_hasta, nro_pagina)

    async def obtener_comisiones(
        self, fecha_desde: str, fecha_hasta: str, nro_pagina: int = 1
    ) -> dict | list:
        return await self._post_corredores("ObtenerComisiones", fecha_desde, fecha_hasta, nro_pagina)


sura_client = SuraClient()
