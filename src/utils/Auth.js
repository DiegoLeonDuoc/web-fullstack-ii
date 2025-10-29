import { useState, useEffect } from 'react';
import Storage from './UserStorage';

export const Auth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
    
    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    // Escuchar evento de estado de auth dentro de la misma pestaña
    const handleAuthEvent = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthEvent);
    };
  }, []);

  /**
   * Sincroniza el estado local de autenticación desde el almacenamiento.
   * - Lee banderas de sesión y usuario actual.
   * - Ajusta estados React para que la UI reaccione.
   */
  const checkAuthStatus = () => {
    const loggedIn = Storage.isUserLoggedIn();
    const user = Storage.getCurrentUser();
    setIsLoggedIn(loggedIn);
    setCurrentUser(user);
  };

  /**
   * Inicia sesión con el usuario entregado y actualiza el estado.
   * - Persiste sesión mediante Storage.
   * - Refresca estados locales.
   * - Emite evento para que otros componentes puedan reaccionar.
   */
  const login = (user) => {
    const result = Storage.loginUser(user);
    if (result.success) {
      checkAuthStatus();
      // Disparar evento personalizado para notificar a otros componentes
      window.dispatchEvent(new Event('authStateChanged'));
    }
    return result;
  };

  /**
   * Cierra sesión del usuario actual y actualiza el estado.
   * - Limpia usuario actual y marca la sesión como cerrada.
   * - Refresca estados y emite evento.
   */
  const logout = () => {
    const result = Storage.logoutUser();
    if (result.success) {
      checkAuthStatus();
      window.dispatchEvent(new Event('authStateChanged'));
    }
    return result;
  };

  return {
    isLoggedIn,
    currentUser,
    login,
    logout,
    checkAuthStatus
  };
};