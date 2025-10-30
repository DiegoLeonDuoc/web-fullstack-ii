import { Table, Button, Image } from 'react-bootstrap';

function formatPriceCLP(price) {
  if (typeof price === 'number') price = price.toString();
  const n = parseInt(price.replace(/[^\d]/g, ''));
  if (!n) return '$0';
  return '$' + n.toLocaleString('es-CL');
}

/**
 * Tabla de productos con acciones de edición/eliminación.
 * @param {Object} props
 * @param {Array<Object>} props.products - Lista de productos.
 * @param {(product: Object) => void} props.onEdit - Callback para editar un producto.
 * @param {(id: string) => void} props.onDelete - Callback para eliminar un producto.
 * @returns {JSX.Element}
 */
export default function ProductTable({ products, onEdit, onDelete }) {
  if (!products.length)
    return <p className="text-center text-muted mt-3">No hay productos registrados.</p>;

  return (
    <Table className="dashboard-table" responsive>
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Título</th>
          <th>Artista</th>
          <th>Formato</th>
          <th>Año</th>
          <th>Etiqueta</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr className="dashboard-table-row" key={p.id}>
            <td><Image src={p.img} alt={p.titulo} style={{ width: '50px' }} /></td>
            <td>{p.titulo}</td>
            <td>{p.artista}</td>
            <td>{p.formato}</td>
            <td>{p.año}</td>
            <td>{p.etiqueta}</td>
            <td>{formatPriceCLP(p.precio)}</td>
            <td className="actions-cell">
              <div className="actions-wrapper d-flex gap-2">
                <Button size="sm" variant="primary" onClick={() => onEdit(p)}>
                  Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(p.id)}>
                  Eliminar
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
