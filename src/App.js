import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Producto from './pages/Producto';
import Mision from './pages/Mision';
import Vision from './pages/Vision';
import Contacto from './pages/Contacto';

function App() {
  return (
    <div>
      <Header/>
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/producto/:id" element={<Producto/>} />
          <Route path="/mision" element={<Mision/>} />
          <Route path="/vision" element={<Vision/>} />
          <Route path="/contacto" element={<Contacto/>} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
