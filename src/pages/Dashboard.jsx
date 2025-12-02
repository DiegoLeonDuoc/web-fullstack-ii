import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import ArtistaForm from '../components/ArtistaForm';
import ArtistaTable from '../components/ArtistaTable';
import SelloForm from '../components/SelloForm';
import SelloTable from '../components/SelloTable';
import { initStorage, getProducts, addProduct, updateProduct, deleteProduct } from '../utils/MusicStorage';
import { Auth } from '../utils/Auth';
import Storage from '../utils/UserStorage';
import '../styles/dashboard.css';

/**
 * Panel de administración para gestionar productos, artistas y sellos.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const { isLoggedIn } = Auth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('productos');

  // Artist state
  const [artistas, setArtistas] = useState([]);
  const [selectedArtista, setSelectedArtista] = useState(null);

  // Sello state
  const [sellos, setSellos] = useState([]);
  const [selectedSello, setSelectedSello] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setAuthChecked(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    const load = async () => {
      const data = await getProducts();
      setProducts(data);
      await loadArtistas();
      await loadSellos();
    };
    load();
  }, [authChecked, isLoggedIn, navigate]);

  // Artistas CRUD
  const loadArtistas = async () => {
    try {
      const user = Storage.getCurrentUser();
      const res = await fetch('/api/v1/artistas', {
        headers: { 'Authorization': user ? `Bearer ${user.token}` : '' }
      });
      if (res.ok) {
        const data = await res.json();
        setArtistas(data._embedded?.artistaList || []);
      }
    } catch (e) {
      console.error('Error loading artistas:', e);
    }
  };

  const handleEditArtista = (artista) => {
    setSelectedArtista(artista);
  };

  const handleDeleteArtista = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este artista?')) return;
    try {
      const user = Storage.getCurrentUser();
      await fetch(`/api/v1/artistas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': user ? `Bearer ${user.token}` : '' }
      });
      await loadArtistas();
    } catch (e) {
      console.error('Error deleting artista:', e);
      alert('Error al eliminar artista: ' + e.message);
    }
  };

  const handleArtistaSuccess = async () => {
    setSelectedArtista(null);
    await loadArtistas();
  };

  // Sellos CRUD
  const loadSellos = async () => {
    try {
      const user = Storage.getCurrentUser();
      const res = await fetch('/api/v1/sellos', {
        headers: { 'Authorization': user ? `Bearer ${user.token}` : '' }
      });
      if (res.ok) {
        const data = await res.json();
        setSellos(data._embedded?.selloList || []);
      }
    } catch (e) {
      console.error('Error loading sellos:', e);
    }
  };

  const handleEditSello = (sello) => {
    setSelectedSello(sello);
  };

  const handleDeleteSello = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este sello?')) return;
    try {
      const user = Storage.getCurrentUser();
      await fetch(`/api/v1/sellos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': user ? `Bearer ${user.token}` : '' }
      });
      await loadSellos();
    } catch (e) {
      console.error('Error deleting sello:', e);
      alert('Error al eliminar sello: ' + e.message);
    }
  };

  const handleSelloSuccess = async () => {
    setSelectedSello(null);
    await loadSellos();
  };

  // Products CRUD
  const handleAddOrUpdate = async (prod) => {
    try {
      if (selected) {
        await updateProduct(selected.id, prod);
        setSelected(null);
      } else {
        await addProduct(prod);
      }
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
      alert('Error al guardar producto: ' + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
      alert('Error al eliminar producto: ' + e.message);
    }
  };

  const handleEdit = (prod) => {
    setSelected(prod);
    setActiveTab('productos');
  };

  const handleCancel = () => {
    setSelected(null);
  };

  if (!authChecked || !isLoggedIn) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid className="dashboard-container py-4">
      <h1 className="mb-4">Panel de Administración</h1>

      <Tabs
        id="dashboard-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="productos" title="Productos">
          <Row>
            <Col md={4}>
              <ProductForm
                onSubmit={handleAddOrUpdate}
                selectedProduct={selected}
                onCancel={handleCancel}
              />
            </Col>
            <Col md={8}>
              <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="artistas" title="Artistas">
          <Row>
            <Col md={4}>
              <ArtistaForm
                selectedArtista={selectedArtista}
                onCancel={() => setSelectedArtista(null)}
                onSuccess={handleArtistaSuccess}
              />
            </Col>
            <Col md={8}>
              <ArtistaTable
                artistas={artistas}
                onEdit={handleEditArtista}
                onDelete={handleDeleteArtista}
              />
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="sellos" title="Sellos Discográficos">
          <Row>
            <Col md={4}>
              <SelloForm
                selectedSello={selectedSello}
                onCancel={() => setSelectedSello(null)}
                onSuccess={handleSelloSuccess}
              />
            </Col>
            <Col md={8}>
              <SelloTable
                sellos={sellos}
                onEdit={handleEditSello}
                onDelete={handleDeleteSello}
              />
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
}
