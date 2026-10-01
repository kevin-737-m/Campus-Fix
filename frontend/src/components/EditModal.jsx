import { useState } from 'react';

const CONDITIONS = [
  'Minor Issue',
  'Moderate',
  'Urgent Attention',
  'Hazardous / Critical'
];

const EditModal = ({ issue, onClose, onSave }) => {
  const [title, setTitle] = useState(issue?.title || '');
  const [description, setDescription] = useState(issue?.description || '');
  const [condition, setCondition] = useState(issue?.condition || 'Minor Issue');
  const [location, setLocation] = useState(issue?.location || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!issue) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(issue._id, {
        title,
        description,
        condition,
        location
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Issue Report</h3>
          <button 
            onClick={onClose} 
            className="btn btn-secondary btn-sm btn-icon-close"
          >
            ✕
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Title</label>
            <input 
              type="text" 
              className="form-input" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location / Building / Room</label>
            <input 
              type="text" 
              className="form-input" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Condition / Urgency</label>
            <select 
              className="form-select" 
              value={condition} 
              onChange={(e) => setCondition(e.target.value)}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-textarea" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>

          <div className="modal-footer-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <span className="spinner spinner-sm"></span> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
