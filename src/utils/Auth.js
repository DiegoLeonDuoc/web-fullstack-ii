import { useState, useEffect } from 'react';
import Storage from './UserStorage';

/**
 * Hook personalizado de React para gestión de autenticación.
 * 
 * Proporciona estado reactivo de autenticación y funciones para login/logout.
 * Escucha cambios en localStorage y eventos personalizados para sincronizar
 * el estado entre componentes y pestañas del navegador.
 * 
 * @returns {{
 *   isLoggedIn: boolean,
 *   currentUser: Object|null,
 *   login: (user: Object) => {success: boolean},
 *   logout: () => {success: boolean},
 *   checkAuthStatus: () => void
 * }}
 * 
 * Características:
 * - Sincronización automática con localStorage
 * - Reactividad entre componentes mediante eventos
 * - Sincronización entre pestañas del navegador
 * - Estados React para UI reactiva
 * 
 * Uso típico:
 * const { isLoggedIn, currentUser, login, logout } = Auth();
 * if (isLoggedIn) {
 *   // Usuario autenticado
 * }
 */
export const Auth = () => {
  // Estado local: si el usuario está autenticado
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Estado local: datos del usuario actual (email, token, roles)
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * Efecto que se ejecuta al montar el componente.
   * 
   * Configura listeners para:
   * 1. Cambios en localStorage (sincronización entre pestañas)
   * 2. Evento 'authStateChanged' (sincronización en la misma pestaña)
   * 
   * Se limpia automáticamente al desmontar para evitar memory leaks.
   */
  useEffect(() => {
    // Verificar estado inicial al cargar
    checkAuthStatus();

    // Registrar event listeners
    // Ambos eventos simplemente llaman a checkAuthStatus, así que pasamos la función directamente
    window.addEventListener('storage', checkAuthStatus);           // Entre pestañas
    window.addEventListener('authStateChanged', checkAuthStatus);  // Misma pestaña

    // Cleanup: remover listeners al desmontar
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authStateChanged', checkAuthStatus);
    };
  }, []);

  /**
   * Sincroniza el estado local de autenticación desde localStorage.
   * 
   * Lee los datos de sesión y usuario desde UserStorage y actualiza
   * los estados de React. Esto hace que la UI se re-renderice automáticamente
   * cuando cambia el estado de autenticación.
   * 
   * Flujo:
   * 1. Lee isUserLoggedIn() de localStorage
   * 2. Lee getCurrentUser() de localStorage
   * 3. Actualiza estados de React (dispara re-render)
   * 
   * Es llamado por:
   * - useEffect inicial (al montar)
   * - Event handlers (cuando cambia localStorage)
   * - login() y logout() (después de cambiar estado)
   */
  const checkAuthStatus = () => {
    const loggedIn = Storage.isUserLoggedIn();
    const user = Storage.getCurrentUser();
    setIsLoggedIn(loggedIn);
    setCurrentUser(user);
  };

  /**
   * Inicia sesión con el usuario proporcionado.
   * 
   * Guarda los datos del usuario en localStorage, actualiza el estado
   * local, y notifica a otros componentes mediante evento personalizado.
   * 
   * @param {Object} user - Datos del usuario autenticado
   * @param {string} user.email - Email del usuario
   * @param {string} user.token - Token JWT del backend
   * @param {Array<string>} user.roles - Roles del usuario
   * 
   * @returns {{success: boolean, error?: string}}
   * 
   * Efectos:
   * - Guarda usuario en localStorage (persistente)
   * - Actualiza estados React (UI reactiva)
   * - Dispara evento 'authStateChanged' (notifica otros componentes)
   * - Otros componentes con Auth() se actualizan automáticamente
   * 
   * Uso:
   * const result = login({ email, token, roles });
   * if (result.success) {
   *   // Redirigir a dashboard
   * }
   */
  const login = (user) => {
    // Guardar en localStorage mediante UserStorage
    const result = Storage.loginUser(user);

    if (result.success) {
      // Actualizar estados locales para re-render
      checkAuthStatus();

      // Disparar evento personalizado para notificar a otros componentes
      // Componentes que usen Auth() recibirán este evento y actualizarán su estado
      window.dispatchEvent(new Event('authStateChanged'));
    }

    return result;
  };

  /**
   * Cierra la sesión del usuario actual.
   * 
   * Elimina los datos del usuario de localStorage, actualiza el estado
   * local a "no autenticado", y notifica a otros componentes.
   * 
   * @returns {{success: boolean, error?: string}}
   * 
   * Efectos:
   * - Remueve usuario de localStorage
   * - Actualiza estados React (isLoggedIn = false, currentUser = null)
   * - Dispara evento 'authStateChanged'
   * - Todos los componentes con Auth() se actualizan
   * - Header, rutas protegidas, etc. reaccionan al cambio
   * 
   * Uso:
   * const result = logout();
   * if (result.success) {
   *   navigate('/login');
   * }
   */
  const logout = () => {
    // Limpiar datos del localStorage
    const result = Storage.logoutUser();

    if (result.success) {
      // Actualizar estados locales
      checkAuthStatus();

      // Notificar a otros componentes del cambio
      window.dispatchEvent(new Event('authStateChanged'));
    }

    return result;
  };

  /**
   * Retorna el objeto con estado y funciones de autenticación.
   * 
   * Este objeto es reactivo: cuando cambian los estados internos,
   * cualquier componente que use este hook se re-renderiza.
   */
  return {
    isLoggedIn,       // boolean: si hay sesión activa
    currentUser,      // Object|null: datos del usuario (incluye token, roles)
    login,            // función: iniciar sesión
    logout,           // función: cerrar sesión
    checkAuthStatus   // función: sincronizar estado manualmente (raro usar directamente)
  };
};