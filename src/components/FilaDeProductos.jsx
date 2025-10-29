// FilaDeProductos.js
import { Row, Col } from 'react-bootstrap';
import TarjetaProducto from './TarjetaProducto';
import '../styles/filaproductos.css';

/**
 * Muestra una fila responsive de tarjetas de productos.
 * @param {Object} props
 * @param {Array<Object>} props.productos - Lista de productos a renderizar.
 * @returns {JSX.Element}
 */
const FilaDeProductos = ({ productos }) => {
  return (
    <div className="fila-productos">
      <Row id="fila">
        {productos.map((producto, idx) => (
          <Col id='col-prod' key={idx}>
            <TarjetaProducto producto={producto} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FilaDeProductos;
