import React, { useRef, useState } from 'react';

const ImageUploader = ({ onImageSelect, preview, onMultipleImagesSelect }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
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

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1 && onMultipleImagesSelect) {
      handleMultipleFiles(files);
    } else {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 1 && onMultipleImagesSelect) {
      handleMultipleFiles(files);
    } else {
      handleFile(files[0]);
    }
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

  const handleMultipleFiles = async (files) => {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      alert('No valid images found. Please ensure files are images under 10MB.');
      return;
    }

    if (validFiles.length > 5) {
      alert('Maximum 5 images allowed at once.');
      validFiles.splice(5);
    }

    const imageDataArray = [];
    for (const file of validFiles) {
      const imageData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ data: e.target.result, type: file.type });
        reader.readAsDataURL(file);
      });
      imageDataArray.push(imageData);
    }

    if (onMultipleImagesSelect) {
      onMultipleImagesSelect(imageDataArray);
    } else {
      // Fallback to single image if handler not provided
      onImageSelect(imageDataArray[0].data, imageDataArray[0].type);
    }
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
            <h3>Upload Fridge Photo(s)</h3>
            <p>Drag and drop or tap to browse</p>
            <span className="upload-hint">JPG, PNG • Max 10MB • Up to 5 images</span>
          </div>
        )}
      </div>

      {/* Hidden file input for gallery selection (allows multiple) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      {/* Separate button for camera (mobile only) */}
      {!preview && (
        <div className="upload-actions">
          <button
            className="btn-camera"
            onClick={(e) => {
              e.stopPropagation();
              cameraInputRef.current?.click();
            }}
          >
            📸 Take Photo
          </button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
