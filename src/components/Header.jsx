// Header.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '../utils/Auth';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout } = Auth();
  const [showMenu, setShowMenu] = useState(false);

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
        <div className="cart">
          <Link to="/carrito"><i className="fa fa-shopping-cart"></i></Link>
        </div>
        <div className="user-account">
          {isLoggedIn ? (
            <div className="user-menu">
              <div className="user-avatar" title={`${currentUser?.firstName} ${currentUser?.lastName}`}>
                {currentUser ? (
                  <span className="avatar-initials">
                    {getInitials(currentUser.firstName, currentUser.lastName)}
                  </span>
                ) : (
                  <i className="fa fa-user"></i>
                )}
              </div>
              <div className="user-dropdown">
                <div className="user-info">
                  <strong>{currentUser?.firstName} {currentUser?.lastName}</strong>
                  <span>{currentUser?.email}</span>
                </div>
                <Link to="/perfil" className="dropdown-item">
                  <i className="fa fa-user"></i> Mi Perfil
                </Link>
                <Link to="/pedidos" className="dropdown-item">
                  <i className="fa fa-shopping-bag"></i> Mis Pedidos
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="dropdown-item logout-btn"
                >
                  <i className="fa fa-sign-out"></i> Cerrar Sesión
                </button>
              </div>
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
