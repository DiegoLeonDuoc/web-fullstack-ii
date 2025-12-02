import { Table, Button } from 'react-bootstrap';

/**
 * Tabla de sellos discográficos con acciones de edición/eliminación
 */
export default function SelloTable({ sellos, onEdit, onDelete }) {
    if (!sellos || sellos.length === 0) {
        return (
            <div className="text-center text-muted py-4">
                <p>No hay sellos registrados</p>
            </div>
        );
    }

    return (
        <Table className="dashboard-table" responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>País de Origen</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {sellos.map((sello) => (
                    <tr className="dashboard-table-row" key={sello.id}>
                        <td>{sello.id}</td>
                        <td>{sello.nombreSello}</td>
                        <td>{sello.paisOrigen}</td>
                        <td className="actions-cell">
                            <div className="d-flex gap-2">
                                <Button size="sm" variant="primary" onClick={() => onEdit(sello)}>
                                    <i className="fa fa-edit"></i> Editar
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => onDelete(sello.id)}>
                                    <i className="fa fa-trash"></i> Eliminar
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
