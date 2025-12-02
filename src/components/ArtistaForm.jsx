import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import Storage from '../utils/UserStorage';

/**
 * Formulario para agregar/editar artistas
 */
export default function ArtistaForm({ selectedArtista, onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
        nombreArtista: '',
        paisOrigen: ''
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedArtista) {
            setFormData({
                nombreArtista: selectedArtista.nombreArtista,
                paisOrigen: selectedArtista.paisOrigen
            });
        } else {
            setFormData({ nombreArtista: '', paisOrigen: '' });
        }
    }, [selectedArtista]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const user = Storage.getCurrentUser();
            const url = selectedArtista
                ? `/api/v1/artistas/${selectedArtista.id}`
                : '/api/v1/artistas';
            const method = selectedArtista ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user ? `Bearer ${user.token}` : ''
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: selectedArtista ? 'Artista actualizado exitosamente' : 'Artista agregado exitosamente'
                });
                setFormData({ nombreArtista: '', paisOrigen: '' });
                if (onSuccess) onSuccess();
            } else {
                const errorData = await response.json().catch(() => ({}));
                setMessage({ type: 'danger', text: errorData.message || 'Error al guardar artista' });
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Error de conexión: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>{selectedArtista ? 'Editar Artista' : 'Agregar Artista'}</Card.Title>
                {message && (
                    <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
                        {message.text}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-2">
                        <Form.Label>Nombre del Artista</Form.Label>
                        <Form.Control
                            name="nombreArtista"
                            value={formData.nombreArtista}
                            onChange={handleChange}
                            placeholder="Ej: The Beatles"
                            required
                        />
                    </Form.Group>
                    <div className="d-flex gap-2">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : (selectedArtista ? 'Actualizar' : 'Agregar')}
                        </Button>
                        {selectedArtista && (
                            <Button variant="secondary" onClick={onCancel} type="button">
                                Cancelar
                            </Button>
                        )}
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}
