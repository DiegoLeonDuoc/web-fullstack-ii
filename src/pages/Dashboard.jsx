import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import { initStorage, getProducts, addProduct, updateProduct, deleteProduct } from '../utils/MusicStorage';
import { Auth } from '../utils/Auth';
import '../styles/dashboard.css';

/**
 * Panel de administración para gestionar productos.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const { isLoggedIn } = Auth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Wait a short tick for Auth to fully update from storage/effects
    const t = setTimeout(() => setAuthChecked(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    initStorage();
    setProducts(getProducts());
  }, [authChecked, isLoggedIn, navigate]);

  const handleAddOrUpdate = (data) => {
    if (selected) {
      updateProduct(selected.id, data);
      setProducts(getProducts());
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

  if (!authChecked) {
    return <Container className="py-5 d-flex justify-content-center"><Spinner animation="border" /></Container>;
  }

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
