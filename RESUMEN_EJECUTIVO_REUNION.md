# Resumen Ejecutivo
## CRM de Seguros Multiaseguradora

### Objetivo
Construir una plataforma para que el corredor pueda consultar en un solo lugar la información de pólizas de sus clientes en distintas aseguradoras y generar cotizaciones comparativas para presentar una propuesta consolidada.

### Situación actual
Ya se revisó la documentación entregada por las aseguradoras y por el negocio. Con esa revisión, el proyecto **sí es viable** y puede iniciarse por fases.

### Qué ya tenemos
- Documentación suficiente para integrar consulta de cartera en `MAPFRE`, `SURA`, `Internacional de Seguros`, `Óptima`, `Ancón` y parcialmente `La Regional`.
- Capacidad documentada para cotizar `Autos` en `MAPFRE`, `Internacional`, `Óptima` y `La Regional`.
- Capacidad documentada para cotizar `Vida` en `Óptima`.
- Un modelo objetivo de datos bastante claro gracias a los documentos `Información Contacto` e `Información Póliza`.

### Qué podemos construir con esto
- Un CRM que consolide:
  - pólizas
  - vigencias
  - coberturas
  - primas
  - pagos
  - morosidad
  - comisiones
  - detalle de autos, personas o bienes según el ramo
- Un cotizador comparativo inicial para `Autos`.
- Una primera integración de `Vida` con `Óptima`.
- Un modelo único de cliente y póliza homologado entre aseguradoras.

### Qué todavía falta
- `ACERTA`: la documentación recibida no permite integrarla; hay que solicitar información útil.
- `ASSA`: ya se identificó autenticación y estructura general, pero faltan los endpoints específicos del portal.
- `MAPFRE`: hace falta completar la activación inicial de acceso para pruebas.
- `Ancón`: hace falta confirmar credenciales operativas.
- `La Regional`: solo está documentado el cotizador, no la consulta completa de cartera.
- Para `Salud`, `Incendio`, `Accidentes Personales` y `Viaje`, no hay APIs suficientes de cotización en la mayoría de aseguradoras.

### Conclusión ejecutiva
El proyecto puede comenzar ya. La recomendación es lanzar una **primera fase enfocada en consolidación de cartera y cotización de autos**, usando las aseguradoras mejor documentadas, y luego ampliar el alcance al resto de integraciones y ramos.

### Recomendación de implementación
- `Frontend`: React + Vite
- `Backend`: FastAPI
- `Base de datos`: PostgreSQL en Supabase

### Propuesta de arranque
1. Construir base del CRM y modelo homologado.
2. Integrar primero `MAPFRE`, `SURA`, `Internacional` y `Óptima`.
3. Liberar módulo de consulta consolidada de pólizas.
4. Liberar cotizador comparativo de autos.
5. Completar luego `ASSA`, `Ancón`, `La Regional` y el resto de flujos.

### Mensaje clave para la reunión
**Sí podemos desarrollar el CRM con lo que ya tenemos.** La documentación actual permite arrancar una primera versión útil del negocio, enfocada en consolidación de pólizas y cotización comparativa de autos, mientras se completan las integraciones faltantes.
