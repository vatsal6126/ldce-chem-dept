import React, { useState } from 'react';
import { LockKeyhole, LogIn } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { useRouter } from '../lib/router';
import { verifyAdminLogin } from '../lib/auth';

export const AdminLogin: React.FC = () => {
  const { navigate } = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!verifyAdminLogin(username, password)) {
      setError('The administrator username or password is incorrect.');
      return;
    }
    navigate('/more');
  };

  return (
    <main className="page-container admin-login-page">
      <SectionHeader
        badge="Restricted Area"
        title="Administrator Login"
        subtitle="Sign in to update department content. This page is not linked from the public navigation."
      />
      <form className="content-card admin-login-card admin-form" onSubmit={handleSubmit}>
        <div className="admin-login-icon"><LockKeyhole size={24} /></div>
        <div className="form-group">
          <label htmlFor="admin-username">Username</label>
          <input id="admin-username" className="admin-input" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" className="admin-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
        </div>
        {error && <p className="admin-login-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary"><LogIn size={16} /> Sign in</button>
      </form>
    </main>
  );
};
