import { Table, Button, Image, Form } from 'react-bootstrap';
import { formatPrice } from '../utils/Utilidades';
import { useState } from 'react';

/**
 * Tabla administrativa para listar, editar y eliminar productos.
 * 
 * Características:
 * - Listado detallado de atributos del producto.
 * - Edición rápida de Stock (inline editing).
 * - Acciones CRUD: Editar (abre formulario) y Eliminar.
 * 
 * @param {Object} props
 * @param {Array<Object>} props.products - Lista de productos a mostrar.
 * @param {(product: Object) => void} props.onEdit - Callback al pulsar Editar.
 * @param {(id: string) => void} props.onDelete - Callback al pulsar Eliminar.
 * @param {(id: string, newStock: number) => void} props.onStockUpdate - Callback para persistir cambio de stock.
 * @returns {JSX.Element} Tabla renderizada o mensaje vacío
 */
export default function ProductTable({ products, onEdit, onDelete, onStockUpdate }) {
  // Estado local para gestionar la edición en línea del stock
  const [editingStock, setEditingStock] = useState({});

  if (!products.length)
    return <p className="text-center text-muted mt-3">No hay productos registrados.</p>;

  /**
   * Actualiza el estado temporal del stock mientras se escribe.
   */
  const handleStockChange = (id, value) => {
    setEditingStock({ ...editingStock, [id]: value });
  };

  /**
   * Persiste el cambio de stock al perder el foco (blur).
   * Valida que el valor sea numérico y positivo antes de llamar a onStockUpdate.
   */
  const handleStockBlur = (id) => {
    const newStock = editingStock[id];

    // Solo procesar si hay un valor editado
    if (newStock !== undefined && newStock !== '') {
      const stockValue = parseInt(newStock, 10);
      if (!isNaN(stockValue) && stockValue >= 0) {
        onStockUpdate(id, stockValue);
      }
    }

    // Limpiar estado de edición para este ID
    const newEditing = { ...editingStock };
    delete newEditing[id];
    setEditingStock(newEditing);
  };

  /**
   * Maneja la tecla Enter para confirmar la edición del stock.
   */
  const handleStockKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      e.target.blur(); // Dispara handleStockBlur
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
              {/* Input "Inline" para edición rápida de Stock */}
              <Form.Control
                type="number"
                min="0"
                size="sm"
                style={{ width: '80px' }}
                // Muestra el valor en edición O el valor real del producto
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
