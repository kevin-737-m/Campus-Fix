const ImageModal = ({ imageUrl, title, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="modal-overlay modal-overlay-preview" onClick={onClose}>
      <div 
        className="image-modal-wrapper" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="image-modal-close-btn"
        >
          ✕
        </button>

        <img 
          src={imageUrl} 
          alt={title || 'Campus issue inspection'} 
          className="image-modal-img" 
        />
        {title && (
          <p className="image-modal-caption">
            {title}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
