from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Orígenes permitidos para el frontend (Firebase Hosting, local, etc.), separados por coma
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    mapfre_token_url: str = "https://app1.mapfre.com.pa/panama/webapi/token"
    mapfre_api_base: str = "https://app1.mapfre.com.pa/panama/webapi"
    mapfre_username: str = ""
    mapfre_password: str = ""
    # Algunos entornos OAuth exigen client_id / client_secret; déjalos vacíos si no aplican
    mapfre_client_id: str = ""
    mapfre_client_secret: str = ""
    # true = MAPFRE_USERNAME / MAPFRE_PASSWORD ya vienen en Base64 en el .env (no volver a codificar)
    mapfre_credentials_already_base64: bool = False
    # Header obligatorio en el POST al token (documentación MAPFRE Panamá / Postman)
    mapfre_tipo_validacion: str = "PASSWORD"
    # Producción: muchos entornos MAPFRE exigen el usuario WS en el JSON además del Bearer
    mapfre_produccion_incluir_usuario: bool = True
    # Si true, fechaDesde/fechaHasta se envían como DD/MM/YYYY (entrada del API sigue siendo YYYY-MM-DD en query)
    mapfre_produccion_fechas_dd_mm_yyyy: bool = False

    sura_oauth_url: str = "https://iservice01.segurossura.com.pa/TokenService/resources/tokenservice"
    sura_client_id: str = ""
    sura_client_secret: str = ""
    sura_corredor_user: str = ""
    sura_corredor_password: str = ""
    sura_api_base: str = "https://iservice01.segurossura.com.pa"

    iseguros_wsdl: str = "https://www.iseguros.com/corredor_web2/descargas.asmx?wsdl"
    iseguros_ws_key: str = ""

    optima_cartera_wsdl: str = (
        "https://www1.optinet.com.pa/WsCarteraCorredor-WebServices-context-root/"
        "WebServices_TopLinkPlSqlProviderService?WSDL"
    )
    optima_corredor_code: str = ""

    # ASSA (Azure APIM) — sandbox por defecto; producción: URLs del portal developer.assanet.com
    assa_token_url: str = "https://apidev.assanet.com/authentication-ms/connect/token"
    assa_gateway_base: str = "https://apidev.assanet.com/gateway/uri"
    assa_client_id: str = ""
    assa_client_secret: str = ""
    assa_username: str = ""
    assa_password: str = ""
    assa_application_key: str = ""


settings = Settings()
