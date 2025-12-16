// Header.js
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '../utils/Auth';
import ShoppingCartIcon from './ShoppingCartIcon';

/**
 * Componente de encabezado global de la aplicación.
 * 
 * Funcionalidades principales:
 * 1. Navegación principal (Inicio, Catálogo, etc.)
 * 2. Gestión de sesión de usuario (Login/Logout)
 * 3. Menu de administración (visible solo para roles ADMIN)
 * 4. Carrito de compras y búsqueda
 * 5. Menú responsivo para móviles
 * 
 * @returns {JSX.Element} Elemento header renderizado
 */
function Header() {
  const navigate = useNavigate();
  // Hook personalizado de autenticación para obtener estado y funciones
  const { isLoggedIn, currentUser, logout } = Auth();

  // Estados para controlar la visibilidad de menús desplegables
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Derivar el nombre a mostrar (Nombre completo > Email > 'Usuario')
  const displayName = currentUser
    ? ([currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ').trim()
      || currentUser.email
      || 'Usuario')
    : '';

  // Calcular iniciales para el avatar de usuario
  const avatarInitials = (() => {
    const initials =
      `${currentUser?.firstName?.charAt(0) || ''}${currentUser?.lastName?.charAt(0) || ''}`.trim();
    if (initials) return initials.toUpperCase();
    if (currentUser?.email) return currentUser.email.charAt(0).toUpperCase();
    return null;
  })();

  // Efecto para sincronizar cambios de autenticación entre pestañas/componentes
  useEffect(() => {
    const handleAuthChange = () => {
      // Forzar re-render cuando cambia el estado de auth (login/logout en otra pestaña)
      window.dispatchEvent(new Event('forceUpdate'));
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  /**
   * Maneja el cierre de sesión del usuario.
   * Limpia el almacenamiento y redirige al inicio.
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /**
   * Navegación rápida a categorías desde el menú móvil.
   * @param {string} formato - Formato a filtrar (CD, Vinilo)
   */
  const goCategoria = (formato) => {
    setShowMenu(false);
    navigate(`/catalogo?formato=${encodeURIComponent(formato)}`);
  }

  return (
    <header className="header-component" role="banner">
      {/* Sección Izquierda: Logo y Navegación Principal */}
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
            {/* Enlaces exclusivos para administradores */}
            {isLoggedIn && currentUser?.roles?.includes('ROLE_ADMIN') && (
              <>
                <li><Link to="/admin">Admin</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Sección Derecha: Búsqueda, Carrito y Usuario */}
      <div className="header-right">
        {/* Menú Móvil (Hamburguesa) */}
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

        {/* Barra de Búsqueda */}
        <div className="search-bar" role="search">
          <input type="text" placeholder="Buscar producto..." aria-label="Buscar producto" />
          <button type="button">Buscar</button>
        </div>

        <ShoppingCartIcon />

        {/* Menú de Usuario */}
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

              {/* Dropdown de Usuario */}
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
