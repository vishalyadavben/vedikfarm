import { NavLink } from 'react-router-dom';

export default function AdminNav() {
  return (
    <nav className="admin-nav">
      <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'active' : '')}>Products</NavLink>
      <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'active' : '')}>Orders</NavLink>
      <NavLink to="/admin/health-concerns" className={({ isActive }) => (isActive ? 'active' : '')}>Health Concerns</NavLink>
      <NavLink to="/admin/dietician-requests" className={({ isActive }) => (isActive ? 'active' : '')}>Dietician Requests</NavLink>
      <NavLink to="/admin/testimonials" className={({ isActive }) => (isActive ? 'active' : '')}>Testimonials</NavLink>
      <NavLink to="/account/password" className={({ isActive }) => (isActive ? 'active' : '')}>Change Password</NavLink>
    </nav>
  );
}
