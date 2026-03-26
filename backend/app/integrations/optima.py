"""Cliente Óptima — SOAP cartera corredor (TopLink / WebServices)."""

from __future__ import annotations

from typing import Any

from zeep import Client
from zeep.transports import Transport

from app.config import settings


class OptimaSoapClient:
    def __init__(self) -> None:
        self._wsdl = settings.optima_cartera_wsdl

    def configured(self) -> bool:
        return bool(settings.optima_corredor_code)

    def _client(self) -> Client:
        transport = Transport(timeout=120)
        return Client(self._wsdl, transport=transport)

    def cartera(self) -> Any:
        """Invoca operación de cartera; el nombre exacto depende del WSDL publicado."""
        if not self.configured():
            raise ValueError("OPTIMA_CORREDOR_CODE debe estar en .env")
        c = self._client()
        svc = c.service
        op = getattr(svc, "CarteraCorredor", None) or getattr(svc, "carteraCorredor", None)
        if op is None:
            available = [x for x in dir(svc) if not x.startswith("_")]
            raise NotImplementedError(
                f"No se encontró operación CarteraCorredor en el WSDL. Disponibles: {available[:20]}"
            )
        return op(CodigoCorredor=settings.optima_corredor_code)


optima_client = OptimaSoapClient()
