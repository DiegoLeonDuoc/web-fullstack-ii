// Header.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '../utils/Auth';
import ShoppingCartIcon from './ShoppingCartIcon';
// import Storage removed: no longer showing password hash

/**
 * Encabezado principal con navegación, búsqueda y usuario/sesión.
 * @returns {JSX.Element}
 */
function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout } = Auth();
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName = currentUser
    ? ([currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ').trim()
      || currentUser.email
      || 'Usuario')
    : '';

  const avatarInitials = (() => {
    const initials =
      `${currentUser?.firstName?.charAt(0) || ''}${currentUser?.lastName?.charAt(0) || ''}`.trim();
    if (initials) return initials.toUpperCase();
    if (currentUser?.email) return currentUser.email.charAt(0).toUpperCase();
    return null;
  })();

  // Escuchar cambios de autenticación
  useEffect(() => {
    const handleAuthChange = () => {
      // Esto forzará el rerender del componente
      window.dispatchEvent(new Event('forceUpdate'));
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  // Hash visualization removed

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goCategoria = (formato) => {
    setShowMenu(false);
    navigate(`/catalogo?formato=${encodeURIComponent(formato)}`);
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <header className="header-component" role="banner">
      <div className="header-left">
        <Link to="/" className="logo">
          <img src="/favicon.ico" alt="Beat Bazaar logo" />
        </Link>
        <nav aria-label="Main navigation">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><Link to="/mision">Misión</Link></li>
            <li><Link to="/vision">Visión</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            {isLoggedIn && currentUser?.roles?.includes('ROLE_ADMIN') && <li><Link to="/dashboard">Dashboard</Link></li>}
          </ul>
        </nav>
      </div>

      <div className="header-right">
        <div className="me-3 header-dropdown-container">
          <button
            type="button"
            aria-label="Abrir menú"
            className="btn btn-outline-light"
            onClick={() => setShowMenu((s) => !s)}
          >
            <span className="fa fa-bars" />
          </button>
          {showMenu && (
            <div className="dropdown-menu show header-dropdown-menu">
              <button className="dropdown-item" onClick={() => goCategoria('CD')}>CD</button>
              <button className="dropdown-item" onClick={() => goCategoria('Vinilo')}>Vinilo</button>
            </div>
          )}
        </div>
        <div className="search-bar" role="search">
          <input type="text" placeholder="Buscar producto..." aria-label="Buscar producto" />
          <button type="button">Buscar</button>
        </div>
        <ShoppingCartIcon />
        <div className="user-account">
          {isLoggedIn ? (
            <div className="user-menu header-dropdown-container">
              <button
                type="button"
                className="user-avatar btn btn-outline-light"
                title={displayName}
                onClick={() => setShowUserMenu((s) => !s)}
              >
                {avatarInitials ? (
                  <span className="avatar-initials">{avatarInitials}</span>
                ) : (
                  <i className="fa fa-user" aria-hidden="true"></i>
                )}
              </button>
              {showUserMenu && (
                <div className="dropdown-menu show user-menu-dropdown">
                  <div className="px-3 py-2 border-bottom">
                    <div className="small text-muted">Conectado como</div>
                    <strong>{displayName}</strong>
                    {currentUser?.email && (
                      <div className="small text-muted mt-1">{currentUser.email}</div>
                    )}
                    {currentUser?.roles?.includes('ROLE_ADMIN') && (
                      <span className="badge bg-primary mt-2">
                        <i className="fa fa-shield me-1"></i> Administrador
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    <i className="fa fa-sign-out"></i> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/registro">Registrarse</Link> / <Link to="/login">Iniciar sesión</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
