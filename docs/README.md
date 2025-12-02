# Pruebas del proyecto

Este documento resume la estrategia de pruebas después de migrar a Vite + Vitest y las suites disponibles.

## Cómo ejecutar

- Ejecutar todos los tests con cobertura:  
  `npm run test:coverage`
- Ejecutar tests en modo watch:  
  `npm run test`

## Estructura de suites

- `src/tests/` contiene todas las pruebas de Vitest:
  - **UI y componentes**: `product-display.test.jsx`, `product-table.test.jsx`, `shopping-cart-context.test.jsx`, `sidebar-filtros.test.jsx`, `advertencia-campo.test.jsx`, `campo-input.test.jsx`, `Dashboard.test.jsx`, `index-dom.test.jsx`, `formulario-registro.test.jsx`.
  - **Lógica de negocio**: `cart-storage.test.js`, `music-storage.test.js`, `filters.test.js`, `validaciones.test.js`, `user-storage.test.js`, `auth-hook.test.jsx`.

## Puntos cubiertos

- **Carrito (CartStorage y contexto)**: carga/mapeo desde API, agregar/actualizar/eliminar, manejo sin usuario autenticado, clamping de cantidades mínimas, totales y limpieza del carrito.
- **Catálogo (MusicStorage)**: cache y lectura de productos, manejo de error de API, alta/actualización/borrado con invalidación de cache, rutas sin token, búsqueda por ID, mapeos frontend/backend.
- **Filtros y UI de filtros**: derivación de opciones, notificación de criterios, limpieza y transformación a criterios de filtrado.
- **Componentes de presentación**: tarjetas, tablas y render de listas vacías o con datos.
- **Formularios y auth**: flujos DOM para registro/login, hook de Auth, validaciones utilitarias (email, rut, precios, edades, contraseñas).

## Configuración relevante

- `vite.config.js` usa Vitest con `jsdom`, `globals` y `setupFiles: src/setupTests.js`.
- La cobertura excluye archivos CSS (`test.coverage.exclude = ['**/*.css']`).
- `@vitest/coverage-v8` habilita el reporte de cobertura.

## Notas

- Los tests mockean llamadas a red (`fetch`) y `UserStorage` donde aplica para aislar la lógica.
- Algunos tests validan escenarios de error para asegurar retornos seguros (ej. `getProducts` ante API down devuelve `[]`, `updateProduct` lanza si no existe).  
- El contexto de carrito verifica que no se permitan cantidades negativas (se limita a 1).
