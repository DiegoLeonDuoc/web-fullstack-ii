import { Link } from 'react-router-dom';
import '../styles/tarjetaproducto.css';
import { formatPrice } from '../utils/Utilidades';

/**
 * Tarjeta visual de un producto del catálogo.
 * @param {Object} props
 * @param {Object} props.producto - Producto a mostrar.
 * @returns {JSX.Element}
 */
const TarjetaProducto = ({ producto }) => {
  const linkProducto = `/producto/${producto.id}`;

  return (
    <div className="card">
      <Link to={linkProducto}>
        <img id='imagen-carta' src={producto.img} alt={producto.alt} />
      </Link>
      <div className="card-body">
        <small id="formato">{producto.formato}</small>
        <small id="art-titulo">{producto.artista} - {producto.titulo}</small>
        {/* <small id="precio">{producto.precio.includes('$') ? producto.precio : ('$' + Number(producto.precio||0).toLocaleString('es-CL'))}</small> */}.
        <small id="precio">{formatPrice(producto.precio)}</small>
      </div>
    </div>
  );
};

export default TarjetaProducto;
