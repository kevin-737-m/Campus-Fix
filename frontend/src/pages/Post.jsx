import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CONDITIONS = [
  { value: 'Minor Issue', label: '🟢 Minor Issue', desc: 'Cosmetic or non-blocking issues' },
  { value: 'Moderate', label: '🟡 Moderate', desc: 'Causes inconvenience or partial disruption' },
  { value: 'Urgent Attention', label: '🟠 Urgent Attention', desc: 'Needs prompt fix to avoid further damage' },
  { value: 'Hazardous / Critical', label: '🔴 Hazardous / Critical', desc: 'Safety risk or total facility outage' },
];

const QUICK_LOCATIONS = [
  'Central Library',
  'Engineering Block A',
  'Science Complex',
  'Main Cafeteria',
  'Sports Arena / Gym',
  'Hostel Block',
  'Campus Parking Quad'
];

const Post = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('Minor Issue');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG, WebP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size should be less than 10MB');
      return;
    }
    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please upload a clear photograph of the issue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('location', location);
      formData.append('condition', condition);
      formData.append('description', description);
      formData.append('image', selectedFile);

      await api.post('/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/feed');
    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err.response?.data?.message || 'Failed to submit issue report. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in post-form-container">
      <div className="post-header">
        <h1 className="page-title">Report Campus Issue</h1>
        <p className="page-subtitle">
          Fill in the details below with a photo to alert maintenance and the campus community.
        </p>
      </div>

      <div className="glass-panel post-panel">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="post-form">
          {/* Issue Title */}
          <div className="form-group">
            <label className="form-label">Issue Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Broken AC Unit in Lecture Hall 102"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Location & Quick Pills */}
          <div className="form-group">
            <label className="form-label">Campus Location & Specific Room *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Science Block B, 3rd Floor, Room 305"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <div className="quick-loc-row">
              {QUICK_LOCATIONS.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className="btn btn-secondary btn-sm quick-loc-btn"
                >
                  + {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Condition / Severity Grid */}
          <div className="form-group">
            <label className="form-label">Severity / Condition Level *</label>
            <div className="condition-grid">
              {CONDITIONS.map((c) => (
                <div
                  key={c.value}
                  onClick={() => setCondition(c.value)}
                  className={`condition-option-card ${condition === c.value ? 'condition-option-selected' : ''}`}
                >
                  <span className="condition-option-label">{c.label}</span>
                  <span className="condition-option-desc">{c.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the issue in detail (e.g. when was it noticed, any safety hazards, exact item model if known)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Image Upload Dropzone */}
          <div className="form-group">
            <label className="form-label">Attach Photo Proof *</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="file-input-hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />

            {!previewUrl ? (
              <div
                className={`dropzone ${isDragging ? 'active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="dropzone-icon">📷</div>
                <div className="dropzone-title">
                  Click or Drag & Drop photo here
                </div>
                <div className="dropzone-subtitle">
                  PNG, JPG, WebP up to 10MB (Stored securely on Cloud)
                </div>
              </div>
            ) : (
              <div className="image-preview-wrap">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="image-preview-img"
                />
                <div className="image-preview-bar">
                  <span className="image-preview-info">
                    {selectedFile?.name} ({(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn btn-danger btn-sm"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-action-row">
            <button
              type="button"
              onClick={() => navigate('/feed')}
              className="btn btn-secondary btn-flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-flex-2"
            >
              {loading ? (
                <>
                  <span className="spinner spinner-sm"></span>
                  <span>Uploading to CampusFix...</span>
                </>
              ) : (
                'Submit Issue Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
