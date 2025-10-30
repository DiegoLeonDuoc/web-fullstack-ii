import React from 'react';
import { Link } from 'react-router-dom';
import { useShoppingCart } from './ShoppingCartContext';
import '../styles/shoppingcarticon.css';

export default function ShoppingCartIcon() {
  const { cartCount } = useShoppingCart();
  return (
    <div className="cart" style={{ position: 'relative' }}>
      <Link to="/carrito">
        <i className="fa fa-shopping-cart"></i>
        {cartCount > 0 && (
          <span className="cart-badge">{cartCount}</span>
        )}
      </Link>
    </div>
  );
}
