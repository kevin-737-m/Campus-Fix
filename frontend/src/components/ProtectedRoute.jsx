import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading-container">
        <div className="spinner spinner-lg"></div>
        <p className="auth-loading-text">Authenticating campus session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return (
      <div className="access-denied-container">
        <div className="access-denied-icon">🔒</div>
        <h2>Access Denied</h2>
        <p className="access-denied-desc">
          This page requires administrator privileges.
        </p>
        <Navigate to="/feed" replace />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
