import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState(''); // name or email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/feed';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isEmail = identifier.includes('@');
      const payload = isEmail 
        ? { email: identifier, password } 
        : { name: identifier, password };

      await login(payload);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in auth-card-container">
      <div className="glass-panel auth-panel">
        {/* Header */}
        <div className="auth-header">
          <div className="nav-logo-icon auth-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Log in to manage and report campus incidents
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          {/* Identifier Input */}
          <div className="form-group">
            <label className="form-label">Email Address or Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. alex@campus.edu or alex"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <div className="modal-header">
              <label className="form-label">Password</label>
            </div>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input password-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full-width"
          >
            {loading ? (
              <>
                <span className="spinner spinner-sm"></span>
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          Don't have a campus account?{' '}
          <Link to="/register" className="auth-link-highlight">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
