# Cobertura de testing - Frontend

Version: 2025-02-12  
Suite: Vitest + React Testing Library (jsdom).

## Entorno y ejecucion
- Comando con cobertura: `npm run test:coverage`.
- Configuracion relevante (vite.config.js): entorno jsdom, `setupFiles: src/setupTests.js`, cobertura V8 excluye CSS.
- Pruebas unitarias/componentes; no hay pruebas E2E ni de performance.

## Alcance cubierto (que se valida hoy)
- Bootstrap del app: `index-dom.test.jsx` confirma montaje en `#root`.
- Auth y sesion: `auth-hook.test.jsx` asegura estados login/logout; `user-storage.test.js` valida persistencia en localStorage, altas en `/api/v1/usuarios` y obtencion de usuarios autenticados.
- Registro y validaciones: `formulario-registro.test.jsx` recorre el DOM del formulario, foco en primer campo invalido y redireccion a login al registrar; `validaciones.test.js` cubre rut, email, password, edad y precios.
- Catalogo y filtros: `filters.test.js` y `sidebar-filtros.test.jsx` comprueban conversion de precios, criterios de filtro y reset de filtros; `product-display.test.jsx` verifica render de tarjetas, tabla y filas de productos.
- Carrito: `shopping-cart-context.test.jsx` valida conteo, totales y operaciones add/update/remove/clear en el contexto; `cart-storage.test.js` cubre flujo backend (load, add, update, delete) y manejo sin usuario.
- Almacenamiento de productos: `music-storage.test.js` prueba mapeo backend->frontend, cache de 5 min, invalidacion en add/update/delete y tratamiento de errores/ausencia de token.
- Dashboard admin: `Dashboard.test.jsx` verifica redireccion si no hay sesion, spinner de carga, render inicial de productos y flujos CRUD (alta, edicion, borrado) sobre tabla simulada.
- Componentes basicos de formulario: `campo-input.test.jsx` y `advertencia-campo.test.jsx` cubren renderizado de inputs y mensajes.

## Cobertura declarativa vs funcional
- La cobertura actual es mayormente funcional por caso de uso (CRUD, filtros, validaciones) y de contratos de datos (mappers, cache). No hay verificaciones visuales de estilo.
- Las llamadas a red se mockean; no se valida la integracion real con el backend ni headers completos salvo en casos puntuales.

## Brechas y riesgos identificados
- No se prueban flujos completos de UI para Inicio, Catalogo render completo, Producto y Carrito (solo logica de filtros/carrito). Tampoco se prueba Login en DOM ni busqueda de cabecera.
- El caso `updateItemQty` en `cart-storage.test.js` espera conservar cantidad negativa; el codigo la normaliza a 1, por lo que la asercion fallara hasta alinear la regla de negocio o la prueba.
- No hay pruebas de accesibilidad (roles/aria), responsividad ni errores de red mostrados al usuario.
- No se cubren procesos reales de pago/checkout ni favoritos (boton de favorito es solo visual).
- Falta medir cobertura porcentual actual y definir umbral; el reporte depende de ejecucion local.

## Recomendaciones siguientes
- Agregar pruebas de interfaz para Login, Producto y Carrito completo (incluyendo mensajes y totales).
- Incorporar pruebas que validen headers y errores del dashboard (artistas/sellos) y sincronizacion de eventos `authStateChanged`.
- Usar una corrida de cobertura en CI y fijar umbral minimo (ej. 80%) para prevenir regresiones.
