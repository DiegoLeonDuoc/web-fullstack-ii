import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import Storage from '../utils/UserStorage';

/**
 * Formulario para agregar/editar sellos discográficos
 */
export default function SelloForm({ selectedSello, onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
        nombreSello: '',
        paisOrigen: ''
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedSello) {
            setFormData({
                nombreSello: selectedSello.nombreSello,
                paisOrigen: selectedSello.paisOrigen
            });
        } else {
            setFormData({ nombreSello: '', paisOrigen: '' });
        }
    }, [selectedSello]);

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
            const url = selectedSello
                ? `/api/v1/sellos/${selectedSello.id}`
                : '/api/v1/sellos';
            const method = selectedSello ? 'PUT' : 'POST';

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
                    text: selectedSello ? 'Sello actualizado exitosamente' : 'Sello agregado exitosamente'
                });
                setFormData({ nombreSello: '', paisOrigen: '' });
                if (onSuccess) onSuccess();
            } else {
                const errorData = await response.json().catch(() => ({}));
                setMessage({ type: 'danger', text: errorData.message || 'Error al guardar sello' });
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
                <Card.Title>{selectedSello ? 'Editar Sello Discográfico' : 'Agregar Sello Discográfico'}</Card.Title>
                {message && (
                    <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
                        {message.text}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-2">
                        <Form.Label>Nombre del Sello</Form.Label>
                        <Form.Control
                            name="nombreSello"
                            value={formData.nombreSello}
                            onChange={handleChange}
                            placeholder="Ej: Capitol Records"
                            required
                        />
                    </Form.Group>
                    <div className="d-flex gap-2">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : (selectedSello ? 'Actualizar' : 'Agregar')}
                        </Button>
                        {selectedSello && (
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
