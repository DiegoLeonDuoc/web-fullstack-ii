// Storage.js

// Mock data inicial con usuarios de ejemplo
const mockUsers = [
  {
    id: 1,
    rut: "12.345.678-5",
    age: "30",
    firstName: "Juan",
    lastName: "Pérez",
    phone: "+56 9 1234 5678",
    email: "juan.perez@example.com",
    password: "a109e36947ad56de1dca1cc49f0ef8ac9ad9a7b1aa0df41fb3c4cb73c1ff01ea", // Password123!
    createdAt: "2024-01-15T10:30:00Z",
    role: 'ADMIN'
  },
  {
    id: 2,
    rut: "11.111.111-1",
    age: "25",
    firstName: "María",
    lastName: "González",
    phone: "+56 9 8765 4321",
    email: "maria.gonzalez@example.com",
    password: "603e96d6ef8ceef5f6b8adc8a363b1b121ce5818600c6436099f86da545e2aee", // SecurePass456!
    createdAt: "2024-01-16T14:20:00Z",
    role: 'USER'
  },
  {
    id: 3,
    rut: "11.223.344-K",
    age: "35",
    firstName: "Carlos",
    lastName: "Rodríguez",
    phone: "+56 9 1122 3344",
    email: "carlos.rodriguez@example.com",
    password: "c97a00fdec57ad2f948a1f14a2607dc9c99c3d05657e5b758f4374e179adecc8", // MyPass789!
    createdAt: "2024-01-17T09:15:00Z",
    role: 'USER'
  }
];

// Claves para localStorage
const STORAGE_KEYS = {
  USERS: 'app_users',
  CURRENT_USER: 'app_current_user',
  SESSION: 'app_session'
};

// Utilidad: SHA-256 a hex (usa Web Crypto API del navegador)
// - Recibe un texto (por ejemplo, una contraseña) y devuelve su hash en hex.
// - Es asíncrona porque Web Crypto opera de forma no bloqueante.
const textEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
async function hashSHA256(text) {
  if (!window.crypto?.subtle || !textEncoder) {
    throw new Error('Web Crypto no disponible para SHA-256');
  }
  const data = textEncoder.encode(String(text)); // 1) Convertimos el string a bytes UTF-8
  const digest = await window.crypto.subtle.digest('SHA-256', data); // 2) Calculamos el hash (ArrayBuffer)
  const bytes = new Uint8Array(digest); // 3) Lo vemos como arreglo de bytes
  // 4) Transformamos cada byte a hex de 2 caracteres y unimos
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Inicializa las claves de localStorage requeridas si no existen.
 * - USERS: lista de usuarios
 * - SESSION: estado de sesión
 * @returns {void}
 */
// Inicialización (PoC): No hasheamos los mocks aquí para que puedas pegarlos a mano.
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SESSION)) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ isLoggedIn: false }));
  }
};

/**
 * Obtiene la lista completa de usuarios.
 * @returns {Array<Object>} Arreglo de usuarios o [] si ocurre un error.
 */
const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

/**
 * Guarda un nuevo usuario si el email y RUT no están registrados.
 * @param {Object} userData - Datos del usuario a crear.
 * @returns {{success: boolean, user?: Object, error?: string}} Resultado de la operación.
 */
const saveUser = async (userData) => {
  try {
    const users = getUsers();
    // Verificar si el email ya existe
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
      return { success: false, error: 'El email ya está registrado' };
    }
    // Verificar si el RUT ya existe
    const rutExists = users.some(user => user.rut === userData.rut);
    if (rutExists) {
      return { success: false, error: 'El RUT ya está registrado' };
    }
    // Crear nuevo usuario con contraseña hasheada
    const newUser = {
      id: Date.now(),
      ...userData,
      password: await hashSHA256(userData.password),
      createdAt: new Date().toISOString(),
      role: 'USER'
    };
    const updatedUsers = [...users, newUser];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    return { success: false, error: 'Error al guardar el usuario' };
  }
};

/**
 * Busca un usuario por email.
 * @param {string} email - Email a buscar.
 * @returns {Object|undefined} Usuario encontrado o undefined.
 */
const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

/**
 * Busca un usuario por RUT.
 * @param {string} rut - RUT a buscar.
 * @returns {Object|undefined} Usuario encontrado o undefined.
 */
const findUserByRut = (rut) => {
  const users = getUsers();
  return users.find(user => user.rut === rut);
};

/**
 * Verifica credenciales de inicio de sesión (email y password).
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {{success: boolean, user?: Object, error?: string}}
 */
const verifyCredentials = async (email, password) => {
  // 1) Buscamos al usuario por email
  const user = findUserByEmail(email);
  if (!user) return { success: false, error: 'Credenciales inválidas' };
  try {
    // 2) Calculamos el hash del password ingresado
    const candidate = await hashSHA256(password);
    // 3) Si el almacenado parece un hash SHA-256 (64 hex), comparamos hashes
    if (typeof user.password === 'string' && /^[a-f0-9]{64}$/i.test(user.password)) {
      return candidate === user.password ? { success: true, user } : { success: false, error: 'Credenciales inválidas' };
    }
    // 4) Si el almacenado es texto plano (PoC), comparamos directo sin migrar
    if (user.password === password) {
      return { success: true, user };
    }
    // 5) Falla en cualquier otro caso
    return { success: false, error: 'Credenciales inválidas' };
  } catch (e) {
    return { success: false, error: 'No se pudo validar credenciales' };
  }
};

/**
 * Establece el usuario actual y marca la sesión como iniciada.
 * @param {Object} user - Usuario autenticado.
 * @returns {{success: boolean, error?: string}}
 */
const loginUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ 
      isLoggedIn: true,
      loginTime: new Date().toISOString()
    }));
    return { success: true };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, error: 'Error al iniciar sesión' };
  }
};

/**
 * Cierra la sesión del usuario actual.
 * @returns {{success: boolean, error?: string}}
 */
const logoutUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ isLoggedIn: false }));
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error: 'Error al cerrar sesión' };
  }
};

/**
 * Obtiene el usuario actualmente autenticado.
 * @returns {Object|null} Usuario actual o null si no existe o falla.
 */
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
};

/**
 * Indica si existe una sesión activa.
 * @returns {boolean} True si hay sesión iniciada.
 */
const isUserLoggedIn = () => {
  try {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session).isLoggedIn : false;
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    return false;
  }
};

/**
 * Elimina todas las claves utilizadas en localStorage.
 * @returns {void}
 */
const clearStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Calcula estadísticas básicas de usuarios para mostrar en dashboards.
 * @returns {{totalUsers: number, latestRegistrations: Array<Object>, averageAge: number}}
 */
const getStats = () => {
  const users = getUsers();
  return {
    totalUsers: users.length,
    latestRegistrations: users.slice(-5).reverse(), // Últimos 5 registrados
    averageAge: users.length > 0 
      ? Math.round(users.reduce((sum, user) => sum + parseInt(user.age), 0) / users.length)
      : 0
  };
};


// Inicializar el storage al importar el módulo
initializeStorage();

// Exportar todas las funciones
const Storage = {
  // Usuarios
  getUsers,
  saveUser,
  findUserByEmail,
  findUserByRut,
  verifyCredentials,
  // Crypto util (expuesta para visualización PoC)
  hashSHA256,
  
  // Sesión
  loginUser,
  logoutUser,
  getCurrentUser,
  isUserLoggedIn,
  
  // Utilidades
  clearStorage,
  getStats,
  initializeStorage,
  
  // Constantes
  STORAGE_KEYS
};

export default Storage;