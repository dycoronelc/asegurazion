"""Cliente ASSA (Azure APIM / NASSA): OAuth password grant + Application-Key para el gateway.

URIs de recursos del gateway: documentar desde sandbox.assanet.com → APIs → Try it.
"""

from __future__ import annotations

import httpx

from app.config import settings


def assa_http_error_detail(exc: httpx.HTTPStatusError) -> str:
    r = exc.response
    body = (r.text or "")[:1200]
    return f"ASSA HTTP {r.status_code} {r.request.url!s}: {body or '(sin cuerpo)'}"


class AssaClient:
    def __init__(self) -> None:
        self._token_url = settings.assa_token_url.rstrip("/")
        self._gateway_base = settings.assa_gateway_base.rstrip("/")

    def token_configured(self) -> bool:
        return bool(
            settings.assa_client_id
            and settings.assa_client_secret
            and settings.assa_username
            and settings.assa_password
        )

    def gateway_ready(self) -> bool:
        return self.token_configured() and bool(settings.assa_application_key)

    async def get_token(self) -> dict:
        if not self.token_configured():
            raise ValueError(
                "ASSA_CLIENT_ID, ASSA_CLIENT_SECRET, ASSA_USERNAME y ASSA_PASSWORD deben estar en .env"
            )
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(
                self._token_url,
                data={
                    "grant_type": "password",
                    "client_id": settings.assa_client_id,
                    "client_secret": settings.assa_client_secret,
                    "username": settings.assa_username,
                    "password": settings.assa_password,
                },
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                },
            )
            try:
                r.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise RuntimeError(assa_http_error_detail(e)) from e
            return r.json()

    async def gateway_get(self, request_path: str, access_token: str) -> dict | list:
        """GET a {gateway_base}/{request_path} con Bearer + Application-Key (request_path sin slash inicial)."""
        if not settings.assa_application_key:
            raise ValueError("ASSA_APPLICATION_KEY requerido para llamadas al gateway")
        path = request_path.lstrip("/")
        url = f"{self._gateway_base}/{path}"
        async with httpx.AsyncClient(timeout=120.0) as client:
            r = await client.get(
                url,
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Application-Key": settings.assa_application_key,
                    "Accept": "application/json",
                },
            )
            try:
                r.raise_for_status()
            except httpx.HTTPStatusError as e:
                raise RuntimeError(assa_http_error_detail(e)) from e
            return r.json() if r.content else {}


assa_client = AssaClient()
