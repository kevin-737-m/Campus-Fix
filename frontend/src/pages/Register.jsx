import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (role === 'admin' && !adminPassword) {
      setError('Admin Secret Key is required when registering with the Admin role.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === 'admin' && { adminPassword }),
      };

      await register(payload);
      navigate(role === 'admin' ? '/admin' : '/feed');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1 className="auth-title">Create Campus Account</h1>
          <p className="auth-subtitle">
            Join the CampusFix network to submit and track repairs
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Campus Email */}
          <div className="form-group">
            <label className="form-label">Campus Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g., alex@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input password-input"
                placeholder="Choose a strong password"
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

          {/* Role Picker */}
          <div className="form-group">
            <label className="form-label">Account Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Campus Member (Student / Faculty)</option>
              <option value="admin">Administrator (Campus Ops / Facility Staff)</option>
            </select>
          </div>

          {/* Admin Secret Password if admin selected */}
          {role === 'admin' && (
            <div className="form-group animate-fade-in">
              <label className="form-label admin-secret-label">
                🛡️ Admin Secret Passcode *
              </label>
              <input
                type="password"
                className="form-input admin-secret-input"
                placeholder="Enter university admin secret key"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
              <small className="admin-secret-note">
                Required to verify administrative permissions with the backend.
              </small>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full-width"
          >
            {loading ? (
              <>
                <span className="spinner spinner-sm"></span>
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link-highlight">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;