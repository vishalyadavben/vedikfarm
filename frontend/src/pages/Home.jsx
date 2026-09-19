import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-hero">
      <h1>Pure A2 Gir Cow Milk &amp; Organic Products</h1>
      <p>Direct from the farm to your table - holistic living through indigenous cattle breeds and chemical-free farming.</p>
      <Link to="/shop" className="btn btn-primary">Shop Now</Link>
    </div>
  );
}
