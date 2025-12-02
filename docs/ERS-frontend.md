# ERS Frontend - Beat Bazaar

Version: 2025-02-12  
Alcance: solo capa React/Vite del cliente web.

## 1. Proposito y alcance
- Entregar los requisitos funcionales y no funcionales del frontend de Beat Bazaar (catalogo musical) tal como esta implementado hoy.
- Enfoque: navegacion SPA, gestion de productos, carrito, autenticacion y panel admin. El backend (API REST) se considera dependencia externa y no se detalla aqui.

## 2. Actores y perfiles
- Visitante: navega catalogo y detalle de producto sin autenticarse; no puede persistir carrito en backend.
- Usuario autenticado: credenciales via `/api/auth/login`; puede agregar productos al carrito persistido por usuario (rut) y ver conteo/total.
- Administrador (ROLE_ADMIN): mismas capacidades de usuario autenticado y acceso protegido a dashboard para CRUD de productos, artistas y sellos.

## 3. Supuestos y dependencias
- API REST disponible en las rutas `/api/auth`, `/api/v1/usuarios`, `/api/v1/productos`, `/api/v1/artistas`, `/api/v1/sellos`, `/api/v1/carritos/{rut}`.
- Token JWT recibido en login; se envia en cabecera `Authorization` en operaciones protegidas.
- `localStorage` accesible para cache de productos (5 min) y estado de sesion (banderas y usuario actual).
- Navegador moderno con soporte a ES2020, Fetch API y CSS de Bootstrap 5.

## 4. Requerimientos funcionales
### 4.1 Navegacion y layout
- RF-01: Mostrar cabecera con links a Inicio, Catalogo, Mision, Vision, Contacto y, si ROLE_ADMIN, Dashboard. Debe incluir buscador (visual) y acceso a login/registro o menu de usuario logueado.
- RF-02: Pie de pagina visible en todas las rutas con informacion de contacto/redes (Footer).
- RF-03: Ruteo SPA gestionado por React Router; rutas publicas: `/`, `/catalogo`, `/producto/:id`, `/mision`, `/vision`, `/contacto`, `/registro`, `/login`, `/carrito`.

### 4.2 Catalogo y filtros
- RF-10: Obtener lista de productos desde `/api/v1/productos`; mapear campos backend a modelo frontend (sku->id, artista.nombreArtista, sello.nombreSello, etc.).
- RF-11: Cachear la lista en `localStorage` durante 5 minutos; si el cache es valido, responder sin llamar a red.
- RF-12: Permitir filtrar por rango de precio, formato (CD/Vinilo), artista, anio (rango), etiqueta y rating minimo. Los filtros se derivan de los productos cargados y se notifican en cada cambio.
- RF-13: Soportar presets de filtro via query string (?formato=CD) aplicados al cargar `/catalogo`.
- RF-14: Listar productos paginados por grilla responsiva; si no hay coincidencias, mostrar mensaje de vacio.

### 4.3 Detalle de producto
- RF-20: Al visitar `/producto/:id` obtener producto por id (cache primero, luego GET `/api/v1/productos/{id}`).
- RF-21: Mostrar precio, formato, descripcion, artista, anio, etiqueta, imagen y reseñas mock locales.
- RF-22: Permitir seleccionar cantidad y agregar al carrito (solo usuarios logueados pueden persistir en backend; la UI muestra feedback inmediato).

### 4.4 Carrito
- RF-30: Cargar carrito del usuario autenticado desde `/api/v1/carritos/{rut}` al iniciar la app y al cambiar el estado de auth.
- RF-31: Agregar item (POST `/items`) y mapear respuesta a modelo frontend; limitar cantidad minima a 1 al actualizar.
- RF-32: Actualizar cantidad (PUT `/items/{id}`) y eliminar item (DELETE `/items/{id}`); recalcular totales en CLP.
- RF-33: Mostrar resumen con subtotal por item, total general y boton de checkout deshabilitado si el carrito esta vacio.

### 4.5 Usuarios y autenticacion
- RF-40: Registro en `/registro` con validaciones de rut, edad, email y password; enviar alta a `/api/v1/usuarios` mediante `saveUser`.
- RF-41: Login en `/login` llamando a `/api/auth/login`; al recibir token y roles, guardar usuario actual y bandera de sesion en `localStorage`.
- RF-42: Mostrar initials/avatar y menu de usuario cuando hay sesion; permitir logout que limpia storage y notifica via evento `authStateChanged`.
- RF-43: Ruta `/dashboard` debe estar protegida (ProtectedRoute) y redirigir a inicio si no hay sesion.

### 4.6 Dashboard admin
- RF-50: Listar productos con tabla; permitir crear, editar y eliminar productos contra `/api/v1/productos` (POST/PUT/DELETE), invalidando cache al cambiar datos.
- RF-51: Generar id de producto si falta usando slug de titulo+formato; inferir tipo de formato (CD/VINYL/CASSETTE/DIGITAL) para backend.
- RF-52: Tab de Artistas: listar `/api/v1/artistas`, crear/editar (ArtistaForm) y eliminar items.
- RF-53: Tab de Sellos: listar `/api/v1/sellos`, crear/editar (SelloForm) y eliminar items.
- RF-54: Mantener seleccion de item en edicion y permitir cancelar, volviendo a modo alta.

### 4.7 Contenido informativo
- RF-60: Paginas `/mision`, `/vision`, `/contacto` con contenido estatico de marca.
- RF-61: Inicio (`/`) muestra secciones de recomendados y mejores productos a partir del listado cargado.

### 4.8 UX y feedback
- RF-70: Mostrar estados de carga (spinners, mensajes) al esperar datos de catalogo o dashboard.
- RF-71: Mostrar errores de formulario cuando falten campos obligatorios o haya formato invalido; enfocar primer campo invalido en registro.
- RF-72: Usar conteo de carrito visible (badge) y feedback de agregado exitoso en detalle de producto.

## 5. Requerimientos no funcionales
- RNF-01 Tecnologia: React 19, Vite 7, React Router 7, React Bootstrap 2, Vitest para pruebas, FontAwesome/Bootstrap para UI.
- RNF-02 Seguridad: token en cabecera Authorization para endpoints protegidos; no almacenar password en texto plano fuera del flujo de alta (backend debe hashear).
- RNF-03 Rendimiento: cache de productos 5 min; minimizar llamadas repetidas; UI responde sin recargar pagina.
- RNF-04 Usabilidad y accesibilidad: controles con labels/aria donde aplica (inputs, botones), navegación coherente y formularios con feedback inmediato.
- RNF-05 Compatibilidad: navegadores modernos desktop/mobile; layout responsivo mediante Bootstrap grid.
- RNF-06 Observabilidad: uso de console logs limitado a diagnostico actual; no hay trazas remotas.
- RNF-07 Calidad: pruebas unitarias con Vitest y react-testing-library cubren rutas clave, hooks y utilidades; ver `docs/cobertura-testing-frontend.md`.

## 6. Criterios de aceptacion resumidos
- CA-01: Usuario admin logueado puede crear, editar y borrar un producto y verlo reflejado en la tabla sin recargar pagina.
- CA-02: Usuario autenticado puede agregar un producto al carrito, ver el subtotal actualizado y eliminarlo.
- CA-03: Visitante puede filtrar catalogo por precio, formato y artista y ver solo coincidencias.
- CA-04: Formulario de registro impide enviar datos incompletos y redirige a login tras registro valido.
- CA-05: Ruta `/dashboard` redirige a inicio cuando no hay sesion activa.

## 7. Riesgos y pendientes
- Dependencia total de disponibilidad y contrato del backend; errores de red devuelven arrays vacios y limitan feedback al usuario.
- Carrito no implementa pago/checkout real; boton se mantiene deshabilitado si no hay items.
- Falta manejo de favoritos y buscador de cabecera (UI presente, sin logica).
- Test `updateItemQty` incluye un caso esperado con cantidad negativa que hoy no coincide con la normalizacion a 1 (pendiente alinear regla).
- Encoding heredado en textos (acentos) puede requerir ajuste de i18n o fuentes para evitar caracteres corruptos.
