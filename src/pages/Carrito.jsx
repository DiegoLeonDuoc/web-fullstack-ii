import React from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useShoppingCart } from '../components/ShoppingCartContext';
import '../styles/carrito.css';

function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <Card className="cart-item flex-row align-items-center mb-3 p-2">
