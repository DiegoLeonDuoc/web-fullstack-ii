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
  const [items, setItems] = useState(productos || []);

  useEffect(() => {
    if (Array.isArray(productos) && productos.length) {
      setItems(productos);
      return;
    }
    initStorage();
    setItems(getProducts());
  }, [productos]);

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
