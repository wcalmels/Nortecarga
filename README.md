# NorteCarga Red v0.1

MVP demostrativo de una red operacional que conecta cargas, capacidad de transporte y oportunidades laborales para conductores.

## Funciones incluidas

- Dashboard del coordinador.
- Bolsa de cargas con búsqueda y compatibilidad.
- Camiones y capacidades disponibles.
- Bolsa laboral sectorial.
- Matching asistido en modo `SHADOW`.
- Alertas documentales.
- Creación de borradores con publicación bloqueada.
- Diseño responsive para escritorio y móvil.

## Límites del piloto

Los datos son demostrativos. La aplicación no adjudica viajes, contrata personas, procesa pagos, emite documentos tributarios, comparte documentación sensible ni ejecuta acciones externas. Toda decisión permanece bajo revisión humana.

## Ejecución

```bash
npm run dev
npm test
npm run lint
```

## Próxima fase

Persistencia multiusuario, autenticación por roles, verificación documental, historial de operaciones e integración shadow con PhiGraph/HAV/GRDI.
