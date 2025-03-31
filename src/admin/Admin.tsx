import { useState, useEffect } from 'react';
import ResultsChart from './ResultsChart';
import { AddResultForm } from './AddResultForm';
import AdminAuth from './AdminAuth';
import './Admin.css';

interface AdminProps {
  editingId: string | null;
  onSuccess: () => void;
  refreshTrigger: number;
}

export const Admin: React.FC<AdminProps> = ({ editingId, onSuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuth={setIsAuthenticated} />;
  }

  return (
    <div className="admin-container">
      <div className="admin-section">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
        <div className="admin-card">
          <AddResultForm editingId={editingId} onSuccess={onSuccess} />
        </div>
        <div className="admin-chart">
          <ResultsChart />
        </div>
      </div>
    </div>
  );
};