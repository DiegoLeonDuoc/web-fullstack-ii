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
  // Removed password hash visualization for cleaner UI

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
            {isLoggedIn && <li><Link to="/dashboard">Dashboard</Link></li>}
          </ul>
        </nav>
      </div>

      <div className="header-right">
        <div className="me-3" style={{ position: 'relative' }}>
          <button
            type="button"
            aria-label="Abrir menú"
            className="btn btn-outline-light"
            onClick={() => setShowMenu((s) => !s)}
          >
            <span className="fa fa-bars" />
          </button>
          {showMenu && (
            <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute' }}>
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
            <div className="user-menu" style={{ position: 'relative' }}>
              <button
                type="button"
                className="user-avatar btn btn-outline-light"
                title={`${currentUser?.firstName} ${currentUser?.lastName}`}
                onClick={() => setShowUserMenu((s) => !s)}
              >
                {currentUser ? (
                  <span className="avatar-initials">
                    {getInitials(currentUser.firstName, currentUser.lastName)}
                  </span>
                ) : (
                  <i className="fa fa-user"></i>
                )}
              </button>
              {showUserMenu && (
                <div
                  className="dropdown-menu show"
                  style={{ display: 'block', right: 0, left: 'auto', position: 'absolute', minWidth: '220px' }}
                >
                  <div className="px-3 py-2 border-bottom">
                    <div className="small text-muted">Bienvenido</div>
                    <strong>{currentUser?.firstName} {currentUser?.lastName}</strong>
                  </div>
                  <button type="button" className="dropdown-item" onClick={() => { /* visual only */ }}>
                    <i className="fa fa-user"></i> Perfil
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => { /* visual only */ }}>
                    <i className="fa fa-shopping-bag"></i> Mis compras
                  </button>
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
