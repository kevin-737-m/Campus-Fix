import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';
import EditModal from '../components/EditModal';
import ImageModal from '../components/ImageModal';

const Profil = () => {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [editingPost, setEditingPost] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/post');
      const allPosts = res.data?.post || [];
      
      // Filter for posts owned by the current user
      const myPosts = allPosts.filter((p) => {
        const pUserId = typeof p.userId === 'object' ? p.userId?._id : p.userId;
        return pUserId === user?.id || pUserId === user?._id;
      });

      setUserPosts(myPosts);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('Could not load your submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  const handleUpdatePost = async (id, updatedData) => {
    const res = await api.patch(`/post/${id}`, updatedData);
    if (res.data?.post) {
      setUserPosts((prev) => prev.map((p) => (p._id === id ? res.data.post : p)));
    } else {
      fetchMyPosts();
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue report?')) return;
    try {
      await api.delete(`/post/${id}`);
      setUserPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report');
    }
  };

  const hazardCount = userPosts.filter((p) => 
    p.condition?.toLowerCase().includes('hazard') || p.condition?.toLowerCase().includes('critical')
  ).length;

  return (
    <div className="animate-fade-in profile-container">
      {/* User Header Profile Card */}
      <div className="glass-panel profile-panel">
        <div className="profile-header-row">
          <div className="profile-user-left">
            {/* Avatar */}
            <div className="profile-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <div className="profile-name-row">
                <h1 className="profile-name">{user?.name}</h1>
                <span className={`badge ${user?.role === 'admin' ? 'badge-role-admin' : 'badge-role-user'}`}>
                  {user?.role === 'admin' ? '🛡️ Administrator' : '🎓 Campus Member'}
                </span>
              </div>
              <p className="profile-email">{user?.email}</p>
            </div>
          </div>

          <Link to="/post" className="btn btn-primary">
            + Report New Issue
          </Link>
        </div>

        {/* User Stats Bar */}
        <div className="profile-stats-grid">
          <div className="profile-stat-box">
            <div className="profile-stat-val val-primary">{userPosts.length}</div>
            <div className="profile-stat-label">Total Submissions</div>
          </div>

          <div className="profile-stat-box">
            <div className="profile-stat-val val-danger">{hazardCount}</div>
            <div className="profile-stat-label">Hazard Reports</div>
          </div>

          <div className="profile-stat-box">
            <div className="profile-stat-val val-info">Active</div>
            <div className="profile-stat-label">Account Status</div>
          </div>
        </div>
      </div>

      {/* User's Posts Section */}
      <div>
        <div className="profile-section-header">
          <h2 className="section-title">My Reported Issues</h2>
          <span className="section-caption">
            Manage and update tickets submitted by you
          </span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="state-loading-container">
            <div className="spinner spinner-lg"></div>
          </div>
        ) : userPosts.length === 0 ? (
          <div className="glass-panel empty-state-panel">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">No Issues Reported Yet</h3>
            <p className="empty-state-desc">
              Whenever you notice something broken or needing attention on campus, report it here to track its fix.
            </p>
            <Link to="/post" className="btn btn-primary">
              Submit Your First Report
            </Link>
          </div>
        ) : (
          <div className="issues-grid">
            {userPosts.map((post) => (
              <IssueCard
                key={post._id}
                issue={post}
                onEdit={(p) => setEditingPost(p)}
                onDelete={(id) => handleDeletePost(id)}
                onImageClick={(url, title) => setPreviewImage({ url, title })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <EditModal
          issue={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleUpdatePost}
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <ImageModal
          imageUrl={previewImage.url}
          title={previewImage.title}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
};

export default Profil;
