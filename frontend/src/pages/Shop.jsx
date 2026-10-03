import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const concern = searchParams.get('concern') || '';
  const [searchInput, setSearchInput] = useState(search);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    client.get('/api/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  // Keep the input box in sync if the URL changes from elsewhere (e.g. back button).
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce typing before it becomes a URL param / API call.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== search) {
        const next = {};
        if (category) next.category = category;
        if (concern) next.concern = concern;
        if (searchInput) next.search = searchInput;
        setSearchParams(next);
      }
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (concern) params.concern = concern;
    if (search) params.search = search;
    client.get('/api/products', { params })
      .then((res) => setProducts(res.data.content))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, search, concern]);

  function selectCategory(slug) {
    const next = {};
    if (slug) next.category = slug;
    if (search) next.search = search;
    // Switching category clears a health-concern filter - the two are independent facets
    // and keeping both after an explicit category click reads as a filter the user didn't ask for.
    setSearchParams(next);
  }

  function clearConcern() {
    const next = {};
    if (category) next.category = category;
    if (search) next.search = search;
    setSearchParams(next);
  }

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div>
      <h1>{activeCategory ? activeCategory.name : 'Shop'}</h1>

      {category === 'healthy-combos' && !concern && (
        <p className="hint-text shop-subtitle">
          Mix and match our best-selling products - great value when bought together.
        </p>
      )}

      {concern && (
        <p className="active-concern-note">
          Showing products for <strong>{concern.replace(/-/g, ' ')}</strong>
          {' '}&middot;{' '}
          <button type="button" className="link-button" onClick={clearConcern}>Clear filter</button>
        </p>
      )}

      <div className="shop-toolbar">
        <input
          type="search"
          className="search-input"
          placeholder="Search products (e.g. ghee, chia seeds)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search products"
        />
        <div className="category-filters">
          <button className={!category ? 'active' : ''} onClick={() => selectCategory('')}>All</button>
          {categories.map((c) => (
            <button key={c.id} className={category === c.slug ? 'active' : ''} onClick={() => selectCategory(c.slug)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
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
          {products.length === 0 && (
            <p>
              No products found{search ? ` for "${search}"` : ''}.
              {search && (
                <> {' '}<button className="link-button" onClick={() => setSearchInput('')}>Clear search</button></>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
