import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Producto from './pages/Producto';
import Mision from './pages/Mision';
import Vision from './pages/Vision';
import Contacto from './pages/Contacto';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div>
      <Header/>
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/catalogo" element={<Catalogo/>} />
          <Route path="/producto/:id" element={<Producto/>} />
          <Route path="/mision" element={<Mision/>} />
          <Route path="/vision" element={<Vision/>} />
          <Route path="/contacto" element={<Contacto/>} />
          <Route path="/registro" element={<Registro/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
