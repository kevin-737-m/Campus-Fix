import { useAuth } from '../context/AuthContext';

const getConditionBadgeClass = (condition) => {
  const cond = (condition || '').toLowerCase();
  if (cond.includes('hazard') || cond.includes('critical')) return 'badge-hazard';
  if (cond.includes('urgent')) return 'badge-urgent';
  if (cond.includes('moderate')) return 'badge-moderate';
  return 'badge-minor';
};

const IssueCard = ({ issue, onEdit, onDelete, onImageClick }) => {
  const { user } = useAuth();

  // Check if current user is owner or admin
  const isOwner = user && (
    (typeof issue.userId === 'object' && issue.userId?._id === user.id) ||
    issue.userId === user.id ||
    issue.userId?._id === user._id ||
    user.role === 'admin'
  );

  const reporterName = typeof issue.userId === 'object' && issue.userId?.name 
    ? issue.userId.name 
    : 'Campus Member';

  return (
    <div className="glass-card-interactive issue-card">
      {/* Image Thumbnail with zoom trigger */}
      <div 
        className={`card-image-wrap ${issue.image ? 'card-image-wrap-clickable' : ''}`}
        onClick={() => issue.image && onImageClick?.(issue.image, issue.title)}
      >
        {issue.image ? (
          <img 
            src={issue.image} 
            alt={issue.title} 
            className="card-img"
            loading="lazy"
          />
        ) : (
          <div className="card-no-image">
            No Image Provided
          </div>
        )}

        {/* Condition Tag on Image */}
        <div className="card-badge-pos">
          <span className={`badge ${getConditionBadgeClass(issue.condition)}`}>
            {issue.condition}
          </span>
        </div>

        {/* Location Tag on Image */}
        <div className="card-location-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {issue.location}
        </div>
      </div>

      {/* Content Body */}
      <div className="card-body">
        <h3 className="card-title">
          {issue.title}
        </h3>
        
        <p className="card-description">
          {issue.description}
        </p>

        {/* Card Footer: Reporter and Action Buttons */}
        <div className="card-footer">
          <div className="card-reporter">
            <span className="card-reporter-avatar">
              {reporterName.charAt(0).toUpperCase()}
            </span>
            <span>{reporterName}</span>
          </div>

          {/* Action Buttons if owner */}
          {isOwner && (
            <div className="card-actions">
              <button 
                onClick={() => onEdit?.(issue)} 
                className="btn btn-secondary btn-sm"
                title="Edit Report"
              >
                ✏️
              </button>
              <button 
                onClick={() => onDelete?.(issue._id)} 
                className="btn btn-danger btn-sm"
                title="Delete Report"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
