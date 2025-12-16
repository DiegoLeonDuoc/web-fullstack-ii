import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { addArtista, updateArtista } from '../utils/ArtistaStorage';

/**
 * Formulario para la gestión de Artistas.
 * 
 * Permite crear nuevos artistas o editar existentes.
 * Utiliza funciones de `ArtistaStorage.js` para la comunicación con la API.
 * Filtra propiedades no deseadas (como _links) al cargar datos de HATEOAS.
 * 
 * @param {Object} props
 * @param {Object} [props.selectedArtista] - Objeto artista a editar (null para crear).
 * @param {() => void} props.onCancel - Callback para cancelar la operación.
 * @param {() => void} props.onSuccess - Callback ejecutado tras un guardado exitoso.
 * @returns {JSX.Element} Formulario renderizado
 */
export default function ArtistaForm({ selectedArtista, onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
        nombreArtista: '',
        paisOrigen: ''
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Efecto para cargar datos si se está editando
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

    /**
     * Envía los datos del formulario a la API.
     * Determina si es creación o actualización basándose en `selectedArtista`.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (selectedArtista) {
                // Modo Edición
                await updateArtista(selectedArtista.id, formData);
                setMessage({
                    type: 'success',
                    text: 'Artista actualizado exitosamente'
                });
            } else {
                // Modo Creación
                await addArtista(formData);
                setMessage({
                    type: 'success',
                    text: 'Artista agregado exitosamente'
                });
            }

            // Limpiar formulario y notificar éxito
            setFormData({ nombreArtista: '', paisOrigen: '' });
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessage({
                type: 'danger',
                text: error.message || 'Error al guardar artista'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>{selectedArtista ? 'Editar Artista' : 'Agregar Artista'}</Card.Title>

                {/* Mensajes de retroalimentación (éxito/error) */}
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
