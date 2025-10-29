// src/pages/Home.js
import React from 'react';
import FilaDeProductos from '../components/FilaDeProductos';
import DataFilas from '../data/DataFilas';

/**
 * Página de inicio con productos recomendados.
 * @returns {JSX.Element}
 */
function Home() {
  return (
    <div>
      <h2>Productos recomendados</h2>
      <FilaDeProductos productos={DataFilas().recomendacionesSlides}/>
    </div>
  );
}

export default Home;
