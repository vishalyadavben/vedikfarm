import { Link } from 'react-router-dom';
import logoFooter from '../assets/logo-footer.png';
import footerScene from '../assets/footer-scene.jpg';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
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
            <h4 className="footer-subheading">Policies</h4>
            <ul className="footer-links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
              <li><Link to="/shipping-policy">Shipping Policy</Link></li>
              <li><Link to="/refund-policy">Cancellation &amp; Refund Policy</Link></li>
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
              Shop no. 4, Ramsagar chs Ltd, Ramdev Park,<br />
              Mira Road(East) - 401105,<br />
              Mira Bhayandar, Maharashtra, India
            </address>
            <p><a href="tel:+918419930505">+91 84199 30505</a></p>
            <p><a href="mailto:Thevedikfarms@gmail.com">Thevedikfarms@gmail.com</a></p>
          </div>
        </div>
      </div>
      <div className="footer-image">
        <img src={footerScene} alt="Farm life at Vedik Farms" />
        <div className="footer-bottom">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Vedik Farms. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
