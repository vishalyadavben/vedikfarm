import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    client.get('/api/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = category ? { category } : {};
    client.get('/api/products', { params })
      .then((res) => setProducts(res.data.content))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <h1>Shop</h1>
      <div className="category-filters">
        <button className={!category ? 'active' : ''} onClick={() => setSearchParams({})}>All</button>
        {categories.map((c) => (
          <button key={c.id} className={category === c.slug ? 'active' : ''} onClick={() => setSearchParams({ category: c.slug })}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <Link to={`/products/${p.slug}`}>
              {p.imageUrl ? <img src={p.imageUrl} alt={p.name} /> : <div className="image-placeholder" />}
              <h3>{p.name}</h3>
              <p className="unit-label">{p.unitLabel}</p>
              <p className="price">Rs.{p.price}</p>
            </Link>
            {p.stockQty > 0 ? (
              <button
                className="btn btn-secondary"
                onClick={() => (user ? addToCart(p.id, 1) : (window.location.href = '/login'))}
              >
                Add to Cart
              </button>
            ) : (
              <p className="out-of-stock">Out of stock</p>
            )}
          </div>
        ))}
        {products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}
