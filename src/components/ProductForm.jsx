import { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { isValidPrice } from '../utils/Utilidades';
import Storage from '../utils/UserStorage';

/**
 * Formulario para crear/editar productos del catálogo.
 * @param {Object} props
 * @param {(product: Object) => void} props.onSubmit - Callback al enviar el formulario.
 * @param {Object} [props.selectedProduct] - Producto seleccionado para edición.
 * @param {() => void} [props.onCancel] - Callback al cancelar edición.
 * @returns {JSX.Element}
 */
export default function ProductForm({ onSubmit, selectedProduct, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '', artista: '', formato: '', año: '', etiqueta: '', precio: '', descripcion: '', img: '',
  });
  const [imgPreview, setImgPreview] = useState(null);
  const [priceError, setPriceError] = useState(false);
  const [artistas, setArtistas] = useState([]);
  const [sellos, setSellos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener artistas y sellos desde la base de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = Storage.getCurrentUser();
        const headers = {
          'Authorization': user ? `Bearer ${user.token}` : ''
        };

        // Obtener artistas
        const artistasRes = await fetch('/api/v1/artistas', { headers });
        if (artistasRes.ok) {
          const artistasData = await artistasRes.json();
          // Extraer artistas de la respuesta HATEOAS
          const artistasList = artistasData._embedded?.artistaList || [];
          setArtistas(artistasList);
        }

        // Obtener sellos
        const sellosRes = await fetch('/api/v1/sellos', { headers });
        if (sellosRes.ok) {
          const sellosData = await sellosRes.json();
          // Extraer sellos de la respuesta HATEOAS
          const sellosList = sellosData._embedded?.selloList || [];
          setSellos(sellosList);
        }
      } catch (error) {
        console.error('Error fetching artists/labels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setFormData(selectedProduct);
      setImgPreview(selectedProduct.img || null);
    } else {
      setImgPreview(null);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'precio') {
      setPriceError(!isValidPrice(value));
    }
    if (name === 'img') {
      setImgPreview(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidPrice(formData.precio)) {
      setPriceError(true);
      return;
    }
    onSubmit(formData);
    setFormData({ titulo: '', artista: '', formato: '', año: '', etiqueta: '', precio: '', descripcion: '', img: '' });
    setImgPreview(null);
  };

  if (loading) {
    return (
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Cargando...</Card.Title>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{selectedProduct ? 'Editar Producto' : 'Agregar Producto'}</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Título</Form.Label>
            <Form.Control name="titulo" value={formData.titulo} onChange={handleChange} required />
          </Form.Group>
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
          <Form.Group className="mb-2">
            <Form.Label>Formato</Form.Label>
            <Form.Select name="formato" value={formData.formato} onChange={handleChange} required>
              <option value="">Seleccione...</option>
              <option value="Vinilo">Vinilo</option>
              <option value="CD">CD</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Año de publicación</Form.Label>
            <Form.Control name="año" type="number" value={formData.año} onChange={handleChange} min="1700" max={new Date().getFullYear()} placeholder="YYYY" required />
          </Form.Group>
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
          <Form.Group className="mb-2">
            <Form.Label>Precio</Form.Label>
            <Form.Control name="precio" type="number" value={formData.precio} onChange={handleChange} required min={1000} />
            {priceError && <Form.Text className="text-danger">El precio debe ser mayor o igual a $1.000</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" name="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fuente de Imagen (URL)</Form.Label>
            <Form.Control name="img" type="url" value={formData.img} onChange={handleChange} placeholder="https://..." />
            {imgPreview && imgPreview.match(/^https?:\/\//) && (
              <div style={{ marginTop: 8 }}>
                <img src={imgPreview} alt="preview" style={{ maxWidth: '100%', height: 80, objectFit: 'contain', borderRadius: 4 }} />
              </div>
            )}
          </Form.Group>
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
