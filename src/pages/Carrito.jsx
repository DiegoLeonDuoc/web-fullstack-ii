import React from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useShoppingCart } from '../components/ShoppingCartContext';
import '../styles/carrito.css';

function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <Card className="cart-item flex-row align-items-center mb-3 p-2">
      <div className="cart-item-thumb-wrapper">
        <img className="product-thumb" src={item.img} alt={item.titulo} />
      </div>
      <div className="cart-item-info">
        <div className="product-title">{item.titulo}</div>
        <div><span>{item.formato}</span> — <span>{item.artista}</span></div>
        <span>{item.precio.includes('$') ? item.precio : ('$' + Number(item.precio||0).toLocaleString('es-CL'))}</span>
      </div>
      <Form.Control
        className="qty-input mx-2"
        type="number" min={1} value={item.qty}
        onChange={e => onUpdateQty(item.id, Number(e.target.value))}
      />
      <Button variant="outline-danger remove-item ms-2" onClick={() => onRemove(item.id)}>
        <i className="fa fa-trash" />
      </Button>
    </Card>
  );
}

export default function Carrito() {
  const { cart, cartTotal, updateQty, removeItem } = useShoppingCart();

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
                const unit = Number((item.precio || '').replace(/[^\d]/g, ''));
                const subtotal = unit * (item.qty || 1);
                return (
                  <div className="d-flex justify-content-between py-1 resumen-item" key={item.id}>
                    <span className="resumen-left">{item.titulo} x {item.qty}</span>
                    <span className="resumen-right">${subtotal.toLocaleString('es-CL')}</span>
                  </div>
                );
              })}
            </div>
            <div className="d-flex justify-content-between py-2 border-top">
              <span>Total a pagar:</span>
              <span><b>${cartTotal.toLocaleString('es-CL')}</b></span>
            </div>
            <Button className="btn-primary w-100 mt-3" disabled={!cart.length}>Proceder al pago</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
