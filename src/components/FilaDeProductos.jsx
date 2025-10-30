// FilaDeProductos.js
import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import TarjetaProducto from './TarjetaProducto';
import '../styles/filaproductos.css';
import { initStorage, getProducts } from '../utils/MusicStorage';

/**
 * Muestra una fila responsive de tarjetas de productos.
 * @param {Object} props
 * @param {Array<Object>} [props.productos] - Lista de productos a renderizar.
 * @returns {JSX.Element}
 */
const FilaDeProductos = ({ productos }) => {
  // Objeto reactivo a cambios empieza con productos o vacio
  const [items, setItems] = useState(productos || []);
  // Función ejecutada al renderizar el objeto
  useEffect(() => {
    // Verifica que productos sea Array y tenga valores
    if (Array.isArray(productos) && productos.length) {
      // De ser así el items será el array ingresado 
      setItems(productos);
      return;
    }
    // Si no, se inicializará el MusicStorage y se obtendrán los productos de ahí
    initStorage();
    setItems(getProducts());
  }, [productos]);

  // Para cada producto se genera una columna con una tarjeta todo en una fila
  return (
    <div className="fila-productos">
      <Row id="fila">
        {items.map((producto, idx) => (
          <Col id='col-prod' key={producto.id || idx}>
            <TarjetaProducto producto={producto} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FilaDeProductos;
