import React from 'react';
import { Link } from 'react-router-dom';
import { useShoppingCart } from './ShoppingCartContext';

export default function ShoppingCartIcon() {
  const { cartCount } = useShoppingCart();
  return (
    <div className="cart" style={{ position: 'relative' }}>
      <Link to="/carrito">
        <i className="fa fa-shopping-cart"></i>
        {cartCount > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -10,
            background: '#c33', color: '#fff', borderRadius: '50%',
            width: 20, height: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.95rem', fontWeight: 'bold',
          }}>{cartCount}</span>
        )}
      </Link>
    </div>
  );
}
