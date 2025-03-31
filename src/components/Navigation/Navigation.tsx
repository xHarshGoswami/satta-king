import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navigationLinks = useMemo(() => [
    { to: '/', label: 'Home', icon: '🏠', className: 'home' },
    { to: '/customchart', label: 'View Chart', icon: '📊', className: 'customchart' },
    { to: '/contact', label: 'Contact Us', icon: '📞' },
    { to: '/admin-login', label: 'Admin Panel', icon: '⚙️', className: 'admin' }, // Changed from /admin to /admin-login
  ], []);

  return (
    <div className="nav-wrapper">
      <nav className="navigation-menu">
        {navigationLinks.map(({ to, label, icon, className }) => (
          <Link
            key={to}
            to={to}
            className={`nav-button ${className || ''} ${location.pathname === to ? 'active' : ''}`}
            aria-current={location.pathname === to ? 'page' : undefined}
          >
            <span className="nav-icon" role="img" aria-label={label}>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Navigation;