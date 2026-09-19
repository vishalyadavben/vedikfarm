import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-form">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <label>Name<input value={form.name} onChange={(e) => update('name', e.target.value)} required /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required /></label>
        <label>Phone<input value={form.phone} onChange={(e) => update('phone', e.target.value)} /></label>
        <label>Password (min 8 characters)<input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={8} /></label>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Account'}</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
