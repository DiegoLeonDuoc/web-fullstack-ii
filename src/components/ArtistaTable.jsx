import { Table, Button } from 'react-bootstrap';

/**
 * Tabla de artistas con acciones de edición/eliminación
 */
export default function ArtistaTable({ artistas, onEdit, onDelete }) {
    if (!artistas || artistas.length === 0) {
        return (
            <div className="text-center text-muted py-4">
                <p>No hay artistas registrados</p>
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
                {artistas.map((artista) => (
                    <tr className="dashboard-table-row" key={artista.id}>
                        <td>{artista.id}</td>
                        <td>{artista.nombreArtista}</td>
                        <td>{artista.paisOrigen}</td>
                        <td className="actions-cell">
                            <div className="d-flex gap-2">
                                <Button size="sm" variant="primary" onClick={() => onEdit(artista)}>
                                    <i className="fa fa-edit"></i> Editar
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => onDelete(artista.id)}>
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
