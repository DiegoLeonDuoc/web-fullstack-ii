import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import { ShoppingCartProvider } from './components/ShoppingCartContext';

// Bootstrap CSS & JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// FontAwesome (CSS version)
import "@fortawesome/fontawesome-free/css/all.min.css";

import './styles/styles.css';
import './styles/index.css';
import './styles/header.css';
import './styles/footer.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <ShoppingCartProvider>
    <App />
    </ShoppingCartProvider>
  </Router>
);
