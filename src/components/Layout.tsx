import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Settings, User, Download, Calendar } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNavigation = true }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      <main className="main-content">
        {children}
      </main>
      
      {showNavigation && (
        <div className="bottom-nav">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            <Home size={20} />
            Home
          </Link>
          <Link to="/my-tickets" className={`nav-item ${isActive('/my-tickets') ? 'active' : ''}`}>
            <Download size={20} />
            My Tickets
          </Link>
          <Link to="/my-events" className={`nav-item ${isActive('/my-events') ? 'active' : ''}`}>
            <Calendar size={20} />
            My Events
          </Link>
          <Link to="#" className="nav-item">
            <Settings size={20} />
            Settings
          </Link>
          <Link to="#" className="nav-item">
            <User size={20} />
            Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default Layout;
