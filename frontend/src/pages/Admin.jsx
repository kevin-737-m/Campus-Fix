import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/post/admin');
      setUsers(res.data?.users || []);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setError(err.response?.data?.message || 'Failed to retrieve registered users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role !== 'admin').length;

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in admin-container">
      {/* Admin Header */}
      <div className="admin-header">
        <div>
          <div className="admin-title-row">
            <span className="admin-icon">🛡️</span>
            <h1 className="page-title">Campus Admin Console</h1>
          </div>
          <p className="page-subtitle">
            Manage campus memberships, administrative roles, and inspect incident activity.
          </p>
        </div>

        <div className="nav-user-group">
          <button onClick={fetchUsers} className="btn btn-secondary btn-sm">
            🔄 Refresh
          </button>
          <Link to="/feed" className="btn btn-primary btn-sm">
            Inspect Feed
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="glass-panel admin-stat-card">
          <div className="admin-stat-label">
            Total Registered
          </div>
          <div className="admin-stat-count stat-emerald">
            {users.length}
          </div>
          <div className="admin-stat-note">
            Active campus accounts
          </div>
        </div>

        <div className="glass-panel admin-stat-card">
          <div className="admin-stat-label">
            Campus Admins
          </div>
          <div className="admin-stat-count stat-purple">
            {adminCount}
          </div>
          <div className="admin-stat-note">
            Privileged management staff
          </div>
        </div>

        <div className="glass-panel admin-stat-card">
          <div className="admin-stat-label">
            Campus Members
          </div>
          <div className="admin-stat-count stat-cyan">
            {userCount}
          </div>
          <div className="admin-stat-note">
            Students & faculty
          </div>
        </div>
      </div>

      {/* User Directory Table Card */}
      <div className="glass-panel admin-table-panel">
        <div className="admin-table-header">
          <h2 className="modal-title">Registered Users Directory</h2>
          
          <div className="admin-search-wrapper">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search user by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="state-loading-container">
            <div className="spinner spinner-lg"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state-panel">
            <p className="empty-state-desc">No matching users found in campus directory.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>User ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="admin-user-cell">
                        <span className={`admin-avatar ${u.role === 'admin' ? 'admin-avatar-admin' : 'admin-avatar-user'}`}>
                          {u.name?.charAt(0).toUpperCase()}
                        </span>
                        <span className="admin-user-name">{u.name}</span>
                      </div>
                    </td>
                    <td className="page-subtitle">
                      {u.email}
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-role-admin' : 'badge-role-user'}`}>
                        {u.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="admin-uid-cell">
                      {u._id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
