import { useParams } from 'react-router-dom';

function Producto() {
    const { id } = useParams(); // Get the id parameter from the URL
    console.log(useParams());
    return (
        <div>
            <h2>Producto: {id}</h2>
            TODO: Página de producto en base a detalles del producto
        </div>
    );
}

export default Producto;
