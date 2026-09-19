import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [category, setCategory] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [activeImage, setActiveImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    setMessage('');
    setQuantity(1);
    setReviewSubmitted(false);
    setReviewForm({ rating: 5, comment: '' });
    client.get(`/api/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        setActiveImage(res.data.imageUrl || (res.data.images && res.data.images[0]) || null);
      })
      .catch(() => setNotFound(true));
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  function loadReviews() {
    client.get(`/api/products/${slug}/reviews`).then((res) => setReviews(res.data)).catch(() => {});
  }

  if (notFound) return <p>Sorry, we couldn't find that product. <Link to="/shop">Back to shop</Link></p>;
  if (!product) return <p>Loading...</p>;

  const gallery = [product.imageUrl, ...(product.images || [])].filter(Boolean)
    .filter((url, i, arr) => arr.indexOf(url) === i);

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

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewError('');
    setReviewSubmitting(true);
    try {
      await client.post(`/api/products/${slug}/reviews`, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment || null,
      });
      setReviewSubmitted(true);
      setReviewForm({ rating: 5, comment: '' });
      loadReviews();
      client.get(`/api/products/${slug}`).then((res) => setProduct(res.data)).catch(() => {});
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
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
        <div className="product-gallery">
          {activeImage ? <img src={activeImage} alt={product.name} className="gallery-main" /> : <div className="image-placeholder large" />}
          {gallery.length > 1 && (
            <div className="gallery-thumbs">
              {gallery.map((url) => (
                <button
                  key={url}
                  type="button"
                  className={`gallery-thumb ${url === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(url)}
                >
                  <img src={url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1>{product.name}</h1>
          <StarRating avg={product.ratingAvg} count={product.ratingCount} size="lg" />
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

      <section className="reviews-section">
        <h2 className="section-heading">Ratings &amp; Reviews</h2>

        {reviews.length === 0 ? (
          <p className="hint-text">No reviews yet - be the first to review this product.</p>
        ) : (
          <ul className="review-list">
            {reviews.map((r) => (
              <li key={r.id} className="review-item">
                <StarRating avg={r.rating} count={1} />
                <p className="review-meta">{r.reviewerName} &middot; {new Date(r.createdAt).toLocaleDateString()}</p>
                {r.comment && <p>{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}

        {user ? (
          reviewSubmitted ? (
            <p className="hint-text">Thanks for your review!</p>
          ) : (
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>Write a Review</h3>
              <label>
                Rating
                <select value={reviewForm.rating} onChange={(e) => setReviewForm((f) => ({ ...f, rating: e.target.value }))}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                </select>
              </label>
              <label>
                Comment (optional)
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  maxLength={2000}
                  rows={3}
                />
              </label>
              {reviewError && <p className="error-text">{reviewError}</p>}
              <button className="btn btn-secondary" type="submit" disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )
        ) : (
          <p className="hint-text"><Link to="/login">Log in</Link> to write a review.</p>
        )}
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="section-heading">You Might Also Like</h2>
          <div className="product-grid">
            {related.map((p) => (
              <div className="product-card" key={p.id}>
                <Link to={`/products/${p.slug}`}>
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} /> : <div className="image-placeholder" />}
                  <h3>{p.name}</h3>
                  <StarRating avg={p.ratingAvg} count={p.ratingCount} />
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
