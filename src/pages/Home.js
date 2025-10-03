// src/pages/Home.js
import React from 'react';
import FilaDeProductos from '../components/FilaDeProductos';
import DataFilas from '../data/DataFilas';

function Home() {
    return (
        <div>
            <h2>Productos</h2>
            <FilaDeProductos productos={DataFilas().recomendacionesSlides}/>
        </div>
    );
}

export default Home;
