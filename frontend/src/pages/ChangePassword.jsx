import { useState } from 'react';
import client from '../api/client';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setDone(false);
    if (newPassword !== confirm) {
      setError('The new passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await client.put('/api/account/password', { currentPassword, newPassword });
      setDone(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-form">
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <label>Current password<input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required autoComplete="current-password" /></label>
        <label>New password (at least 8 characters)<input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} autoComplete="new-password" /></label>
        <label>Confirm new password<input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} autoComplete="new-password" /></label>
        {error && <p className="error-text">{error}</p>}
        {done && <p className="dietician-success">Your password has been updated.</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Update Password'}</button>
      </form>
    </div>
  );
}
