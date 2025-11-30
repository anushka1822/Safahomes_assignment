import React from 'react';

const ImageModal = ({ image, onClose }) => {
    if (!image) return null;

    const handleDownload = async () => {
        try {
            const response = await fetch(image.image_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            // Extract filename from URL or default to generated-image.png
            link.download = `safahomes-${image.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback for cross-origin issues if fetch fails
            window.open(image.image_url, '_blank');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <button className="close-btn" onClick={onClose}>&times;</button>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <img src={image.image_url} alt={image.prompt} className="modal-image" />

                <div className="modal-actions">
                    <div style={{ maxWidth: '70%' }}>
                        <p style={{ color: 'var(--text-color)', fontWeight: '500', marginBottom: '0.25rem' }}>
                            {image.prompt}
                        </p>
                        <span className="badge">{image.provider}</span>
                    </div>

                    <button onClick={handleDownload} className="btn btn-primary">
                        Download HD
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
