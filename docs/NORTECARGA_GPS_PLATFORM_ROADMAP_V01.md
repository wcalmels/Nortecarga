# NorteCarga GPS Platform Roadmap v0.1

## Objetivo

Evolucionar NorteCarga desde una red de cargas/capacidad con matching asistido hacia una plataforma logística operacional en tiempo real, manteniendo revisión humana y autoridad de ejecución separada.

## Principios

- GPS no es UI: cada posición es un evento operacional trazable.
- Tenant isolation obligatorio para ubicación, operaciones y evidencias.
- Fail-closed ante coordenadas inválidas, señales obsoletas o identidad incompleta.
- Matching, recomendación, autorización y ejecución permanecen separados.
- Automatización progresiva: primero SHADOW, luego bounded authority sólo con gates explícitos.

## Secuencia de versiones

### v0.2 — Baseline Recovery

- Confirmar `main` como baseline canónica.
- Reproducir build, lint y tests.
- Inventariar deploy activo y persistencia real antes de migraciones.
- Revalidar Golden Path actual antes de modificar estados operacionales.

### v0.3 — Location Foundation

- `LocationFix` tenant-scoped.
- Validación lat/lon, precisión y timestamp.
- Clasificación HIGH / MEDIUM / LOW / STALE / INVALID.
- Distancia Haversine determinista.
- Geofences de retiro y entrega.
- Derivación de eventos de entrada/salida.
- Sin auto-despacho y sin transición automática de estado.

### v0.4 — Location Persistence + Live Map

- Persistencia idempotente de posiciones.
- Última ubicación por vehículo/operación.
- Retención diferenciada para GPS crudo vs. eventos derivados.
- API tenant-scoped para ingestión y consulta.
- Mapa operacional sólo para viajes autorizados.

### v0.5 — Routing + ETA

- Adapter de proveedor independiente (Mapbox/Google u otro).
- Route matrix y ETA al retiro.
- ETA de entrega dinámico.
- Map matching separado de la traza GPS original.
- Cache y control de costos de API.

### v0.6 — Dispatch SHADOW

- Nearby vehicle search.
- Compatibility filter.
- Ranking multi-factor: capacidad, tipo, documentos, distancia, ETA, reputación y precio.
- Recomendación solamente; adjudicación humana.

### v0.7 — Driver App

- Disponibilidad.
- Ofertas.
- Viaje activo.
- GPS foreground/background con consentimiento y política de retención.
- Evidencias de retiro/entrega.

### v0.8 — Geofencing Operational

- Arrival/departure candidates.
- Confirmación humana o evidencia adicional antes de hitos contractuales.
- Detección de detenciones y desvíos.

### v0.9 — Trip Intelligence

- ETA drift.
- Off-route.
- Unexpected stop.
- Data-quality alerts.
- FlowCert como detector de desviaciones de flujo, no como autoridad de ejecución.

### v1.0 — Private Logistics Marketplace

Flujo completo: publicar → encontrar → ofertar → adjudicar → seguir → entregar → verificar → cerrar.

## Después de v1.0

- Backhaul matching / reducción de kilómetros vacíos.
- Pricing intelligence en SHADOW.
- Reliability score basado en evidencia.
- Payments y conciliación.
- Integración tributaria/SII desacoplada.
- Control Tower.
- PhiGraph/HAV/GRDI para trazabilidad, verificación y gobernanza.

## Gates de seguridad para GPS

1. `TENANT_SCOPE_VALID`
2. `OPERATION_EXISTS`
3. `VEHICLE_AUTHORIZED_FOR_OPERATION`
4. `LOCATION_VALID`
5. `LOCATION_FRESH_ENOUGH`
6. `IDEMPOTENCY_VALID`
7. `RETENTION_POLICY_APPLIED`
8. `NO_AUTOMATIC_AUTHORITY_ESCALATION`

Una posición GPS nunca debe, por sí sola, adjudicar una carga, cerrar una entrega ni habilitar un pago.
