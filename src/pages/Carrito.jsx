import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useShoppingCart } from '../components/ShoppingCartContext';
import { formatPrice } from '../utils/Utilidades';
import '../styles/carrito.css';

function CartItem({ item, onUpdateQty, onRemove }) {
  const maxQty = item.stock || 999;
  const isLowStock = item.stock && item.stock <= 5;
  const isAtMaxStock = item.qty >= maxQty;
  console.log(item)

  const handleQtyChange = (e) => {
    let newQty = Number(e.target.value);
    // Validar contra stock disponible
    if (newQty > maxQty) {
      newQty = maxQty;
    }
    if (newQty < 1) {
      newQty = 1;
    }
    onUpdateQty(item.id, newQty);
  };

  return (
    <Card className="cart-item flex-row align-items-center mb-3 p-2">
      <div className="cart-item-thumb-wrapper">
        <img className="product-thumb" src={item.img} alt={item.titulo} />
      </div>
      <div className="cart-item-info">
        <div className="product-title">{item.titulo}</div>
        <div><span>{item.formato}</span> — <span>{item.artista}</span></div>
        <span>{formatPrice(item.precio)}</span>
        {item.stock !== undefined && (
          <div className="mt-1">
            <small className={isLowStock ? 'text-warning' : 'text-muted'}>
              {item.stock > 0 ? `${item.stock} disponibles` : 'Sin stock'}
            </small>
          </div>
        )}
        {isAtMaxStock && item.stock > 0 && (
          <div className="mt-1">
            <small className="text-info">
              <i className="fa fa-info-circle me-1"></i>
              Cantidad máxima alcanzada
            </small>
          </div>
        )}
      </div>
      <Form.Control
        className="qty-input mx-2"
        type="number"
        min={1}
        max={maxQty}
        value={item.qty}
        onChange={handleQtyChange}
        disabled={item.stock === 0}
      />
      <Button variant="outline-danger remove-item ms-2" onClick={() => onRemove(item.id)}>
        <i className="fa fa-trash" />
      </Button>
    </Card>
  );
}

export default function Carrito() {
  const { cart, cartTotal, updateQty, removeItem, refreshCart } = useShoppingCart();

  // Refrescar carrito al cargar la página para obtener nombres actualizados de artistas/etiquetas
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <Container className="my-4">
      <Row>
        <Col md={8}>
          <h3>Carrito de Compras</h3>
          <div className="cart-list">
            {cart.length === 0 ? (
              <div className="text-muted mt-4">Tu carrito está vacío.</div>
            ) : (
              cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQty={updateQty}
                  onRemove={removeItem}
                />
              ))
            )}
          </div>
        </Col>
        <Col md={4}>
          <Card className="checkout-card p-4">
            <h5>Resumen</h5>
            {/* Detalle por producto */}
            <div className="py-2">
              {cart.map((item) => {
                const unit = item.precio;
                const subtotal = unit * (item.qty || 1);
                return (
                  <div className="d-flex justify-content-between py-1 resumen-item" key={item.id}>
                    <span className="resumen-left">{item.titulo} (x{item.qty})</span>
                    <span className="resumen-right">{formatPrice(subtotal)}</span>
                  </div>
                );
              })}
            </div>
            <div className="d-flex justify-content-between fw-bold mt-3 border-top pt-2 total-row">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <Button className="btn-primary w-100 mt-3" disabled={!cart.length}>Proceder al pago</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
