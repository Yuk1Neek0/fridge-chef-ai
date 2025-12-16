import React, { useRef, useState } from 'react';

const ImageUploader = ({ onImageSelect, preview }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      onImageSelect(imageData, file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-uploader">
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Uploaded fridge" className="preview-image" />
            <div className="preview-overlay">
              <p>Click to change image</p>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📷</div>
            <h3>Upload Fridge Photo</h3>
            <p>Drag and drop or tap to browse</p>
            <span className="upload-hint">JPG, PNG • Max 10MB</span>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
        capture="environment"
      />
    </div>
  );
};

export default ImageUploader;
