import { Link } from 'react-router-dom';
import '../styles/FilaDeProductos.css';

const TarjetaProducto = ({producto}) => {
  console.log(producto); // Check the entire object
console.log(producto.titulo); 
  
  const linkProducto = function(producto) {
    return (
      '/producto/'+(producto.titulo.toLowerCase()+' '+producto.formato.toLowerCase()).replace(/\s+/g, '-')
    )
  }



  return (
    <div className="card">
      <Link to={linkProducto(producto)}>
        <img className='imagen-carta' src={producto.img} alt={producto.alt} />
      </Link>
      <div className="card-body">
        <small className="formato">{producto.formato}</small>
        <small className="art-titulo">{producto.artista} - {producto.titulo}</small>
        <small className="precio">{'$ ' + producto.precio}</small>
      </div>
    </div>
  );
};

export default TarjetaProducto;
