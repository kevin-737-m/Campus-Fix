import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';
import EditModal from '../components/EditModal';
import ImageModal from '../components/ImageModal';

const CONDITIONS = [
  'All Conditions',
  'Minor Issue',
  'Moderate',
  'Urgent Attention',
  'Hazardous / Critical'
];

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('All Conditions');
  const [sortBy, setSortBy] = useState('newest');

  // Modals
  const [editingPost, setEditingPost] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/post');
      setPosts(res.data?.post || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError('Please log in to view the live campus incident feed.');
      } else {
        setError(err.response?.data?.message || 'Failed to load posts from server.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleUpdatePost = async (id, updatedData) => {
    const res = await api.patch(`/post/${id}`, updatedData);
    if (res.data?.post) {
      setPosts((prev) => prev.map((p) => (p._id === id ? res.data.post : p)));
    } else {
      fetchPosts();
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue report?')) return;
    try {
      await api.delete(`/post/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  // Filter and Sort
  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch = 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof post.userId === 'object' && post.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCondition = 
        selectedCondition === 'All Conditions' || 
        post.condition?.toLowerCase() === selectedCondition.toLowerCase() ||
        (selectedCondition === 'Minor Issue' && post.condition?.toLowerCase().includes('minor')) ||
        (selectedCondition === 'Hazardous / Critical' && (post.condition?.toLowerCase().includes('hazard') || post.condition?.toLowerCase().includes('critical')));

      return matchesSearch && matchesCondition;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return (b._id > a._id ? 1 : -1);
      return (a._id > b._id ? 1 : -1);
    });

  return (
    <div className="animate-fade-in feed-container">
      {/* Header section */}
      <div className="feed-header">
        <div>
          <h1 className="page-title">Campus Incident Feed</h1>
          <p className="page-subtitle">
            Real-time public tracker for all reported maintenance & safety issues.
          </p>
        </div>
        {user ? (
          <Link to="/post" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Report New Issue
          </Link>
        ) : (
          <Link to="/login" className="btn btn-secondary">
            Log in to Report
          </Link>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel filter-panel">
        <div className="filter-row">
          {/* Search Box */}
          <div className="search-input-wrapper">
            <input 
              type="text" 
              className="form-input search-input" 
              placeholder="Search by title, location, description, or reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="search-icon"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-select-wrapper">
            <select 
              className="form-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Condition Filter Pills */}
        <div className="condition-pills-row">
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              onClick={() => setSelectedCondition(cond)}
              className={`btn btn-sm btn-pill ${selectedCondition === cond ? 'btn-primary' : 'btn-secondary'}`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="alert alert-error alert-with-action">
          <span>{error}</span>
          {!user && (
            <Link to="/login" className="btn btn-sm btn-primary">
              Login Now
            </Link>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="state-loading-container">
          <div className="spinner spinner-lg"></div>
          <p className="state-loading-text">Loading campus reports...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Empty State */
        <div className="glass-panel empty-state-panel">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">No Reports Found</h3>
          <p className="empty-state-desc">
            {searchTerm || selectedCondition !== 'All Conditions' 
              ? 'Try changing your search query or condition filters.'
              : 'There are currently no active campus issues reported. Be the first to report one!'}
          </p>
          {user && (
            <Link to="/post" className="btn btn-primary">
              Report First Issue
            </Link>
          )}
        </div>
      ) : (
        /* Grid of Issues */
        <div>
          <div className="feed-count-row">
            <span className="feed-count-text">
              Showing <strong>{filteredPosts.length}</strong> reported {filteredPosts.length === 1 ? 'issue' : 'issues'}
            </span>
          </div>

          <div className="issues-grid">
            {filteredPosts.map((post) => (
              <IssueCard
                key={post._id}
                issue={post}
                onEdit={(p) => setEditingPost(p)}
                onDelete={(id) => handleDeletePost(id)}
                onImageClick={(url, title) => setPreviewImage({ url, title })}
              />
            ))}
          </div>
        </div>
      )}

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

export default Feed;
