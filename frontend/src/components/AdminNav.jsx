import { NavLink } from 'react-router-dom';

export default function AdminNav() {
  return (
    <nav className="admin-nav">
      <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'active' : '')}>Products</NavLink>
      <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'active' : '')}>Orders</NavLink>
      <NavLink to="/admin/health-concerns" className={({ isActive }) => (isActive ? 'active' : '')}>Health Concerns</NavLink>
    </nav>
  );
}
