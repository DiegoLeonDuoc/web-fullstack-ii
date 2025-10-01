import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer-custom">
        <div className="footer-izq">
        <h3>Beat<span>Bazar</span></h3>
        <p className="footer-links">
        <Link to="/">Inicio</Link> ·
        <Link to="/mision">Misión</Link> ·
        <Link to="/vision">Visión</Link> ·
        <Link to="/contacto">Contacto</Link>
        </p>
        <p className="footer-company-name">
        Beat Bazar © 2025
        </p>
        <div className="footer-iconos">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
        <img src="https://www.facebook.com/favicon.ico" alt="Facebook" width="24" height="24"/>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <img src="https://twitter.com/favicon.ico" alt="Twitter" width="24" height="24"/>
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
        <img src="https://www.linkedin.com/favicon.ico" alt="LinkedIn" width="24" height="24"/>
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
        <img src="https://github.com/favicon.ico" alt="GitHub" width="24" height="24"/>
        </a>
        </div>
        </div>

        <div className="footer-right">
        <p>Contacto</p>
        <form action="#" method="post">
        <input type="text" name="email" placeholder="Email" />
        <textarea name="message" placeholder="Mensaje"></textarea>
        <button>Enviar</button>
        </form>
        </div>
        </footer>
    );
}

export default Footer;
