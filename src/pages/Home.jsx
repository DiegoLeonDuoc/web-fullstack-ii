// src/pages/Home.js
import React from 'react';
import FilaDeProductos from '../components/FilaDeProductos';
import { getProducts } from '../utils/MusicStorage';
//import { get_api_prod } from '../utils/MusicStorage';
import { useState, useEffect } from 'react';
/**
 * Página de inicio con productos recomendados.
 * @returns {JSX.Element}
 */
function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getProducts();
      setProductos(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-center mt-5">Cargando productos...</div>;

  const productos_recomendados = productos.slice(0, 10);
  const productos_mejores = productos.slice(10, 20);

  return (
    <div>
      <h2>Productos recomendados</h2>
      <FilaDeProductos productos={productos_recomendados} />
      <h2>Mejores productos</h2>
      <FilaDeProductos productos={productos_mejores} />
    </div>
  );
}

export default Home;

