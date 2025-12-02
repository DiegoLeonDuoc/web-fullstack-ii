# web-fullstack-ii (Frontend Vite + Backend Spring Boot)

Aplicación fullstack para catálogo musical con carrito de compras, autenticación de usuarios y panel de administración.

> ⚠️ **Importante:** antes de ejecutar el frontend, correr:
>
> ```bash
> npm install
> ```

---

##  Documentación

Toda la documentación relevante se encuentra en la carpeta `docs/`:

* `docs/ERS-frontend.md`: especificación de requisitos del frontend (versión vigente).
* `docs/cobertura-testing-frontend.md`: alcance de pruebas y cobertura actual.
* `docs/documento-integracion.md`: detalles de integración frontend–API (endpoints, headers, caché).
* `docs/README.md`: notas breves sobre estrategia de pruebas y suites.

---

##  Frontend (Vite + React)

###  Requisitos

* Node.js y npm instalados.
* Conexión al backend levantado (perfil `dev` en Spring Boot).

###  Instalación y ejecución

1. Instalar dependencias:

   ```bash
   npm install
   ```
   <img width="322" height="228" alt="image" src="https://github.com/user-attachments/assets/052fa0f8-872a-44ef-9d22-5bb66a61d14b" />
   
2. Modo desarrollo:

   ```bash
   npm start
   ```
   <img width="303" height="201" alt="image" src="https://github.com/user-attachments/assets/3bf0b46c-8ac1-475a-af83-88a2c120bf69" />

3. Build de producción:

   ```bash
   npm run build
   ```
<img width="541" height="239" alt="image" src="https://github.com/user-attachments/assets/79fca600-ce2c-4f62-aa1d-fd72fff12dc4" />

4. Pruebas unitarias:

   ```bash
   npm run test
   npm run test:coverage
   ```
<img width="1207" height="333" alt="image" src="https://github.com/user-attachments/assets/b8602845-7b32-4c94-8093-ccc3c558cee8" />

---

##  Scripts útiles (frontend)

* `npm start` → inicia el servidor de desarrollo.
* `npm run build` → genera el bundle de producción.
* `npm run test` → ejecuta las pruebas unitarias.
* `npm run test:coverage` → ejecuta pruebas con reporte de cobertura.

---

##  Manual de usuario (Frontend)

### Rutas principales

* **Inicio**: `/`
* **Catálogo**: `/catalogo`
* **Detalle de producto**: `/producto/:id`
* **Carrito**: `/carrito`
* **Páginas informativas**: Misión, Visión, Contacto

### Registro y login

* **Registro**: `/registro`
  Valida:

  * RUT
  * Edad
  * Email
  * Password
  * 
<img width="671" height="638" alt="image" src="https://github.com/user-attachments/assets/1d9be1e3-6a05-40f1-8d51-d967f3bc17a7" />

**Evidencia backend GET usuarios:**

<img width="1420" height="555" alt="image" src="https://github.com/user-attachments/assets/fa6c6431-83eb-4330-8007-1303fce43a3a" />

* **Login**: `/login`
  Tras iniciar sesión:

  * Se muestra el menú de usuario.
  * El contador de carrito se activa y refleja el número de ítems.




### Carrito de compras

* Desde la vista de detalle de producto se puede:

  * Seleccionar cantidad.
  * Agregar el producto al carrito.
* En `/carrito` se puede:

  * Modificar cantidades.
  * Eliminar ítems.
  * Ver el total actualizado automáticamente.

### Dashboard de administración

* Ruta: `/dashboard`
* Acceso solo para usuarios con rol: `ROLE_ADMIN`.
* Funcionalidades:

  * Crear, editar y eliminar **productos**, **artistas** y **sellos**.
* Requiere un **token válido** (autenticación JWT desde el backend).

---

##  Backend (Spring Boot + Oracle)

### ⚠️ Requisitos

* **JDK 25** instalado.
* **Maven** actualizado.
* Wallet de Oracle almacenada en una carpeta segura.

###  Levantar backend en perfil `dev`

1. Asegúrate de tener el archivo de configuración:

   `src/main/resources/application-dev.properties` con, por ejemplo:

   ```properties
   spring.application.name=FullStack-Backend

   spring.datasource.url=jdbc:oracle:thin:@${TNS_NAME}?TNS_ADMIN=${WALLET_DIR}
   spring.datasource.username=${DATABASE_USERNAME}
   spring.datasource.password=${DATABASE_PASSWORD}

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.format_sql=true
   ```

2. Exportar variables de entorno y ejecutar:

   ```bash
   export DATABASE_USERNAME={usernameDB} && \
   export DATABASE_PASSWORD='{passwordDB}' && \
   export TNS_NAME={TNS_NAME} && \
   export WALLET_DIR='{wallet_dir}' && \
   echo WALLET_DIR=$WALLET_DIR && \
   ./mvnw -DskipTests -Dspring-boot.run.profiles=dev spring-boot:run
   ```

3. Confirmar que el perfil `dev` está activo:

   <img width="1237" height="17" alt="image" src="https://github.com/user-attachments/assets/ab32445e-7eac-4b00-9772-1d036f69d665" />

4. Confirmar conexión correcta a la base de datos:

   <img width="1501" height="159" alt="image" src="https://github.com/user-attachments/assets/85b9154e-4099-45ca-a3ae-24a65fae91f6" />

---

##  API & Swagger

La documentación interactiva de la API está disponible en:

* **Swagger UI**:
  `http://localhost:8080/doc/swagger-ui/index.html#/`

Evidencia:

<img width="1815" height="987" alt="image" src="https://github.com/user-attachments/assets/ff12da2b-efa0-4be9-8afb-97fd58acc152" />

---

##  Integración Frontend–Backend

El frontend se comunica con el backend (perfil `dev`) a través de los endpoints documentados en Swagger y descritos en `docs/documento-integracion.md`.

Evidencia de integración exitosa:

<img width="1407" height="888" alt="image" src="https://github.com/user-attachments/assets/14c68b9c-986e-498c-ad2e-704385b66221" />

---

## ✅ Resumen rápido

1. **Backend**

   * Configurar wallet y variables de entorno.
   * Levantar con perfil `dev` usando Maven.

2. **Frontend**

   * `npm install`
   * `npm start`

3. Verificar:

   * Swagger en `http://localhost:8080/doc/swagger-ui/index.html#/`
   * Navegación y operaciones desde el frontend (`/`, `/catalogo`, `/carrito`, `/dashboard`, etc.).
