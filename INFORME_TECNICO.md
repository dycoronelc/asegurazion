# INFORME TÉCNICO: CRM de Seguros para Corredores
## Análisis de Viabilidad y Arquitectura Propuesta

**Fecha:** 9 de marzo de 2026  
**Cliente:** Inversiones y Seguros Gómez Tomaz, S.A.  
**Proyecto:** Plataforma CRM de consolidación de pólizas y cotizaciones multi-aseguradora

---

## 1. RESUMEN EJECUTIVO

Se analizaron **38 documentos PDF** proporcionados por **8 aseguradoras** del mercado panameño, más 5 documentos internos de referencia. El objetivo es determinar si la documentación existente permite construir un CRM que consolide información de pólizas de múltiples aseguradoras y genere cotizaciones comparativas.

**Conclusión principal:** **SÍ es viable iniciar el desarrollo**, pero con alcance escalonado. Se cuenta con documentación suficiente para las funcionalidades de consulta de cartera (pólizas, morosidad, pagos, comisiones) en **6 de las 8 aseguradoras**. **ASSA** se encuentra parcialmente documentada (autenticación y diseño de API confirmados; faltan URIs de endpoints específicos que pueden obtenerse del portal de desarrolladores). Para cotizaciones, se dispone de APIs funcionales en **4 aseguradoras** (solo ramo de auto en la mayoría, y vida en Óptima). La única brecha documental crítica es **ACERTA** (documentación vacía).

---

## 2. INVENTARIO DE ASEGURADORAS Y CAPACIDADES DISPONIBLES

### 2.1 Matriz de Disponibilidad por Aseguradora

| Aseguradora | Protocolo | Autenticación | Producción/Pólizas | Morosidad | Pagos | Comisiones | Cotización Auto | Cotización Vida | Reclamos | Credenciales |
|---|---|---|---|---|---|---|---|---|---|---|
| **MAPFRE** | REST API (JSON) | OAuth Bearer Token | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ Parcial* |
| **SURA** | REST API (JSON) | OAuth 2.0 + Token JWT | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ (pruebas) |
| **Internacional de Seguros** | SOAP Web Service | Clave fija (Web Service ID) | ✅ | ✅ (Saldos) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Óptima Seguros** | SOAP Web Service | Código de corredor fijo | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Ancón** | REST/JSON | Usuario + Clave | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | Pendiente* |
| **La Regional de Seguros** | REST API (GET) | Basic Auth + Token fijo | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **ASSA** | REST API (Azure APIM) | OAuth Bearer + API Key | ⚠️** | ⚠️** | ⚠️** | ⚠️** | ⚠️** | ⚠️** | ⚠️** | ✅ |
| **ACERTA** | Desconocido | Desconocido | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

> \* MAPFRE: Requiere cambio de contraseña inicial vía portal. PIN fue enviado por correo.  
> \* Ancón: Se proporcionó documentación completa de la API pero no las credenciales específicas en los documentos analizados.  
> \** ASSA: Se dispone de credenciales OAuth, documentación de autenticación y diseño general de la API (filtros, seguridad). La plataforma menciona que cubre pólizas, reclamos, emisión, pricing y cuentas. Sin embargo, **faltan las URIs específicas de cada endpoint** (recursos disponibles en el gateway). Estas deben obtenerse del portal sandbox.assanet.com en la sección "APIs" → botón "Try it".

### 2.2 Detalle por Aseguradora

#### MAPFRE (Nivel de documentación: ALTO)
- **Base URL:** `https://app1.mapfre.com.pa/panama/webapi/`
- **Endpoints documentados:**
  - `token` — Generación de token Bearer (expira en 86,399 seg)
  - `api/apiexterno/MAPFRE/produccion` — Pólizas del corredor con detalle completo (terceros, certificados, bienes, vehículos, coberturas)
  - `api/apiexterno/MAPFRE/CotizadorAuto` — Cotización de autos particulares
  - `api/apiexterno/MAPFRE/Morosidad` — Saldos morosos por póliza
  - `api/apiexterno/MAPFRE/Pagos` — Historial de pagos
  - `api/apiexterno/MAPFRE/Comisiones` — Comisiones del corredor
- **Formato:** JSON entrada/salida, POST para todos los métodos
- **Datos de póliza disponibles:** Número, vigencias, primas, impuestos, estatus, datos del contratante (nombre, apellido, cédula, dirección, teléfonos, email), datos del vehículo (marca, modelo, año, placa, VIN, color), coberturas con deducibles y sumas aseguradas
- **Maestra asignada:** WS002779, Usuario: WS_U11676

#### SURA (Nivel de documentación: MUY ALTO — 62 páginas)
- **Base URL producción:** `https://iservice01.segurossura.com.pa`
- **Base URL pruebas:** `https://iservice02.segurossura.com.pa`
- **Autenticación en dos pasos:**
  1. OAuth 2.0 Client Credentials → Token de acceso
  2. Token de usuario vía `/sbus/GenerarTokenUsuario`
- **Operaciones disponibles:**
  - `/sbus/Corredores/ObtenerPagos`
  - `/sbus/Corredores/ObtenerComisiones`
  - `/sbus/Corredores/ObtenerMorosidad`
  - `/sbus/Corredores/ObtenerPolizasAuto`
  - `/sbus/Corredores/ObtenerPolizasCorredores` (información general)
  - `/sbus/Corredores/ObtenerPolizasPersonas`
  - `/sbus/Corredores/ObtenerCoberturas`
  - `/sbus/Corredores/ObtenerPatrimoniales`
  - `/sbus/Corredores/ObtenerReclamos`
  - `/sbus/Exp_ObtenerMarcasModelos/...` — Catálogo marcas/modelos
- **Restricciones importantes:**
  - Rango máximo de fechas: 1 mes
  - Horario disponible: 8:00 AM a 12:00 AM
  - Datos se actualizan una vez al día; no consumir repetidamente
  - Respuestas paginadas (campo NRO_PAGINA)
- **Datos de póliza:** Contratante completo (nombre, apellido, identificación, tipo persona, dirección, teléfonos, email, razón social), póliza (número, vigencias, ramo, estatus, endosos, secuencial), detalle financiero (prima bruta/neta, impuestos, frecuencia pago, comisión), vehículos, personas, patrimoniales, coberturas

#### Internacional de Seguros (Nivel de documentación: ALTO)
- **URLs:**
  - Integración general: `https://www.iseguros.com/corredor_web2/descargas.asmx`
  - Cotización auto: `https://www.iseguros.com/EmisorAuto/WsCotizaEmisorAuto.asmx`
- **Web Service ID:** `03010F0D0207010D1C02051E02020301`
- **Código de Agente:** 116452
- **Métodos de integración:**
  - `Produccion` — Datos de pólizas por rango de emisión (tipo movimiento, póliza, ramo, vigencias, primas, asegurado, contratante, dirección, teléfonos, email, frecuencia pago, canal pago, acreedor)
  - `Coberturas` — Planes, límites y primas por póliza
  - `Colectivos` / `ColectivosIndividuales_Dependientes` — Pólizas colectivas con asegurados y dependientes
  - `Comisiones` — Comisiones por corte
  - `ComisionVendedores` — Comisiones desglosadas por agente
  - `Flotas` — Datos de flota vehicular
  - `Pagos` — Cobranza por período
  - `Saldos` — Morosidad a la fecha
  - `ReclamosAuto`, `ReclamosAuto_Legal`, `ReclamosAuto_Notas`, `ReclamosAuto_Ordenes`
- **Métodos de cotización auto:**
  - `GetTipoDoc`, `GetTipoPlanes`, `GetPlanes`, `GetPlanesAdicionales`
  - `GenerarCotizacion` — Genera cotización con datos del asegurado y vehículo
  - `GetDatosCotizacion`, `GetCoberturasCotizacion` — Obtiene resultado
  - `GetMarcas`, `GetModelos` — Catálogos

#### Óptima Seguros (Nivel de documentación: ALTO)
- **URL principal:** `https://www1.optinet.com.pa/WsCarteraCorredor-WebServices-context-root/WebServices_TopLinkPlSqlProviderService?WSDL`
- **Protocolo:** SOAP/XML
- **Métodos de cartera:**
  - `corredorMorosidad` — Morosidad completa (nombre, empresa, identificación, ramo, póliza, saldos por tramos de 30/60/90/120 días)
  - `corredorGeneraProduccion` — Producción: nuevas, renovadas, endosos, cancelaciones (datos completos del asegurado, prima, impuestos, comisión, enlace PDF)
  - `corredorPolizaAuto` — Detalle de vehículos (marca, modelo, chasis, motor, placa, color, suma asegurada, propietario, conductor, acreedor)
  - `corredorPolizaPatrimonial` — Pólizas de incendio, etc. (descripción, ubicación, acreedor hipotecario)
  - `corredorPolizaPersonas` — Vida, salud, AP (fecha nacimiento, identificación, sexo, ocupación, beneficiarios con porcentaje)
  - `corredorPagos` — Pagos con canal
  - `corredorComisiones` — Comisiones ganadas y pagadas
- **Métodos de cotización:**
  - `cotizacionPoliza` — Auto (cobertura completa y daños a terceros)
  - `cotizaVida` — Vida (por cédula, género, fecha nacimiento, suma, plazo, condición fumador, nacionalidad)
- **Formato cotización auto:** Trama de posiciones fijas, con opciones de deducible

#### Ancón (Nivel de documentación: ALTO)
- **Protocolo:** REST con respuestas en JSON
- **Autenticación:** Usuario + Clave por parámetro en cada llamada
- **Métodos disponibles:**
  - `GetMarcas` / `GetModelos` — Catálogos
  - `GetPagos` — Pagos con detalles completos
  - `GePolizasComisiones` — Comisiones detalladas (incluyendo vida primer año/renovación)
  - `GePolizasMorosidad` — Saldos a 30/60/90/120/180/+180 días
  - `GetPolizas` — Pólizas con información completa del asegurado
  - `GetPolizasVehiculos` — Detalle de vehículos
  - `GetPolizasPersonas` — Certificados de personas con beneficiarios
  - `GetPolizasPatrimoniales` — Bienes patrimoniales
  - `GetPolizasCoberturas` — Coberturas por póliza

#### La Regional de Seguros (Nivel de documentación: BAJO)
- **URL cotización:** `https://desa.laregionaldeseguros.com:10443/desaw/regional/auto/cotizar/`
- **Método:** GET con Basic Auth
- **Solo documentado:** Cotización de auto (marca, modelo, año, valor, coberturas RC y completa)
- **Catálogos:** marcaVeh, modeloVeh, endosos, colorVeh, edoCivil, genero
- **Documentación Postman:** Disponible en enlace proporcionado
- **No hay documentación de consulta de cartera/pólizas**

#### ASSA (Nivel de documentación: MEDIO)
- **Plataforma:** Microsoft Azure API Management (NASSA)
- **Portales:** sandbox.assanet.com (desarrollo), developer.assanet.com (producción)
- **Autenticación (doble capa):**
  1. **Bearer Token** — OAuth password grant vía `POST https://apidev.assanet.com/authentication-ms/connect/token` con parámetros: `grant_type=password`, `client_id`, `client_secret`, `username`, `password`
  2. **Application-Key** — Token de aplicación obtenido del perfil del portal de desarrolladores, enviado como header `Application-Key: [Key]`
- **Gateway base:** `https://apidev.assanet.com/gateway/uri/[REQUEST ID]` (desarrollo)
- **Credenciales disponibles:**
  - Producción: client_id=`gtseguros`, username=`gtseguros@assainfo.com`
  - Pre-producción: mismas credenciales, distinto client_secret
- **Diseño de API:** REST con filtros avanzados estilo LoopBack:
  - `filter[where]` — Condiciones de búsqueda (ej: `filter[where][color]=red`)
  - `filter[fields]` — Selección de campos (ej: `filter[fields]=manufacturer,model`)
  - `filter[include]` — Inclusión de relaciones (ej: `filter[include]=driver,owner`)
  - `filter[limit]` / `filter[skip]` — Paginación
  - `filter[sort]` — Ordenamiento (ej: `filter[sort]=-manufacturer,+model`)
- **Funcionalidades mencionadas en la documentación general:** pólizas, reclamos, emisión de pólizas, pricing de primas (cotización), gestión de cuentas
- **Lo que falta:** Las URIs específicas de cada recurso/endpoint (ej: `/policies`, `/claims`, `/quotes`, etc.) no están documentadas en los archivos proporcionados. Deben obtenerse accediendo al portal sandbox.assanet.com → sección "APIs" → botón "Try it" para cada API, o contactando a soportekonnector@assanet.com
- **Seguridad:** HTTPS/TLS obligatorio, HSTS habilitado

#### ACERTA (Nivel de documentación: NULO)
- El PDF proporcionado está vacío / no contiene texto extraíble
- **Se requiere solicitar documentación completa a esta aseguradora**

---

## 3. ANÁLISIS DEL MODELO DE DATOS OBJETIVO

### 3.1 Modelo de Contacto (Información Contacto.pdf)

El documento define un modelo de datos CRM muy completo con **147+ campos** organizados en las siguientes secciones:

| Sección | Campos Clave | Observaciones |
|---|---|---|
| **Datos personales** | Nombre, Apellido, Fecha nacimiento, Nacionalidad, ID, Tipo ID, DV, Género, País residencia | Todos mapeables desde las APIs |
| **Información de contacto** | Móvil, Teléfono, Email, Email secundario | Disponible en la mayoría de las APIs |
| **Información laboral** | Empresa, Departamento, Ocupación, Cargo, Dirección laboral | Parcialmente disponible |
| **Perfil financiero** | Ingresos, País tributación, NIT | NO disponible vía APIs — requiere captura manual |
| **PEP** | Es PEP, Familiar PEP, Colaborador PEP | NO disponible vía APIs — requiere captura manual (regulatorio) |
| **Persona Jurídica** | Razón social, RUC, País constitución, Directores, Accionistas | Parcialmente disponible (razón social, RUC) |
| **CTC** | Formulario Conoce Tu Cliente, Firma digital, Documentos | NO disponible vía APIs — proceso manual/documental |
| **Broker/Referidor** | Broker, Referidor, Usuario referidor | Datos internos del CRM |

**Conclusión:** Aproximadamente el **40% de los campos del contacto** pueden poblarse automáticamente desde las APIs. El **60% restante** corresponde a datos regulatorios (PEP, CTC), financieros y documentales que requieren captura manual o integración con sistemas internos.

### 3.2 Modelo de Póliza (Información Póliza.pdf)

El documento define **100+ campos** para el registro de pólizas:

| Sección | Campos Clave | Mapeo desde APIs |
|---|---|---|
| **Info Aseguradora** | Aseguradora, Ramo, Sub-ramo, Plan, Uso | ✅ Alto — todas las APIs lo proveen |
| **Info Broker** | Broker, Vendedor, Canal venta, Fuente cliente | Parcial — código corredor disponible |
| **Info Póliza** | Número, Contratante, Asegurado, Pagador, Emisión, Vigencias, Suma asegurada, Estado | ✅ Alto — núcleo disponible en todas las APIs |
| **Info Pago** | Conducto, Frecuencia, Prima periódica/anual (con/sin impuesto) | ✅ Alto — disponible en la mayoría |
| **Morosidad** | Corriente, 30-60-90-120-120+ días, Saldo total | ✅ Alto — endpoint específico en todas |
| **Status** | Estado, Renovada, Recotizada, Cancelación | ✅ Parcial — estatus disponible, flujos internos son del CRM |
| **Historial pagos** | Fecha, Importe, Estado cobro, Número cuota | ✅ Alto — endpoints de pagos disponibles |

**Conclusión:** Aproximadamente el **75% de los campos de póliza** pueden poblarse automáticamente. El restante corresponde a campos de gestión interna del CRM (auditorías, procesos de renovación, etc.).

---

## 4. ANÁLISIS DE HOMOLOGACIÓN DE DATOS

### 4.1 Campos que requieren homologación entre aseguradoras

#### Identificación del Asegurado
| Campo CRM | MAPFRE | SURA | Internacional | Óptima | Ancón |
|---|---|---|---|---|---|
| Nombre | NOMTER | NOMBRE | Asegurado (campo compuesto) | NOMBRE | Nombre |
| Apellido | APETER | APELLIDO | (incluido en Asegurado) | APELLIDO | Apellido |
| Cédula/RUC | IDENTIFICACION | NUMERO_IDENTIFICACION | Cédula | IDENTIFICACION | Identificacion |
| Tipo persona | TIPOIDENTIF | ID_TIPO_PERSONA (N/J) | Tipo de Cliente | ID_TIPOPERSONA (1/2) | IdTipoPersona (1/2) |
| Email | EMAIL | EMAIL | Correo Electrónico | email | Email |
| Teléfono | TELEF1/TELEF2/TELEF3 | TELEFONO/CELULAR/TELEFONO_OFICINA | Teléfono Oficina/Residencial/Celular | telefono1/telefono2/CELULAR | Telefono/TelefonoOficina/Celular |

#### Información de Póliza
| Campo CRM | MAPFRE | SURA | Internacional | Óptima | Ancón |
|---|---|---|---|---|---|
| Número póliza | NUMPOL | NUMERO_POLIZA | # de Póliza | poliza_completa | NroPoliza |
| Vigencia desde | FECINIVIG | VIGENCIA_DESDE | Vigencia Desde | desde | FechaDesde |
| Vigencia hasta | FECFINVIG | VIGENCIA_HASTA | Vigencia Hasta | hasta | FechaHasta |
| Prima con imp. | TotalConImpuesto | PRIMA_NETA | Prima con iva | prima_cimp | PrimaNeta |
| Prima sin imp. | PrimaTotal | PRIMA_BRUTA | Prima sin iva | prima_simp | PrimaBruta |
| Ramo | CODPROD | COD_RAMO / DESC_RAMO | Ramo | ramo / nombre_ramo | CodRamo / Ramo |
| Estatus | STATUS | ESTATUS | Tipo de Movimiento | estado | Estatus |

#### Morosidad
| Campo CRM | MAPFRE | SURA | Internacional | Óptima | Ancón |
|---|---|---|---|---|---|
| Corriente | corriente | (no explícito) | (no explícito) | SALDO_CORRIENTE | (no explícito) |
| 30 días | saldo_30 | SALDO_30 | Saldo a 30 días | SALDO_30 | SaldoA30Dias |
| 60 días | saldo_60 | SALDO_60 | Saldo a 60 días | SALDO_60 | SaldoA60Dias |
| 90 días | saldo_90 | SALDO_90 | Saldo a 90 días | SALDO_90 | SaldoA90Dias |
| 120 días | saldo_120 | SALDO_120 | Saldo a 120 días | SALDO_120 | SaldoA120Dias |
| +120 días | saldo_mas | SALDO_MAS_120 | Saldo a más de 120 | (incluido en SALDO_120) | SaldoA180Dias / SaldoMas180Dias |

### 4.2 Formatos de Fecha (requieren normalización)
| Aseguradora | Formato |
|---|---|
| MAPFRE | String libre (varía) |
| SURA | `YYYY-MM-DDT00:00:00.000-0500` |
| Internacional | `Datetime` (depende del parser) |
| Óptima | `dd-mm-yyyy` o `yyyy-MM-dd` (varía por método) |
| Ancón | `yyyy-MM-dd` |
| La Regional | No especificado |

### 4.3 Tipos de Ramo (requieren tabla de homologación)
Cada aseguradora usa codificación diferente para los ramos:
- **MAPFRE:** Códigos alfanuméricos propios
- **SURA:** Códigos numéricos de 2 dígitos (01=Incendio, 02=Auto, 04=Automóvil, 06=Personas)
- **Internacional:** Numéricos de 2 dígitos
- **Óptima:** Numéricos de 2 dígitos (01=Incendio, 02=Auto, 14=Vida)
- **Ancón:** Alfanuméricos con sufijo (02B=Auto, 03B=Incendio, 14B=Vida)

**Se necesita una tabla maestra de homologación de ramos.**

---

## 5. ANÁLISIS DE COTIZACIONES

### 5.1 Disponibilidad de Cotización por Ramo

| Ramo | MAPFRE | Internacional | Óptima | La Regional | SURA | Ancón | ASSA | ACERTA |
|---|---|---|---|---|---|---|---|---|
| **Auto Cobertura Completa** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❓ | ❌ |
| **Auto Daños a Terceros** | ✅* | ✅ | ✅ | ✅ | ❌ | ❌ | ❓ | ❌ |
| **Vida** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❓ | ❌ |
| **Salud** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❓ | ❌ |
| **Incendio** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❓ | ❌ |
| **AP** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❓ | ❌ |

> \* MAPFRE cotización es solo para autos particulares según la documentación.

### 5.2 Datos Requeridos para Cotización de Auto (intersección)

Para poder cotizar en **todas** las aseguradoras que lo soportan, se necesita como mínimo:

| Dato | MAPFRE | Internacional | Óptima | La Regional |
|---|---|---|---|---|
| Marca (código homologado) | ✅ | ✅ | ✅ | ✅ |
| Modelo (código homologado) | ✅ | ✅ | ✅ | ✅ |
| Año del vehículo | ✅ | ✅ | ✅ | ✅ |
| Valor del vehículo | ✅ | ✅ | ✅ | ✅ |
| Tipo de cobertura | ✅ | ✅ | ✅ | ✅ |
| Coberturas/Límites RC | ✅ | ✅ (vía planes) | ✅ | ✅ |
| Tipo vehículo | ✅ | No | No | No |
| Peso vehículo | ✅ | No | ✅ (comercial) | No |
| Uso (particular/comercial) | ✅ | No | ✅ | No |
| Edad conductor | No | No | No | ✅ |
| Sexo conductor | No | No | No | ✅ |
| Estado civil | No | No | No | ✅ |
| Cédula/Doc identidad | No | ✅ | No | No |
| Nombre/Apellido | No | ✅ | No | No |
| Teléfono | No | ✅ | No | No |
| Email | No | ✅ | No | No |

### 5.3 Homologación de Marcas/Modelos

Cada aseguradora tiene su propio catálogo de marcas y modelos con códigos diferentes. Se necesita:
1. Descargar catálogos de cada una vía sus endpoints
2. Crear una tabla de mapeo (`marca_crm` → `codigo_mapfre`, `codigo_iseguros`, `codigo_optima`, etc.)
3. Mantener sincronización periódica

Aseguradoras con endpoint de catálogo: MAPFRE (tablas Excel), SURA, Internacional (`GetMarcas/GetModelos`), Óptima (homologación manual requerida), Ancón (`GetMarcas/GetModelos`), La Regional (`marcaVeh/modeloVeh`).

---

## 6. BRECHAS IDENTIFICADAS Y ACCIONES REQUERIDAS

### 6.1 Brechas Críticas (bloquean desarrollo)

| # | Brecha | Impacto | Acción Requerida |
|---|---|---|---|
| 1 | **ACERTA:** Documentación vacía/no legible | No se puede integrar esta aseguradora | Solicitar documentación técnica de APIs a ACERTA |
| 2 | **ASSA:** Se conoce la autenticación y diseño general, pero faltan las URIs específicas de los endpoints (recursos del gateway) | Se puede autenticar pero no se sabe qué consultar | Iniciar sesión en sandbox.assanet.com con las credenciales proporcionadas, navegar a la sección "APIs", documentar cada endpoint disponible (URI, parámetros, respuesta). Alternativamente, contactar a soportekonnector@assanet.com solicitando el catálogo completo de endpoints |
| 3 | **MAPFRE:** Contraseña requiere cambio inicial vía portal | No se pueden hacer pruebas | Completar el proceso de activación en app1.mapfre.com.pa/panama/portal |
| 4 | **Ancón:** No se encontraron credenciales en documentos | No se pueden hacer pruebas | Solicitar credenciales (Usuario y Clave) a Aseguradora Ancón |

### 6.2 Brechas Importantes (limitan funcionalidad)

| # | Brecha | Impacto | Acción Requerida |
|---|---|---|---|
| 5 | No hay API de cotización para ramos de Personas (Salud, AP) en ninguna aseguradora excepto Vida en Óptima | Las cotizaciones de Salud, AP, Incendio, etc. deberán hacerse manualmente | Consultar con cada aseguradora si tienen o planean APIs de cotización para otros ramos |
| 6 | La Regional solo tiene API de cotización, no de cartera | No se pueden consolidar pólizas de esta aseguradora | Consultar si hay APIs de consulta de cartera disponibles |
| 7 | SURA no tiene API de cotización documentada | No se pueden cotizar pólizas en SURA | Consultar con el equipo técnico de SURA |
| 8 | Homologación de marcas/modelos requiere trabajo manual inicial | Retrasa el lanzamiento del cotizador | Priorizar descarga y mapeo de catálogos |

### 6.3 Brechas Menores (afectan completitud)

| # | Brecha | Impacto |
|---|---|---|
| 9 | Campos de PEP, CTC, perfil financiero no disponibles vía API | Captura manual obligatoria |
| 10 | Documentos personales (cédula, licencia, etc.) no descargables vía API | Gestión documental separada |
| 11 | Formatos de fecha inconsistentes entre aseguradoras | Requiere capa de normalización |

---

## 7. ARQUITECTURA TÉCNICA PROPUESTA

### 7.1 Stack Tecnológico Recomendado

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│              React 18+ con Vite + TypeScript                 │
│         TailwindCSS + shadcn/ui (componentes)                │
│              TanStack Query (data fetching)                   │
│              React Router (navegación)                        │
│              Zustand (estado global)                          │
├─────────────────────────────────────────────────────────────┤
│                        BACKEND                               │
│            Python 3.12+ con FastAPI                           │
│         SQLAlchemy + Alembic (ORM + migraciones)             │
│              Pydantic v2 (validación)                         │
│              Celery + Redis (tareas asíncronas)              │
│              httpx (cliente HTTP async)                       │
│              zeep (cliente SOAP para Óptima/Internacional)   │
├─────────────────────────────────────────────────────────────┤
│                    BASE DE DATOS                             │
│          PostgreSQL 15+ en Supabase                          │
│       Supabase Auth (autenticación de usuarios)              │
│       Supabase Storage (documentos)                          │
│       Supabase Realtime (notificaciones)                     │
├─────────────────────────────────────────────────────────────┤
│                   INFRAESTRUCTURA                            │
│              Docker + Docker Compose                         │
│              Redis (cache + cola de tareas)                  │
│              Nginx (reverse proxy)                           │
└─────────────────────────────────────────────────────────────┘
```

**Justificación de Python/FastAPI sobre NestJS:**
- Las APIs de las aseguradoras usan tanto REST (JSON) como SOAP (XML). Python tiene el ecosistema más maduro para ambos protocolos (`httpx`, `zeep`, `xmltodict`).
- FastAPI ofrece rendimiento comparable a Node.js gracias a `uvicorn` con ASGI.
- La naturaleza de las integraciones (parseo de tramas de posición fija de Óptima, XML de Internacional) se maneja más naturalmente en Python.
- Pydantic v2 proporciona validación y serialización robusta para la normalización de datos heterogéneos.

### 7.2 Estructura de Proyecto Propuesta

```
APISeguros/
├── docs/                          # Documentación de aseguradoras (actual)
├── backend/
│   ├── alembic/                   # Migraciones de base de datos
│   │   └── versions/
│   ├── app/
│   │   ├── main.py                # Entry point FastAPI
│   │   ├── config.py              # Configuración y variables de entorno
│   │   ├── database.py            # Conexión a Supabase/PostgreSQL
│   │   │
│   │   ├── models/                # Modelos SQLAlchemy (tablas)
│   │   │   ├── contact.py         # Contactos/Asegurados
│   │   │   ├── policy.py          # Pólizas
│   │   │   ├── policy_vehicle.py  # Detalle de vehículos en póliza
│   │   │   ├── policy_person.py   # Detalle de personas en póliza
│   │   │   ├── policy_property.py # Detalle patrimonial en póliza
│   │   │   ├── coverage.py        # Coberturas
│   │   │   ├── payment.py         # Pagos
│   │   │   ├── delinquency.py     # Morosidad
│   │   │   ├── commission.py      # Comisiones
│   │   │   ├── quote.py           # Cotizaciones
│   │   │   ├── quote_option.py    # Opciones de cotización
│   │   │   ├── claim.py           # Reclamos
│   │   │   ├── catalog.py         # Catálogos homologados (marcas, modelos, ramos)
│   │   │   └── sync_log.py        # Log de sincronización
│   │   │
│   │   ├── schemas/               # Schemas Pydantic (DTOs)
│   │   │   ├── contact.py
│   │   │   ├── policy.py
│   │   │   ├── quote.py
│   │   │   └── ...
│   │   │
│   │   ├── api/                   # Endpoints de la API del CRM
│   │   │   ├── v1/
│   │   │   │   ├── contacts.py
│   │   │   │   ├── policies.py
│   │   │   │   ├── quotes.py
│   │   │   │   ├── payments.py
│   │   │   │   ├── delinquency.py
│   │   │   │   ├── commissions.py
│   │   │   │   ├── claims.py
│   │   │   │   ├── sync.py        # Endpoints de sincronización
│   │   │   │   └── catalogs.py
│   │   │   └── deps.py            # Dependencias compartidas
│   │   │
│   │   ├── integrations/          # CAPA DE INTEGRACIÓN (MIDDLEWARE)
│   │   │   ├── base.py            # Clase base abstracta para integraciones
│   │   │   ├── mapper.py          # Homologación de datos
│   │   │   ├── mapfre/
│   │   │   │   ├── client.py      # Cliente HTTP para MAPFRE
│   │   │   │   ├── auth.py        # Autenticación Bearer Token
│   │   │   │   ├── schemas.py     # Schemas de request/response MAPFRE
│   │   │   │   └── mapper.py      # Mapeo MAPFRE → modelo interno
│   │   │   ├── sura/
│   │   │   │   ├── client.py
│   │   │   │   ├── auth.py        # OAuth 2.0 + Token usuario
│   │   │   │   ├── schemas.py
│   │   │   │   └── mapper.py
│   │   │   ├── iseguros/          # Internacional de Seguros
│   │   │   │   ├── client.py      # Cliente SOAP
│   │   │   │   ├── schemas.py
│   │   │   │   └── mapper.py
│   │   │   ├── optima/
│   │   │   │   ├── client.py      # Cliente SOAP
│   │   │   │   ├── quote_parser.py # Parser de tramas de posición fija
│   │   │   │   ├── schemas.py
│   │   │   │   └── mapper.py
│   │   │   ├── ancon/
│   │   │   │   ├── client.py
│   │   │   │   ├── schemas.py
│   │   │   │   └── mapper.py
│   │   │   ├── regional/
│   │   │   │   ├── client.py
│   │   │   │   ├── schemas.py
│   │   │   │   └── mapper.py
│   │   │   ├── assa/
│   │   │   │   └── client.py      # Placeholder hasta documentación
│   │   │   └── acerta/
│   │   │       └── client.py      # Placeholder hasta documentación
│   │   │
│   │   ├── services/              # Lógica de negocio
│   │   │   ├── sync_service.py    # Orquestador de sincronización
│   │   │   ├── quote_service.py   # Orquestador de cotizaciones
│   │   │   ├── policy_service.py  # Consolidación de pólizas
│   │   │   └── contact_service.py # Gestión de contactos
│   │   │
│   │   └── tasks/                 # Tareas asíncronas (Celery)
│   │       ├── sync_policies.py   # Sincronización periódica de pólizas
│   │       ├── sync_payments.py   # Sincronización de pagos
│   │       ├── sync_delinquency.py
│   │       └── sync_catalogs.py   # Actualización de catálogos
│   │
│   ├── tests/
│   │   ├── integrations/          # Tests por aseguradora
│   │   ├── api/                   # Tests de endpoints
│   │   └── services/              # Tests de lógica de negocio
│   │
│   ├── requirements.txt
│   ├── Dockerfile
│   └── alembic.ini
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── ui/                # Componentes base (shadcn/ui)
│   │   │   ├── layout/            # Header, Sidebar, Layout
│   │   │   ├── contacts/          # Componentes de contactos
│   │   │   ├── policies/          # Componentes de pólizas
│   │   │   ├── quotes/            # Componentes de cotizaciones
│   │   │   ├── payments/          # Componentes de pagos
│   │   │   ├── delinquency/       # Componentes de morosidad
│   │   │   ├── commissions/       # Componentes de comisiones
│   │   │   └── dashboard/         # Dashboard y reportes
│   │   │
│   │   ├── pages/                 # Vistas/Páginas
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Contacts.tsx
│   │   │   ├── ContactDetail.tsx
│   │   │   ├── Policies.tsx
│   │   │   ├── PolicyDetail.tsx
│   │   │   ├── NewQuote.tsx
│   │   │   ├── QuoteComparison.tsx
│   │   │   ├── Payments.tsx
│   │   │   ├── Delinquency.tsx
│   │   │   ├── Commissions.tsx
│   │   │   └── Settings.tsx
│   │   │
│   │   ├── hooks/                 # Custom hooks
│   │   ├── services/              # Llamadas a la API del backend
│   │   ├── store/                 # Estado global (Zustand)
│   │   ├── types/                 # Tipos TypeScript
│   │   └── utils/                 # Utilidades
│   │
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

### 7.3 Modelo de Base de Datos (esquema simplificado)

```sql
-- Contactos/Asegurados (modelo unificado)
contacts
  id, first_name, last_name, id_number, id_type, date_of_birth, gender,
  email, phone, mobile, nationality, country_residence, address,
  person_type (NATURAL/JURIDICA), company_name, ruc,
  broker_id, created_at, updated_at

-- Pólizas (consolidadas de todas las aseguradoras)
policies
  id, contact_id (FK), insurer_code, policy_number, branch (ramo),
  sub_branch, plan, status, issue_date, start_date, end_date,
  sum_insured, premium_with_tax, premium_without_tax, tax_amount,
  payment_frequency, payment_method, is_active, is_renewal,
  external_id, raw_data (JSONB), synced_at, created_at, updated_at

-- Detalle de vehículos asegurados
policy_vehicles
  id, policy_id (FK), brand, model, year, value, plate, vin, engine_serial,
  body_serial, color, vehicle_type, creditor, driver_name, certificate_number

-- Detalle de personas aseguradas (vida, salud, AP)
policy_persons
  id, policy_id (FK), name, last_name, id_number, date_of_birth, gender,
  relationship, sum_insured, premium, certificate_number, occupation,
  beneficiary_percentage

-- Detalle patrimonial (incendio, RC, etc.)
policy_properties
  id, policy_id (FK), description, location, sum_insured, premium,
  mortgage_creditor, certificate_number, observations

-- Coberturas
coverages
  id, policy_id (FK), coverage_code, coverage_description, sum_insured,
  deductible, limit_per_person, limit_per_accident, premium

-- Morosidad
delinquencies
  id, policy_id (FK), current_balance, balance_30, balance_60,
  balance_90, balance_120, balance_over_120, total_balance, synced_at

-- Pagos
payments
  id, policy_id (FK), payment_date, amount, commission, receipt_number,
  payment_channel, is_direct

-- Comisiones
commissions
  id, policy_id (FK), payment_date, commission_amount,
  commission_percentage, receipt_number, reference

-- Cotizaciones
quotes
  id, contact_id (FK), branch, quote_date, status,
  vehicle_brand, vehicle_model, vehicle_year, vehicle_value,
  coverage_type, notes

-- Opciones de cotización (una por aseguradora)
quote_options
  id, quote_id (FK), insurer_code, option_number,
  premium_without_tax, tax, premium_with_tax,
  coverages (JSONB), deductibles (JSONB), raw_response (JSONB),
  external_quote_id

-- Reclamos
claims
  id, policy_id (FK), claim_number, claim_date, report_date,
  status, description, adjuster, location

-- Catálogos homologados
catalog_brands
  id, crm_code, name, mapfre_code, sura_code, iseguros_code,
  optima_code, ancon_code, regional_code

catalog_models
  id, brand_id (FK), crm_code, name, mapfre_code, sura_code,
  iseguros_code, optima_code, ancon_code, regional_code

catalog_branches (ramos)
  id, crm_code, name, mapfre_code, sura_code, iseguros_code,
  optima_code, ancon_code

-- Log de sincronización
sync_logs
  id, insurer_code, operation, status, records_processed,
  error_message, started_at, completed_at
```

---

## 8. FLUJOS PRINCIPALES DEL SISTEMA

### 8.1 Sincronización de Pólizas (flujo batch)

```
[Scheduler/Celery] → Para cada aseguradora activa:
  1. Obtener token/autenticación
  2. Llamar endpoint de producción con rango de fechas
  3. Para cada póliza recibida:
     a. Normalizar datos (fechas, nombres, códigos)
     b. Buscar contacto existente por cédula/RUC → crear si no existe
     c. Buscar póliza existente por (aseguradora + número) → crear o actualizar
     d. Sincronizar detalle: vehículos/personas/patrimonial según ramo
  4. Llamar endpoint de coberturas → actualizar coberturas
  5. Llamar endpoint de morosidad → actualizar saldos
  6. Llamar endpoint de pagos → registrar nuevos pagos
  7. Registrar en sync_log
```

### 8.2 Cotización Comparativa (flujo usuario)

```
[Usuario en Frontend] → Selecciona ramo (ej: Auto)
  1. Ingresa datos del vehículo y asegurado
  2. Selecciona coberturas deseadas
  3. Selecciona aseguradoras a cotizar
  4. [Backend] Para cada aseguradora seleccionada (en paralelo):
     a. Homologar marca/modelo al código de la aseguradora
     b. Adaptar formato de request según la aseguradora
     c. Llamar API de cotización
     d. Parsear respuesta y normalizar
  5. [Backend] Consolidar resultados y devolver comparativo
  6. [Frontend] Mostrar tabla comparativa con:
     - Prima total, desglose por cobertura, deducibles
     - Por cada aseguradora que respondió exitosamente
  7. [Usuario] Puede exportar/enviar comparativo al cliente
```

---

## 9. PLAN DE DESARROLLO POR FASES

### Fase 1 — Fundación (4-5 semanas)
- Setup del proyecto (backend FastAPI + frontend React/Vite)
- Modelo de base de datos y migraciones iniciales
- Autenticación de usuarios del CRM (Supabase Auth)
- Integración con **MAPFRE** como piloto (token + producción + morosidad)
- Vista de pólizas consolidadas y detalle
- Dashboard básico

### Fase 2 — Expansión de Integraciones (4-5 semanas)
- Integración con **SURA** (OAuth + todos los endpoints)
- Integración con **Internacional de Seguros** (SOAP)
- Integración con **Óptima** (SOAP)
- Integración con **Ancón** (REST)
- Sincronización automática (Celery)
- Vistas de morosidad, pagos y comisiones consolidados

### Fase 3 — Cotizador Multi-Aseguradora (3-4 semanas)
- Homologación de catálogos de marcas/modelos
- Cotizador de Auto: MAPFRE + Internacional + Óptima + La Regional
- Cotizador de Vida: Óptima
- Vista comparativa de cotizaciones
- Flujo de cotización → póliza por emitir

### Fase 4 — Gestión Completa (3-4 semanas)
- Módulo de contactos con formulario CTC
- Gestión documental (subida de documentos a Supabase Storage)
- Flujo de renovaciones y recotizaciones
- Reclamos (SURA + Internacional)
- Reportes y exportaciones
- Integración con ASSA y ACERTA (cuando se disponga de documentación)

### Fase 5 — Plataforma de Cliente Final (3-4 semanas)
- Portal/formulario público para cotizaciones (según `plataforma.pdf`)
- Flujos conversacionales por ramo (Auto, Incendio, Vida, Salud, AP, Viaje)
- Notificaciones automáticas
- Optimización y pruebas de carga

---

## 10. ESTIMACIONES Y CONSIDERACIONES

### 10.1 Esfuerzo Estimado
| Fase | Duración | Equipo Mínimo |
|---|---|---|
| Fase 1 | 4-5 semanas | 1 Full-stack + 1 Backend |
| Fase 2 | 4-5 semanas | 1 Full-stack + 1 Backend |
| Fase 3 | 3-4 semanas | 1 Full-stack + 1 Backend |
| Fase 4 | 3-4 semanas | 1 Full-stack + 1 Backend |
| Fase 5 | 3-4 semanas | 1 Full-stack + 1 Frontend |
| **Total** | **17-22 semanas** | |

### 10.2 Riesgos Técnicos
1. **APIs inestables o con limitaciones de rate:** SURA tiene horario restringido y límite de consultas diarias.
2. **Cambios en APIs sin aviso:** No hay contratos formales de versionamiento (excepto SURA v1.2).
3. **Tramas de posición fija (Óptima):** Parseo frágil; cualquier cambio en la estructura rompe la integración.
4. **Homologación de catálogos:** Trabajo manual significativo al inicio y mantenimiento continuo.
5. **Credenciales sensibles:** Algunos documentos contienen credenciales en texto plano; se requiere gestión segura (vault o variables de entorno cifradas).

### 10.3 Recomendaciones Inmediatas
1. **Activar credenciales de MAPFRE** (cambio de contraseña vía portal) como primera acción.
2. **Solicitar documentación a ACERTA** y **explorar portal de ASSA** inmediatamente.
3. **Consultar a La Regional** si tienen APIs de consulta de cartera.
4. **Solicitar credenciales de Ancón** si no se tienen.
5. **No exponer credenciales en repositorios de código.** Los documentos actuales contienen credenciales en texto plano.
6. **Iniciar con la integración de MAPFRE** como prueba de concepto, ya que tiene la documentación más completa y moderna (REST/JSON).

---

## 11. CONCLUSIÓN

Con la documentación actual, es **totalmente viable** construir un CRM de seguros que consolide información de pólizas de **6 aseguradoras** (MAPFRE, SURA, Internacional, Óptima, Ancón, y parcialmente La Regional) y genere cotizaciones comparativas de **Auto en 4 aseguradoras** y **Vida en 1 aseguradora**.

**ASSA** ahora se encuentra en estado **parcialmente documentado**: se conoce el mecanismo de autenticación completo (OAuth Bearer + Application-Key), el diseño general de la API (filtros, paginación, seguridad), y la plataforma menciona explícitamente soporte para pólizas, reclamos, emisión, pricing y cuentas. El paso faltante es obtener el catálogo específico de URIs del portal de desarrolladores, lo cual puede realizarse en una sesión de exploración del portal sandbox.assanet.com. Si ASSA expone los mismos datos que las demás (producción, morosidad, pagos, comisiones), sería la **7ma aseguradora integrable**.

Las principales limitaciones restantes son:
- **ACERTA** requiere documentación completa antes de poder integrarla.
- **Las cotizaciones de ramos distintos a Auto** (Salud, Incendio, AP, Viaje) no tienen APIs disponibles y deberán manejarse mediante flujo manual (envío de solicitud por email a las aseguradoras).
- La homologación de catálogos (marcas, modelos, ramos, coberturas) es un esfuerzo significativo pero realizable.

La arquitectura propuesta (React + Vite / FastAPI + Python / PostgreSQL en Supabase) es la más adecuada dada la heterogeneidad de protocolos (REST JSON + SOAP XML + tramas posicionales) y la necesidad de procesamiento asíncrono para la sincronización con múltiples aseguradoras.
