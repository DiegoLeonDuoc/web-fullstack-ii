import { useState, useEffect } from 'react';
import Storage from './Storage';

export const Auth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
    
    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkAuthStatus = () => {
    const loggedIn = Storage.isUserLoggedIn();
    const user = Storage.getCurrentUser();
    setIsLoggedIn(loggedIn);
    setCurrentUser(user);
  };

  const login = (user) => {
    const result = Storage.loginUser(user);
    if (result.success) {
      checkAuthStatus();
      // Disparar evento personalizado para notificar a otros componentes
      window.dispatchEvent(new Event('authStateChanged'));
    }
    return result;
  };

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