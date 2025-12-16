import { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { isValidPrice } from '../utils/Utilidades';
import Storage from '../utils/UserStorage';

/**
 * Formulario reutilizable para la creación y edición de productos.
 * 
 * Características:
 * - Carga dinámica de artistas y sellos desde el backend.
 * - Validación de precio en tiempo real.
 * - Previsualización de imagen por URL.
 * - Modo creación vs edición basado en la prop `selectedProduct`.
 * 
 * @param {Object} props
 * @param {(product: Object) => Promise<boolean>} props.onSubmit - Función async que recibe los datos del formulario.
 * @param {Object} [props.selectedProduct] - Datos del producto a editar (null para crear).
 * @param {() => void} [props.onCancel] - Función para cancelar la edición.
 * @returns {JSX.Element} Formulario renderizado
 */
export default function ProductForm({ onSubmit, selectedProduct, onCancel }) {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    titulo: '', artista: '', formato: '', año: '', etiqueta: '', precio: '', descripcion: '', img: '', stock: 0,
  });

  // Estados de control de UI
  const [imgPreview, setImgPreview] = useState(null);
  const [priceError, setPriceError] = useState(false);
  const [artistas, setArtistas] = useState([]);
  const [sellos, setSellos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efecto: Cargar listas de opciones (artistas/sellos) al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = Storage.getCurrentUser();
        const headers = {
          'Authorization': user ? `Bearer ${user.token}` : ''
        };

        // 1. Obtener lista de artistas
        const artistasRes = await fetch('/api/v1/artistas', { headers });
        if (artistasRes.ok) {
          const artistasData = await artistasRes.json();
          const artistasList = artistasData._embedded?.artistaList || [];
          setArtistas(artistasList);
        }

        // 2. Obtener lista de sellos
        const sellosRes = await fetch('/api/v1/sellos', { headers });
        if (sellosRes.ok) {
          const sellosData = await sellosRes.json();
          const sellosList = sellosData._embedded?.selloList || [];
          setSellos(sellosList);
        }
      } catch (error) {
        console.error('Error cargando datos para el formulario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Efecto: Rellenar formulario cuando se selecciona un producto para editar
  useEffect(() => {
    if (selectedProduct) {
      setFormData(selectedProduct);
      setImgPreview(selectedProduct.img || null);
    } else {
      // Limpiar formulario si se deselecciona
      setImgPreview(null);
    }
  }, [selectedProduct]);

  /**
   * Maneja cambios en los inputs del formulario.
   * Actualiza el estado y realiza validaciones en tiempo real.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validar precio
    if (name === 'precio') {
      setPriceError(!isValidPrice(value));
    }

    // Actualizar previsualización de imagen
    if (name === 'img') {
      setImgPreview(value);
    }
  };

  /**
   * Envía el formulario.
   * Realiza validación final y llama al callback `onSubmit`.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de Bloqueo
    if (!isValidPrice(formData.precio)) {
      setPriceError(true);
      return;
    }

    // Ejecutar lógica de guardado (inyectada por el padre)
    const success = await onSubmit(formData);

    // Limpiar formulario solo si la operación fue exitosa
    if (success) {
      setFormData({ titulo: '', artista: '', formato: '', año: '', etiqueta: '', precio: '', descripcion: '', img: '', stock: 0 });
      setImgPreview(null);
    }
  };

  if (loading) {
    return (
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Cargando datos...</Card.Title>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{selectedProduct ? 'Editar Producto' : 'Agregar Producto'}</Card.Title>
        <Form onSubmit={handleSubmit}>
          {/* Título */}
          <Form.Group className="mb-2">
            <Form.Label>Título</Form.Label>
            <Form.Control name="titulo" value={formData.titulo} onChange={handleChange} required />
          </Form.Group>

          {/* Artista (Select Dinámico) */}
          <Form.Group className="mb-2">
            <Form.Label>Artista</Form.Label>
            <Form.Select name="artista" value={formData.artista} onChange={handleChange} required>
              <option value="">Seleccione un artista...</option>
              {artistas.map((artista) => (
                <option key={artista.id} value={artista.nombreArtista}>
                  {artista.nombreArtista}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Formato */}
          <Form.Group className="mb-2">
            <Form.Label>Formato</Form.Label>
            <Form.Select name="formato" value={formData.formato} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              <option value="Vinilo">Vinilo</option>
              <option value="CD">CD</option>
            </Form.Select>
          </Form.Group>

          {/* Año */}
          <Form.Group className="mb-2">
            <Form.Label>Año de publicación</Form.Label>
            <Form.Control name="año" type="number" value={formData.año} onChange={handleChange} min="1700" max={new Date().getFullYear()} placeholder="YYYY" required />
          </Form.Group>

          {/* Sello (Select Dinámico) */}
          <Form.Group className="mb-2">
            <Form.Label>Etiqueta</Form.Label>
            <Form.Select name="etiqueta" value={formData.etiqueta} onChange={handleChange} required>
              <option value="">Seleccione una etiqueta...</option>
              {sellos.map((sello) => (
                <option key={sello.id} value={sello.nombreSello}>
                  {sello.nombreSello}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Precio y Validaciones */}
          <Form.Group className="mb-2">
            <Form.Label>Precio</Form.Label>
            <Form.Control name="precio" type="number" value={formData.precio} onChange={handleChange} required min={1000} />
            {priceError && <Form.Text className="text-danger">El precio debe ser mayor o igual a $1.000</Form.Text>}
          </Form.Group>

          {/* Stock */}
          <Form.Group className="mb-2">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              min={0}
              placeholder="Cantidad disponible"
            />
          </Form.Group>

          {/* Descripción */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" name="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} required />
          </Form.Group>

          {/* Imagen y Previsualización */}
          <Form.Group className="mb-3">
            <Form.Label>Fuente de Imagen (URL)</Form.Label>
            <Form.Control
              name="img"
              type="url"
              value={formData.img}
              onChange={handleChange}
              placeholder="https://..."
              required
            />
            {/* Mostrar preview si es una URL válida */}
            {imgPreview && imgPreview.match(/^https?:\/\//) && (
              <div style={{ marginTop: 8 }}>
                <img src={imgPreview} alt="preview" style={{ maxWidth: '100%', height: 80, objectFit: 'contain', borderRadius: 4 }} />
              </div>
            )}
          </Form.Group>

          {/* Botones de Acción */}
          <div className="d-flex gap-2">
            <Button variant="primary" type="submit">
              {selectedProduct ? 'Actualizar' : 'Agregar'}
            </Button>
            {selectedProduct && (
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
