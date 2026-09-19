import { Link } from 'react-router-dom';
import logoFooter from '../assets/logo-footer.png';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <img src={logoFooter} alt="Vedik Farms" className="footer-logo" />
          <p>Pure A2 Gir cow milk products and organic goods, direct from the farm to your table.</p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul className="footer-links">
            <li><Link to="/shop?category=milk-products">Milk Products</Link></li>
            <li><Link to="/shop?category=organic-products">Organic Products</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Get in Touch</h4>
          <address>
            Shop No. Ground Floor, Next to Ram Mandir,<br />
            Ramdev Park, Mira Road - 401107,<br />
            Mumbai, Maharashtra, India
          </address>
          <p><a href="tel:+917977104965">+91 79771 04965</a></p>
          <p><a href="mailto:sachinsan07@gmail.com">sachinsan07@gmail.com</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Vedik Farms. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
