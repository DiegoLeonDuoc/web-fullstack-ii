import React, { useMemo, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SidebarFiltros, { toFilterCriteria } from '../components/SidebarFiltros';
import TarjetaProducto from '../components/TarjetaProducto';
import { filterProducts } from '../utils/Filters';
import { getProducts } from '../utils/MusicStorage';
/**
 * Página de catálogo con filtros y listado de productos.
 * @returns {JSX.Element}
 */
export default function Catalogo() {
  const [criteria, setCriteria] = useState({});
  const [preset, setPreset] = useState({});

  // Leer query params básicos (?formato=CD|Vinilo)...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const formato = params.get('formato');
    if (formato) setPreset({ formato: [formato] });
  }, []);

  const productos = useMemo(() => {
    return filterProducts(getProducts(), criteria);
  }, [criteria]);

  return (
    <Container className="my-4">
      <Row>
        <Col md={3}>
          <SidebarFiltros
            productos={getProducts()}
            initial={preset}
            onChange={(c) => setCriteria(c)}
          />
        </Col>
        <Col md={9}>
          <h3 className="mb-3">Catálogo</h3>
          <Row xs={1} sm={2} md={3} className="g-3">
            {productos.map((p) => (
              <Col key={p.id}>
                <TarjetaProducto producto={p} />
              </Col>
            ))}
            {productos.length === 0 && (
              <Col>
                <div className="text" style={{ color: 'white !important' }}>No hay productos que coincidan con los filtros.</div>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
