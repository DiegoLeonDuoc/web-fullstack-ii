// UserStorage.js — Utilidades para gestión de usuarios y sesión
// Ahora conectado al Backend Spring Boot

// URL base para las peticiones relacionadas con usuarios
const API_URL = '/api/v1/usuarios';
// URL base para autenticación (login)
const AUTH_URL = '/api/auth';

// Claves para localStorage - usadas para almacenar datos de sesión en el navegador
const STORAGE_KEYS = {
  CURRENT_USER: 'app_current_user',  // Datos del usuario autenticado
  SESSION: 'app_session'              // Estado de la sesión (logueado o no)
};

/**
 * Obtiene la lista de todos los usuarios desde el backend.
 * 
 * Requiere estar autenticado y enviar el token JWT en las cabeceras.
 * 
 * @returns {Promise<Array<Object>>} Lista de usuarios del sistema.
 *                                    Retorna array vacío si hay error o no hay token.
 * 
 * Flujo:
 * 1. Obtiene el usuario actual del localStorage (para el token)
 * 2. Hace petición GET a /api/v1/usuarios con el token
 * 3. Parsea la respuesta HATEOAS (_embedded.usuarioList)
 * 4. Retorna la lista o array vacío en caso de error
 */
export const getUsers = async () => {
  try {
    // Obtener token del usuario autenticado
    const user = getCurrentUser();
    if (!user || !user.token) return [];

    // Realizar petición al backend con autenticación
    const res = await fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    if (!res.ok) return [];

    // Parsear respuesta (puede venir en formato HATEOAS)
    const data = await res.json();
    return data._embedded ? data._embedded.usuarioList : data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

/**
 * Registra un nuevo usuario en el backend.
 * 
 * Convierte los datos del formulario frontend al formato esperado por el backend.
 * El backend almacenará la contraseña de forma segura (hasheada).
 * 
 * @param {Object} userData - Datos del usuario a registrar
 * @param {string} userData.rut - RUT con formato (ej: "12.345.678-9")
 * @param {string} userData.firstName - Nombre
 * @param {string} userData.lastName - Apellido
 * @param {string} userData.email - Correo electrónico
 * @param {string} userData.password - Contraseña (será hasheada por el backend)
 * @param {number} userData.age - Edad
 * @param {string} userData.phone - Teléfono
 * 
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 *          Objeto con success=true y datos del usuario creado, o success=false con mensaje de error
 * 
 * Transformaciones:
 * - RUT: "12.345.678-9" -> rut: 12345678, dv: "9"
 * - firstName -> nombre (backend)
 * - lastName -> apellido (backend)
 * - password -> hash Contraseña (backend lo hashea)
 */
export const saveUser = async (userData) => {
  try {
    // Mapeo de campos Frontend -> Backend
    // Backend espera: rut (int), dv (char), nombre, apellido, email, password, etc.
    // Frontend envía: rut (string con formato), firstName, lastName, email, password...

    // Parsear RUT: remover puntos y guión, separar número de dígito verificador
    const cleanRut = userData.rut.replace(/\./g, '').replace(/-/g, '');
    const rutNum = parseInt(cleanRut.slice(0, -1));  // Todo menos el último carácter
    const dv = cleanRut.slice(-1).toUpperCase();       // Último carácter (puede ser K)

    // Construir objeto en formato backend
    const backendUser = {
      rut: rutNum,                        // RUT como número
      dv: dv,                             // Dígito verificador
      edad: userData.age,
      nombre: userData.firstName,
      apellido: userData.lastName,
      email: userData.email,
      telefono: userData.phone,
      hashContrasena: userData.password // Backend debe hashear esta contraseña
    };

    // Enviar petición POST para crear usuario
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendUser)
    });

    if (!res.ok) {
      // Si el backend rechaza (ej: RUT duplicado, email en uso)
      return { success: false, error: 'Error al registrar usuario. Verifique datos.' };
    }

    const created = await res.json();
    return { success: true, user: created };

  } catch (error) {
    console.error('Error al guardar usuario:', error);
    return { success: false, error: 'Error de conexión' };
  }
};

/**
 * Inicia sesión localmente guardando los datos del usuario en localStorage.
 * 
 * Almacena tanto los datos del usuario (con token) como el estado de sesión.
 * No hace validación de credenciales - eso ya se hizo con verifyCredentials.
 * 
 * @param {Object} user - Datos del usuario autenticado
 * @param {string} user.email - Email del usuario
 * @param {string} user.token - Token JWT recibido del backend
 * @param {Array<string>} user.roles - Roles del usuario
 * 
 * @returns {{success: boolean, error?: string}}
 * 
 * Efecto secundario:
 * - Guarda datos en localStorage bajo claves CURRENT_USER y SESSION
 * - Estos datos persisten entre recargas de página
 * - El token se usará en futuras peticiones autenticadas
 */
export const loginUser = (user) => {
  try {
    // Guardar datos completos del usuario (incluye token)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    // Guardar estado de sesión con timestamp
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
      isLoggedIn: true,
      loginTime: new Date().toISOString()  // Hora del login para auditoría
    }));

    return { success: true };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, error: 'Error local' };
  }
};

/**
 * Cierra la sesión del usuario actual.
 * 
 * Elimina los datos del usuario del localStorage pero mantiene
 * el registro de sesión marcado como cerrado.
 * 
 * @returns {{success: boolean, error?: string}}
 * 
 * Efecto secundario:
 * - Remueve CURRENT_USER del localStorage (incluyendo token)
 * - Actualiza SESSION a isLoggedIn: false
 * - El usuario deberá hacer login nuevamente para acceder
 */
export const logoutUser = () => {
  try {
    // Eliminar datos del usuario (token, roles, etc)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    // Marcar sesión como cerrada (pero mantener registro)
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ isLoggedIn: false }));

    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error: 'Error local' };
  }
};

/**
 * Obtiene los datos del usuario actualmente autenticado.
 * 
 * Lee del localStorage los datos guardados durante el login.
 * Incluye el token JWT necesario para peticiones autenticadas.
 * 
 * @returns {Object|null} Objeto con datos del usuario (email, token, roles) o null si no hay sesión
 * 
 * Uso típico:
 * const user = getCurrentUser();
 * if (user && user.token) {
 *   // Hacer petición autenticada con: Authorization: `Bearer ${user.token}`
 * }
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    // Si hay error parseando JSON, retornar null (sesión inválida)
    return null;
  }
};

/**
 * Verifica las credenciales de un usuario (Login).
 * 
 * Envía email y contraseña al endpoint de autenticación del backend.
 * Si las credenciales son válidas, el backend retorna un token JWT
 * que se usará para peticiones autenticadas posteriores.
 * 
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña sin hashear (el backend la valida)
 * 
 * @returns {Promise<{email: string, username: string, roles: Array<string>, token: string, rut: string}>}
 *          Objeto con datos del usuario y token JWT
 * 
 * @throws {Error} Si las credenciales son inválidas o hay error de conexión
 * 
 * Proceso:
 * 1. Envía POST a /api/auth/login con email y password
 * 2. Backend valida contra la contraseña hasheada almacenada
 * 3. Si es válido, backend genera y retorna token JWT
 * 4. Retorna objeto con datos del usuario y token
 * 
 * Uso típico en Login.jsx:
 * try {
 *   const userData = await verifyCredentials(email, password);
 *   login(userData);  // Guardar en localStorage
 *   navigate('/');
 * } catch (error) {
 *   setError('Credenciales inválidas');
 * }
 */
export const verifyCredentials = async (email, password) => {
  try {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      // Si el backend retorna 401 o 403, credenciales inválidas
      throw new Error('Credenciales inválidas');
    }

    const data = await res.json();

    // Retornar datos del usuario en formato esperado por el frontend
    return {
      email: email,
      username: data.email || email,
      roles: data.roles,           // Array de roles: ["ROLE_USER"] o ["ROLE_ADMIN"]
      token: data.token,            // Token JWT para autenticación
      rut: data.rut                 // RUT del usuario
    };
  } catch (error) {
    // Re-lanzar error para que Login.jsx pueda manejarlo
    if (error.message === 'Credenciales inválidas') {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};

/**
 * Verifica si existe una sesión activa.
 * 
 * Comprueba el estado de la sesión en localStorage.
 * Es más rápido que getCurrentUser() cuando solo necesitas saber si hay sesión.
 * 
 * @returns {boolean} true si hay usuario logueado, false en caso contrario
 * 
 * Nota: No verifica si el token es válido o ha expirado,
 * solo si existe sesión marcada como activa.
 */
export const isUserLoggedIn = () => {
  try {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session).isLoggedIn : false;
  } catch (error) {
    return false;
  }
};

/**
 * Objeto de exportación por defecto que agrupa todas las funciones.
 * 
 * Permite importar como: import Storage from './UserStorage'
 * Y usar: Storage.getCurrentUser(), Storage.loginUser(), etc.
 * 
 * También se pueden importar funciones individuales:
 * import { getCurrentUser, loginUser } from './UserStorage'
 */
const Storage = {
  getUsers,
  saveUser,
  verifyCredentials,
  loginUser,
  logoutUser,
  getCurrentUser,
  isUserLoggedIn,
  STORAGE_KEYS
};

export default Storage;