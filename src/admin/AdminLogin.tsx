import React from 'react';
import AdminAuth from './AdminAuth';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleAuth = (isAuthenticated: boolean) => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  };

  return <AdminAuth onAuth={handleAuth} />;
};

export default AdminLogin;