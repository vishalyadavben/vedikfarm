import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import HealthConcernPicker from '../components/HealthConcernPicker';
import Testimonials from '../components/Testimonials';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

const USPS = [
  { title: '100% A2 Gir Cow Milk', text: 'Sourced from indigenous Gir cows, never crossbred, never rushed.' },
  { title: 'Chemical-Free & Organic', text: 'No pesticides, no preservatives - just farm produce the way it grew.' },
  { title: 'Traditional Bilona Ghee', text: 'Our ghee is churned the traditional way, not machine-separated.' },
  { title: 'Direct From Farm', text: 'We cut out the middlemen so the farm reaches your table faster and fresher.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    client.get('/api/products', { params: { size: 4 } })
      .then((res) => setFeatured(res.data.content))
      .catch(() => {});
  }, []);

  return (
    <div className="home-page">
      <HeroCarousel />

      <HealthConcernPicker />

      <section className="container usp-strip">
        {USPS.map((u) => (
          <div className="usp-card" key={u.title}>
            <h3>{u.title}</h3>
            <p>{u.text}</p>
          </div>
        ))}
      </section>

      <section className="container category-promo">
        <Link to="/shop?category=milk-products" className="promo-tile promo-milk">
          <h2>Milk Products</h2>
          <p>A2 Gir cow milk &amp; traditional bilona ghee</p>
          <span className="promo-link">Shop Milk Products &rarr;</span>
        </Link>
        <Link to="/shop?category=organic-products" className="promo-tile promo-organic">
          <h2>Organic Products</h2>
          <p>Seeds, spices, salts and other farm staples</p>
          <span className="promo-link">Shop Organic Products &rarr;</span>
        </Link>
      </section>

      {featured.length > 0 && (
        <section className="container">
          <h2 className="section-heading">Popular Picks</h2>
          <div className="product-grid">
            {featured.map((p) => (
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
          <div className="section-cta">
            <Link to="/shop" className="btn btn-secondary">View Full Shop</Link>
          </div>
        </section>
      )}

      <Testimonials className="container testimonials" />
    </div>
  );
}
