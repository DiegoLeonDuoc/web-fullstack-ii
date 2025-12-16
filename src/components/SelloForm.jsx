import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { addSello, updateSello } from '../utils/SelloStorage';

/**
 * Formulario para la gestión de Sellos Discográficos.
 * 
 * Permite crear nuevos sellos o editar existentes.
 * Utiliza funciones de `SelloStorage.js` para la comunicación con la API.
 * 
 * @param {Object} props
 * @param {Object} [props.selectedSello] - Objeto sello a editar (null para crear).
 * @param {() => void} props.onCancel - Callback para cancelar la operación.
 * @param {() => void} props.onSuccess - Callback ejecutado tras un guardado exitoso.
 * @returns {JSX.Element} Formulario renderizado
 */
export default function SelloForm({ selectedSello, onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
        nombreSello: '',
        paisOrigen: ''
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Efecto para cargar datos si se está editando
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

    /**
     * Envía los datos del formulario a la API.
     * Determina si es creación o actualización basándose en `selectedSello`.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (selectedSello) {
                // Modo Edición
                await updateSello(selectedSello.id, formData);
                setMessage({
                    type: 'success',
                    text: 'Sello actualizado exitosamente'
                });
            } else {
                // Modo Creación
                await addSello(formData);
                setMessage({
                    type: 'success',
                    text: 'Sello agregado exitosamente'
                });
            }

            // Limpiar formulario y notificar éxito
            setFormData({ nombreSello: '', paisOrigen: '' });
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessage({
                type: 'danger',
                text: error.message || 'Error al guardar sello'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>{selectedSello ? 'Editar Sello Discográfico' : 'Agregar Sello Discográfico'}</Card.Title>

                {/* Mensajes de retroalimentación (éxito/error) */}
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
