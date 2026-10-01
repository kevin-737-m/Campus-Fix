import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <span>Campus<span className="logo-accent">Fix</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Campus Feed
          </NavLink>
          {user && (
            <NavLink to="/post" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Report Issue
            </NavLink>
          )}
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link nav-admin-link ${isActive ? 'active' : ''}`}>
              🛡️ Admin Panel
            </NavLink>
          )}
        </div>

        {/* User / Auth Controls */}
        <div className="nav-auth">
          {user ? (
            <div className="nav-user-group">
              <Link to="/profile" className="btn btn-secondary btn-sm nav-profile-btn">
                <span className="nav-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-guest-group">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-sm mobile-toggle-btn"
            id="mobile-toggle-btn"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="nav-link">Home</Link>
          <Link to="/feed" onClick={() => setMobileMenuOpen(false)} className="nav-link">Campus Feed</Link>
          {user && <Link to="/post" onClick={() => setMobileMenuOpen(false)} className="nav-link">Report Issue</Link>}
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="nav-link">About</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="nav-link nav-admin-link">
              🛡️ Admin Panel
            </Link>
          )}
          {user && <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="nav-link">My Profile</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
