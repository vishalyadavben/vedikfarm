import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], subtotal: 0 });
      return;
    }
    const res = await client.get('/api/cart');
    setCart(res.data);
  }, [user]);

  // Keep the header cart badge in sync with the actual logged-in user: this fires on every
  // login/logout transition (not just when a page happens to call refreshCart itself), which
  // fixes the badge staying stale after logout and not appearing until the Cart page was visited.
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  async function addToCart(productId, quantity = 1) {
    try {
      const res = await client.post('/api/cart/items', { productId, quantity });
      setCart(res.data);
      toast?.showToast('Added to cart', 'success');
    } catch (err) {
      toast?.showToast(err.message || 'Could not add to cart. Please try again.', 'error');
      throw err;
    }
  }

  async function updateCartItem(cartItemId, quantity) {
    const res = await client.patch(`/api/cart/items/${cartItemId}`, { quantity });
    setCart(res.data);
  }

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, refreshCart, addToCart, updateCartItem, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
