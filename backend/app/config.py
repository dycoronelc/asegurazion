from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Orígenes permitidos para el frontend (Firebase Hosting, local, etc.), separados por coma
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    mapfre_token_url: str = "https://app1.mapfre.com.pa/panama/webapi/token"
    mapfre_api_base: str = "https://app1.mapfre.com.pa/panama/webapi"
    mapfre_username: str = ""
    mapfre_password: str = ""

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


settings = Settings()
