import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

export default function HealthConcernPicker() {
  const [concerns, setConcerns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    client.get('/api/health-concerns').then((res) => setConcerns(res.data)).catch(() => {});
  }, []);

  // selected === null -> default view: a mix of all products. Picking a concern filters to it.
  useEffect(() => {
    setLoadingProducts(true);
    const params = { size: 8 };
    if (selected) params.concern = selected;
    client.get('/api/products', { params })
      .then((res) => setProducts(res.data.content))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [selected]);

  if (concerns.length === 0) return null;

  const activeConcern = concerns.find((c) => c.slug === selected);

  return (
    <section className="concern-picker">
      <div className="concern-picker-inner">
      <div className="concern-picker-header">
        <span className="concern-picker-icon" aria-hidden="true">&#9881;</span>
        <h2>Select Health Concern</h2>
      </div>

      <div className="concern-pills" role="tablist" aria-label="Select a health concern">
        {concerns.map((c) => {
          const isActive = c.slug === selected;
          return (
            <button
              type="button"
              key={c.id}
              role="tab"
              aria-selected={isActive}
              className={`concern-pill${isActive ? ' is-active' : ''}`}
              onClick={() => setSelected(isActive ? null : c.slug)}
            >
              {isActive && <span className="concern-pill-check">&#10003;</span>}
              {c.imageUrl ? (
                <img src={c.imageUrl} alt="" className="concern-pill-avatar" />
              ) : (
                <span className="concern-pill-avatar concern-pill-avatar-fallback">{c.name.charAt(0)}</span>
              )}
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {(
        <div className="concern-results">
          <div className="concern-results-header">
            <h3 className="section-heading">{activeConcern ? activeConcern.name : 'Our Products'}</h3>
            <Link to={activeConcern ? `/shop?concern=${activeConcern.slug}` : '/shop'} className="concern-view-all">
              View all
            </Link>
          </div>

          {loadingProducts ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p className="hint-text">
              {activeConcern ? "We're still adding products for this concern - check back soon." : 'No products available right now.'}
            </p>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <div className="product-card" key={p.id}>
                  <Link to={`/products/${p.slug}`}>
                    {p.stockQty > 0 && p.stockQty <= 5 && <span className="low-stock-badge">Only {p.stockQty} left</span>}
                    {p.imageUrl ? <img src={p.imageUrl} alt={p.name} /> : <div className="image-placeholder" />}
                    <h3>{p.name}</h3>
                    <StarRating avg={p.ratingAvg} count={p.ratingCount} />
                    <p className="unit-label">{p.unitLabel}</p>
                    <p className="price">Rs.{p.price}</p>
                  </Link>
                  {p.stockQty > 0 ? (
                    <button
                      className="btn btn-green"
                      onClick={() => (user ? addToCart(p.id, 1).catch(() => {}) : (window.location.href = '/login'))}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <p className="out-of-stock">Out of stock</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </section>
  );
}
