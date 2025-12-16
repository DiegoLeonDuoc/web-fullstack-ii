import { Table, Button, Image, Form } from 'react-bootstrap';
import { formatPrice } from '../utils/Utilidades';
import { useState } from 'react';

/**
 * Tabla de productos con acciones de edición/eliminación.
 * @param {Object} props
 * @param {Array<Object>} props.products - Lista de productos.
 * @param {(product: Object) => void} props.onEdit - Callback para editar un producto.
 * @param {(id: string) => void} props.onDelete - Callback para eliminar un producto.
 * @param {(id: string, newStock: number) => void} props.onStockUpdate - Callback para actualizar stock.
 * @returns {JSX.Element}
 */
export default function ProductTable({ products, onEdit, onDelete, onStockUpdate }) {
  const [editingStock, setEditingStock] = useState({});

  if (!products.length)
    return <p className="text-center text-muted mt-3">No hay productos registrados.</p>;

  const handleStockChange = (id, value) => {
    setEditingStock({ ...editingStock, [id]: value });
  };

  const handleStockBlur = (id) => {
    const newStock = editingStock[id];
    if (newStock !== undefined && newStock !== '') {
      const stockValue = parseInt(newStock, 10);
      if (!isNaN(stockValue) && stockValue >= 0) {
        onStockUpdate(id, stockValue);
      }
    }
    // Clear editing state
    const newEditing = { ...editingStock };
    delete newEditing[id];
    setEditingStock(newEditing);
  };

  const handleStockKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

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
          <th>Stock</th>
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
            <td>{formatPrice(p.precio)}</td>
            <td>
              <Form.Control
                type="number"
                min="0"
                size="sm"
                style={{ width: '80px' }}
                value={editingStock[p.id] !== undefined ? editingStock[p.id] : (p.stock || 0)}
                onChange={(e) => handleStockChange(p.id, e.target.value)}
                onBlur={() => handleStockBlur(p.id)}
                onKeyPress={(e) => handleStockKeyPress(e, p.id)}
              />
            </td>
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
