# Documento de integracion - Frontend

Version: 2025-02-12  
Alcance: cliente React/Vite y su comunicacion con la API backend.

## Dependencias externas
- API REST expuesta en `/api` (misma origen o via proxy).
- Endpoints usados:
  - Auth: `POST /api/auth/login`
  - Usuarios: `POST /api/v1/usuarios`, `GET /api/v1/usuarios` (solo con token)
  - Productos: `GET/POST/PUT/DELETE /api/v1/productos`, `GET /api/v1/productos/{id}`
  - Artistas: `GET/POST/PUT/DELETE /api/v1/artistas`, `GET /api/v1/artistas/search?nombre=...`
  - Sellos: `GET/POST/PUT/DELETE /api/v1/sellos`, `GET /api/v1/sellos/search?nombre=...`
  - Carritos: `GET /api/v1/carritos/{rut}`, `POST /api/v1/carritos/{rut}/items`, `PUT/DELETE /api/v1/carritos/{rut}/items/{id}`

## Autenticacion y headers
- Login devuelve token (JWT) y roles; se guarda en `localStorage` (`app_current_user`).
- Las operaciones protegidas envian cabecera `Authorization: Bearer <token>`.
- El RUT del usuario se usa para rutas de carrito (`{rut}` en path).

## Configuracion y ejecucion
- Instalar dependencias: `npm install`.
- Desarrollo: `npm start` (Vite) en `http://localhost:5173` por defecto.
- Build: `npm run build`; preview: `npm run serve` (vite preview).
- No se requieren variables de entorno adicionales si el frontend comparte dominio con la API; si la API vive en otro host, configurar un proxy en `vite.config.js` o usar reescritura de paths.

## Mapeo de datos
- Productos backend -> frontend (`MusicStorage`):
  - `sku` -> `id`, `titulo`, `artista.nombreArtista` -> `artista`, `sello.nombreSello` -> `etiqueta`, `nombreFormato` -> `formato`, `anioLanzamiento` -> `anio`, `urlImagen` -> `img`, `precio`, `calificacionPromedio` -> `rating`, `conteoCalificaciones` -> `ratingCount`, `cantidadStock` -> `stock`.
- Productos frontend -> backend: se resuelven IDs de artista y sello via endpoints de busqueda; se genera `sku` si falta usando `generateId`.
- Carrito backend -> frontend (`CartStorage`): items con `sku`, `cantidad` se mapean a `{id, qty, titulo, precio, img, formato, artista}`; las cantidades se normalizan a minimo 1 en updates.

## Eventos y almacenamiento local
- Estado de sesion: `app_current_user` y `app_session` en `localStorage`.
- Cache de productos: `music_products_cache` (5 min); se invalida en add/update/delete.
- Eventos de ventana: `authStateChanged` para avisar cambios de login/logout al carrito/header.

## Pruebas de integracion local (sin backend)
- Las suites Vitest mockean `fetch`; no hacen llamadas reales.
- Para pruebas manuales con backend real, levantar API y luego `npm start`; validar login, catalogo, carrito y dashboard (ROLE_ADMIN).

