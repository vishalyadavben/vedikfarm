import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const FAQS = [
  {
    q: 'What payment methods do you accept?',
    a: 'We accept online payments through Razorpay - UPI, debit/credit cards, and net banking. We do not currently offer cash on delivery.',
  },
  {
    q: 'Will I get a GST invoice?',
    a: 'Yes. We are a GST-registered business - add your GSTIN at checkout if you need one, and every order includes a tax breakup on the invoice.',
  },
  {
    q: 'What are the shipping charges?',
    a: 'Orders above the free-shipping threshold ship free; smaller orders carry a flat shipping fee shown at checkout before you pay.',
  },
  {
    q: 'How is the milk kept fresh during delivery?',
    a: 'Milk and ghee are dispatched in sealed, food-safe packaging as close to your delivery slot as possible.',
  },
  {
    q: 'Can I track my order?',
    a: 'Yes - once logged in, visit "My Orders" to see the live status of every order you have placed with us.',
  },
];

export default function About() {
  const [categories, setCategories] = useState([]);
  const [productCount, setProductCount] = useState(null);

  useEffect(() => {
    client.get('/api/categories').then((res) => setCategories(res.data)).catch(() => {});
    client.get('/api/products', { params: { size: 1 } })
      .then((res) => setProductCount(res.data.totalElements))
      .catch(() => {});
  }, []);

  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Vedik Farms</h1>
        <p className="hero-sub">
          Vedik Farms brings you pure A2 Gir cow milk products and organic goods, sourced with a
          focus on social responsibility, chemical-free farming, and green initiatives - direct
          from the farm to your table.
        </p>
      </section>

      <section className="about-mission">
        <h2 className="section-heading">Our Mission</h2>
        <p>
          We work with indigenous Gir cows rather than crossbred or industrially farmed cattle,
          because we believe how milk is produced matters as much as what's in it. Our ghee is
          made using the traditional bilona method, and our organic range - seeds, spices, salts
          and pantry staples - is grown and processed without synthetic chemicals. Everything we
          sell is meant to go straight from the farm to your table, with as few steps (and as
          little processing) in between as possible.
        </p>
      </section>

      {(categories.length > 0 || productCount !== null) && (
        <section className="about-stats">
          {categories.length > 0 && <div className="stat-card"><strong>{categories.length}</strong><span>Product Categories</span></div>}
          {productCount !== null && <div className="stat-card"><strong>{productCount}</strong><span>Products Available</span></div>}
          <div className="stat-card"><strong>A2</strong><span>Gir Cow Milk Only</span></div>
          <div className="stat-card"><strong>0</strong><span>Synthetic Chemicals</span></div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="about-showcase">
          <h2 className="section-heading">What We Offer</h2>
          <div className="showcase-grid">
            {categories.map((c) => (
              <Link to={`/shop?category=${c.slug}`} className="showcase-card" key={c.id}>
                <h3>{c.name}</h3>
                <span className="promo-link">Browse &rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="about-testimonials">
        <h2 className="section-heading">What Our Customers Say</h2>
        <p className="hint-text testimonial-note">
          Real customer reviews go here before launch - replace these placeholders with actual quotes.
        </p>
        <div className="testimonial-grid">
          {[1, 2].map((i) => (
            <div className="testimonial-card placeholder-card" key={i}>
              <p>&ldquo;[Add a real customer quote here before launch]&rdquo;</p>
              <p className="testimonial-name">- Customer name</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-faq">
        <h2 className="section-heading">Frequently Asked Questions</h2>
        <div className="faq-list">
          {FAQS.map((f) => (
            <details className="faq-item" key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
