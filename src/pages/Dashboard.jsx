import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import { initStorage, getProducts, addProduct, updateProduct, deleteProduct } from '../utils/MusicStorage';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    initStorage();
    setProducts(getProducts());
  }, []);

  const handleAddOrUpdate = (data) => {
    if (selected) {
      const updatedList = updateProduct(selected.id, data);
      setProducts(updatedList);
      setSelected(null);
    } else {
      const newProduct = addProduct(data);
      setProducts((p) => [...p, newProduct]);
    }
  };

  const handleDelete = (id) => {
    const updated = deleteProduct(id);
    setProducts(updated);
  };

  return (
    <Container className="dashboard-container">
      <h2 className="text-center mb-4">Panel de Administración — Productos</h2>
      <Row>
        <Col md={4}>
          <ProductForm
            onSubmit={handleAddOrUpdate}
            selectedProduct={selected}
            onCancel={() => setSelected(null)}
          />
        </Col>
        <Col md={8}>
          <ProductTable
            products={products}
            onEdit={(p) => setSelected(p)}
            onDelete={handleDelete}
          />
        </Col>
      </Row>
    </Container>
  );
}
