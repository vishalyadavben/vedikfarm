import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    client.get(`/api/products/${slug}`).then((res) => setProduct(res.data)).catch(() => setProduct(null));
  }, [slug]);

  if (!product) return <p>Loading...</p>;

  async function handleAddToCart() {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      await addToCart(product.id, quantity);
      setMessage('Added to cart.');
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="product-detail">
      {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <div className="image-placeholder large" />}
      <div>
        <h1>{product.name}</h1>
        <p className="unit-label">{product.unitLabel}</p>
        <p className="price">Rs.{product.price}</p>
        <p>{product.description}</p>
        {product.stockQty > 0 ? (
          <div className="add-to-cart-row">
            <input type="number" min="1" max={product.stockQty} value={quantity}
                   onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />
            <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        ) : (
          <p className="out-of-stock">Out of stock</p>
        )}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
