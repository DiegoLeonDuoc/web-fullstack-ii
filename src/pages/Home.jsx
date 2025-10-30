// src/pages/Home.js
import React from 'react';
import FilaDeProductos from '../components/FilaDeProductos';
import { getProducts } from '../utils/MusicStorage';

/**
 * Página de inicio con productos recomendados.
 * @returns {JSX.Element}
 */
function Home() {
  const productos_recomendados = getProducts().slice(0, 10);
  const productos_mejores = getProducts().slice(10, 20);
  return (
    <div>
      <h2>Productos recomendados</h2>
      <FilaDeProductos productos={productos_recomendados}/>
      <h2>Mejores productos</h2>
      <FilaDeProductos productos={productos_mejores}/>
    </div>
  );
}

export default Home;
