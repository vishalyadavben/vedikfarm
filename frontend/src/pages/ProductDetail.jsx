import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [category, setCategory] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    setMessage('');
    setQuantity(1);
    client.get(`/api/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    client.get('/api/categories').then((res) => {
      setCategory(res.data.find((c) => c.id === product.categoryId) || null);
    }).catch(() => {});
  }, [product]);

  useEffect(() => {
    if (!category) return;
    client.get('/api/products', { params: { category: category.slug, size: 5 } })
      .then((res) => setRelated(res.data.content.filter((p) => p.slug !== slug).slice(0, 4)))
      .catch(() => {});
  }, [category, slug]);

  if (notFound) return <p>Sorry, we couldn't find that product. <Link to="/shop">Back to shop</Link></p>;
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
    <div>
      <nav className="breadcrumb">
        <Link to="/shop">Shop</Link>
        {category && (
          <>
            {' '}&rsaquo;{' '}
            <Link to={`/shop?category=${category.slug}`}>{category.name}</Link>
          </>
        )}
        {' '}&rsaquo;{' '}
        <span>{product.name}</span>
      </nav>

      <div className="product-detail">
        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <div className="image-placeholder large" />}
        <div>
          <h1>{product.name}</h1>
          <p className="unit-label">{product.unitLabel}</p>
          <p className="price">Rs.{product.price}</p>
          <p className="product-description">{product.description}</p>

          {product.stockQty > 0 ? (
            <div className="add-to-cart-row">
              <input type="number" min="1" max={product.stockQty} value={quantity}
                     onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />
              <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
            </div>
          ) : (
            <p className="out-of-stock">Out of stock</p>
          )}
          {message && <p className="hint-text">{message}</p>}

          <ul className="trust-badges">
            <li>100% A2 Gir Cow Milk</li>
            <li>Chemical-Free &amp; Organic</li>
            <li>Direct From Farm</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="section-heading">You Might Also Like</h2>
          <div className="product-grid">
            {related.map((p) => (
              <div className="product-card" key={p.id}>
                <Link to={`/products/${p.slug}`}>
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} /> : <div className="image-placeholder" />}
                  <h3>{p.name}</h3>
                  <p className="unit-label">{p.unitLabel}</p>
                  <p className="price">Rs.{p.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
