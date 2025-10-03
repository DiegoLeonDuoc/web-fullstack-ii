import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/FilaDeProductos.css';

const FilaDeProductos = ({productos}) => {
  const linkProducto = function(producto) {
    return (
      '/producto/'+(producto.titulo.toLowerCase()+' '+producto.formato.toLowerCase()).replace(/\s+/g, '-')
    )
  }

  return (
    <div className="fila-productos">
      <Row className="flex-nowrap">
        { productos.map((producto, idx) => (
          <Col id='col-prod' key={idx}>
            <div className="card">
              <Link to={linkProducto(producto)}>
                <img id='imagen-carta' src={producto.img} alt={producto.alt} />
              </Link>
              <div className="card-body">
                <small id="formato">{producto.formato}</small>
                <small id="art-titulo">{producto.artista} - {producto.titulo}</small>
                <small id="precio">{'$ '+producto.precio}</small>
              </div>
            </div>
          </Col>
          )
        )}
      </Row>
    </div>
  );
};

export default FilaDeProductos;
