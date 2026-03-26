"""Cliente Internacional de Seguros — SOAP descargas.asmx (Produccion, etc.)."""

from __future__ import annotations

from datetime import date
from typing import Any

from zeep import Client
from zeep.transports import Transport

from app.config import settings


class IsegurosSoapClient:
    def __init__(self) -> None:
        self._wsdl = settings.iseguros_wsdl

    def configured(self) -> bool:
        return bool(settings.iseguros_ws_key)

    def _client(self) -> Client:
        transport = Transport(timeout=120)
        return Client(self._wsdl, transport=transport)

    def produccion(self, fec_desde: date, fec_hasta: date) -> Any:
        if not self.configured():
            raise ValueError("ISEGUROS_WS_KEY debe estar en .env")
        c = self._client()
        return c.service.Produccion(
            Var_Fec_Desde=fec_desde,
            Var_Fec_Hasta=fec_hasta,
            Var_Clave=settings.iseguros_ws_key,
        )


iseguros_client = IsegurosSoapClient()
