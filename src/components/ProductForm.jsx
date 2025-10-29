import { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

export default function ProductForm({ onSubmit, selectedProduct, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    artista: '',
    formato: '',
    año: '',
    etiqueta: '',
    precio: '',
    descripcion: '',
    img: '',
  });

  useEffect(() => {
    if (selectedProduct) setFormData(selectedProduct);
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      titulo: '',
      artista: '',
      formato: '',
      año: '',
      etiqueta: '',
      precio: '',
      descripcion: '',
      img: '',
    });
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{selectedProduct ? 'Editar Producto' : 'Agregar Producto'}</Card.Title>
        <Form onSubmit={handleSubmit}>
          {['Título','Artista','Formato','Año de publicación','Etiqueta','Precio','Fuente de Imagen'].map((f)=>(
            <Form.Group className="mb-2" key={f}>
              <Form.Label>{f}</Form.Label>
              <Form.Control name={f} value={formData[f]} onChange={handleChange} required />
            </Form.Group>
          ))}
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" name="descripcion" rows={2}
              value={formData.descripcion} onChange={handleChange} required />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button variant="primary" type="submit">
              {selectedProduct ? 'Actualizar' : 'Agregar'}
            </Button>
            {selectedProduct && (
              <Button variant="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
