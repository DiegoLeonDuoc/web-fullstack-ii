// Storage.js

// Mock data inicial con usuarios de ejemplo
const mockUsers = [
  {
    id: 1,
    rut: "12.345.678-9",
    age: "30",
    firstName: "Juan",
    lastName: "Pérez",
    phone: "+56 9 1234 5678",
    email: "juan.perez@example.com",
    password: "Password123!",
    createdAt: "2024-01-15T10:30:00Z",
    role: 'ADMIN'
  },
  {
    id: 2,
    rut: "98.765.432-1",
    age: "25",
    firstName: "María",
    lastName: "González",
    phone: "+56 9 8765 4321",
    email: "maria.gonzalez@example.com",
    password: "SecurePass456!",
    createdAt: "2024-01-16T14:20:00Z",
    role: 'USER'
  },
  {
    id: 3,
    rut: "11.223.344-5",
    age: "35",
    firstName: "Carlos",
    lastName: "Rodríguez",
    phone: "+56 9 1122 3344",
    email: "carlos.rodriguez@example.com",
    password: "MyPass789!",
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

// Inicializar localStorage con mock data si no existe
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.SESSION)) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ isLoggedIn: false }));
  }
};

// Obtener todos los usuarios
const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

// Guardar un nuevo usuario
const saveUser = (userData) => {
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
    
    // Crear nuevo usuario
    const newUser = {
      id: Date.now(), // ID único basado en timestamp
      ...userData,
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

// Buscar usuario por email
const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

// Buscar usuario por RUT
const findUserByRut = (rut) => {
  const users = getUsers();
  return users.find(user => user.rut === rut);
};

// Verificar credenciales de login
const verifyCredentials = (email, password) => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return { success: true, user };
  }
  return { success: false, error: 'Credenciales inválidas' };
};

// Manejo de sesión
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

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
};

const isUserLoggedIn = () => {
  try {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session).isLoggedIn : false;
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    return false;
  }
};

// Limpiar todos los datos (para testing/reset)
const clearStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Obtener estadísticas (útil para dashboards)
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