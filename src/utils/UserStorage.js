// UserStorage.js — Utilidades para gestión de usuarios y sesión
// Ahora conectado al Backend Spring Boot

const API_URL = '/api/v1/usuarios';
const AUTH_URL = '/api/auth';

// Claves para localStorage
const STORAGE_KEYS = {
  CURRENT_USER: 'app_current_user',
  SESSION: 'app_session'
};

/**
 * Inicializa el almacenamiento (No-op para API, mantenido por compatibilidad).
 */
export const initializeStorage = () => {
  // No se requiere inicialización local
};

/**
 * Obtiene la lista de usuarios (Solo ADMIN debería poder hacer esto).
 * @returns {Promise<Array<Object>>} Lista de usuarios.
 */
export const getUsers = async () => {
  try {
    const user = getCurrentUser();
    if (!user || !user.token) return [];

    const res = await fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    if (!res.ok) return [];

    const data = await res.json();
    return data._embedded ? data._embedded.usuarioList : data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

/**
 * Registra un nuevo usuario en el backend.
 * @param {Object} userData - Datos del usuario.
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export const saveUser = async (userData) => {
  try {
    // Mapeo de campos Frontend -> Backend
    // Backend espera: rut (int), dv (char), nombre, apellido, email, password, etc.
    // Frontend envía: rut (string con formato), firstName, lastName, email, password...


    // Parsear RUT
    const cleanRut = userData.rut.replace(/\./g, '').replace(/-/g, '');
    const rutNum = parseInt(cleanRut.slice(0, -1));
    const dv = cleanRut.slice(-1).toUpperCase();

    const backendUser = {
      rut: rutNum,
      dv: dv,
      edad: userData.age,
      nombre: userData.firstName,
      apellido: userData.lastName,
      email: userData.email,
      telefono: userData.phone,
      hashContrasena: userData.password // Backend debe hashear
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendUser)
    });

    if (!res.ok) {
      // Intentar leer error
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
 * Verifica credenciales (Login).
 * Nota: Login.jsx ya llama a /api/auth/login directamente.
 * Esta función se mantiene por si se usa en otros lados, redirigiendo a la API.
 */
export const verifyCredentials = async (email, password) => {
  try {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        user: {
          email: email,
          username: data.username,
          roles: data.roles,
          token: data.token
        }
      };
    }
    return { success: false, error: 'Credenciales inválidas' };
  } catch (e) {
    return { success: false, error: 'Error de conexión' };
  }
};

/**
 * Inicia sesión localmente (guarda token).
 */
export const loginUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
      isLoggedIn: true,
      loginTime: new Date().toISOString()
    }));
    return { success: true };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, error: 'Error local' };
  }
};

/**
 * Cierra sesión.
 */
export const logoutUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ isLoggedIn: false }));
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error: 'Error local' };
  }
};

/**
 * Obtiene el usuario actual.
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    //console.log(user);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Verifica si hay sesión activa.
 */
export const isUserLoggedIn = () => {
  try {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session).isLoggedIn : false;
  } catch (error) {
    return false;
  }
};

// Exportar objeto por defecto
const Storage = {
  getUsers,
  saveUser,
  verifyCredentials,
  loginUser,
  logoutUser,
  getCurrentUser,
  isUserLoggedIn,
  initializeStorage,
  STORAGE_KEYS
};

export default Storage;