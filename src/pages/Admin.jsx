import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Tabs, Tab, Modal, Button } from 'react-bootstrap';
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
import '../styles/admin.css';

/**
 * Panel de administración para gestionar productos, artistas y sellos.
 * @returns {JSX.Element}
 */
export default function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('productos');

  // Estado de Artistas
  const [artistas, setArtistas] = useState([]);
  const [selectedArtista, setSelectedArtista] = useState(null);

  // Estado de Sellos
  const [sellos, setSellos] = useState([]);
  const [selectedSello, setSelectedSello] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setAuthChecked(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {

    const load = async () => {
      const data = await getProducts();
      setProducts(data);
      await loadArtistas();
      await loadSellos();
    };
    load();
  }, [authChecked, navigate]);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState({ type: null, id: null, name: '' });

  // CRUD de Artistas
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

  const confirmDeleteArtista = (id) => {
    setDeleteData({ type: 'artista', id, name: 'este artista' });
    setShowDeleteModal(true);
  };

  const handleDeleteArtista = async () => {
    try {
      const user = Storage.getCurrentUser();
      await fetch(`/api/v1/artistas/${deleteData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': user ? `Bearer ${user.token}` : '' }
      });
      await loadArtistas();
      setShowDeleteModal(false);
    } catch (e) {
      console.error('Error deleting artista:', e);
      alert('Error al eliminar artista: ' + e.message);
    }
  };

  const handleArtistaSuccess = async () => {
    setSelectedArtista(null);
    await loadArtistas();
  };

  // CRUD de Sellos
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

  const confirmDeleteSello = (id) => {
    setDeleteData({ type: 'sello', id, name: 'este sello' });
    setShowDeleteModal(true);
  };

  const handleDeleteSello = async () => {
    try {
      const user = Storage.getCurrentUser();
      await fetch(`/api/v1/sellos/${deleteData.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': user ? `Bearer ${user.token}` : '' }
      });
      await loadSellos();
      setShowDeleteModal(false);
    } catch (e) {
      console.error('Error deleting sello:', e);
      alert('Error al eliminar sello: ' + e.message);
    }
  };

  const handleSelloSuccess = async () => {
    setSelectedSello(null);
    await loadSellos();
  };

  // CRUD de Productos
  const handleAddOrUpdate = async (prod) => {
    try {
      // Verificar duplicados solo al crear (no al editar)
      if (!selected) {
        const duplicate = products.find(
          p => p.titulo.toLowerCase().trim() === prod.titulo.toLowerCase().trim()
        );
        if (duplicate) {
          alert(`Ya existe un producto con el título "${prod.titulo}". Por favor, use un título diferente.`);
          return false; // Retornar false para indicar fallo
        }
      }

      if (selected) {
        await updateProduct(selected.id, prod);
        setSelected(null);
      } else {
        await addProduct(prod);
      }
      const data = await getProducts();
      setProducts(data);
      return true; // Retornar true para indicar éxito
    } catch (e) {
      console.error(e);
      alert('Error al guardar producto: ' + e.message);
      return false; // Retornar false en caso de error
    }
  };

  const confirmDeleteProducto = (id) => {
    setDeleteData({ type: 'producto', id, name: 'este producto' });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteData.id);
      const data = await getProducts();
      setProducts(data);
      setShowDeleteModal(false);
    } catch (e) {
      console.error(e);
      alert('Error al eliminar producto: ' + e.message);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteData.type === 'artista') handleDeleteArtista();
    if (deleteData.type === 'sello') handleDeleteSello();
    if (deleteData.type === 'producto') handleDelete();
  };

  const handleEdit = (prod) => {
    setSelected(prod);
    setActiveTab('productos');
  };

  const handleCancel = () => {
    setSelected(null);
  };

  // Actualizar stock de producto
  const handleStockUpdate = async (id, newStock) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const updatedProduct = { ...product, stock: newStock };
      await updateProduct(id, updatedProduct);

      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error('Error updating stock:', e);
      alert('Error al actualizar stock: ' + e.message);
    }
  };

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
                onDelete={confirmDeleteProducto}
                onStockUpdate={handleStockUpdate}
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
                onDelete={confirmDeleteArtista}
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
                onDelete={confirmDeleteSello}
              />
            </Col>
          </Row>
        </Tab>
      </Tabs>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar {deleteData.name}? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
