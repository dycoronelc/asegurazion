"""Cliente SURA Panamá: token OAuth (client_credentials) + login corredor."""

from __future__ import annotations

import httpx

from app.config import settings


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
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            r.raise_for_status()
            return r.json()

    async def generar_token_usuario(self, oauth_access_token: str) -> dict:
        """Paso 2: POST /sbus/GenerarTokenUsuario (nombres de campos según manual SURA v1.2)."""
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
                headers={"Authorization": f"Bearer {oauth_access_token}"},
            )
            r.raise_for_status()
            return r.json() if r.content else {}


sura_client = SuraClient()
