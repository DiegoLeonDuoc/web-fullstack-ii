import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="header-component" role="banner">
        <div className="header-left">
        <Link to="/" className="logo">
        <img src="/favicon.ico" alt="Beat Bazaar logo" />
        </Link>
        <nav aria-label="Main navigation">
        <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/mision">Misión</Link></li>
        <li><Link to="/vision">Visión</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        </ul>
        </nav>
        </div>

        <div className="header-right">
        <div className="search-bar" role="search">
        <input type="text" placeholder="Buscar producto..." aria-label="Buscar producto" />
        <button type="button">Buscar</button>
        </div>
        <div className="cart">
        <Link to="/carrito"><i className="fa fa-shopping-cart"></i></Link>
        </div>
        <div className="user-account">
        <Link to="/registro">Registrarse</Link> "/" <Link to="/login">Iniciar sesión</Link>
        </div>
        </div>
        </header>
    );
}

export default Header;
