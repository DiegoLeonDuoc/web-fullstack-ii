import { Table, Button, Image } from 'react-bootstrap';

export default function ProductTable({ products, onEdit, onDelete }) {
  if (!products.length)
    return <p className="text-center text-muted mt-3">No hay productos registrados.</p>;

  return (
    <Table striped bordered hover responsive>
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
          <tr key={p.id}>
            <td><Image src={p.img} alt={p.titulo} style={{ width: '50px' }} /></td>
            <td>{p.titulo}</td>
            <td>{p.artista}</td>
            <td>{p.formato}</td>
            <td>{p.año}</td>
            <td>{p.etiqueta}</td>
            <td>{p.precio}</td>
            <td className="d-flex gap-2">
              <Button size="sm" variant="outline-primary" onClick={() => onEdit(p)}>
                Editar
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => onDelete(p.id)}>
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
