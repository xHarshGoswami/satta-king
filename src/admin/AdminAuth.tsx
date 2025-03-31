import { useState } from 'react';
import './AdminAuth.css';

interface AdminAuthProps {
  onAuth: (isAuthenticated: boolean) => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuth }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === import.meta.env.VITE_REACT_APP_ADMIN_PASS) {
      onAuth(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="password-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;