import React, { useState, useEffect } from 'react';
import { imageService } from '../services/api';
import ImageModal from '../components/ImageModal';

const History = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await imageService.getHistory();
                setImages(data);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <span className="loading-spinner" style={{ width: '40px', height: '40px' }}></span>
            </div>
        );
    }

    return (
        <div className="main-content">
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' }}>Your Designs</h1>

            {images.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem' }}>
                    <p style={{ fontSize: '1.2rem' }}>No designs yet.</p>
                    <p>Start creating your dream home!</p>
                </div>
            ) : (
                <div className="grid">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="card image-card"
                            style={{ padding: 0 }}
                            onClick={() => setSelectedImage(img)}
                        >
                            <img src={img.image_url} alt={img.prompt} />
                            <div style={{ padding: '1.5rem' }}>
                                <span className="badge">{img.provider}</span>
                                <p style={{
                                    color: 'var(--text-color)',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    marginBottom: '0.5rem'
                                }}>
                                    {img.prompt}
                                </p>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    {new Date(img.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedImage && (
                <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
            )}
        </div>
    );
};

export default History;
