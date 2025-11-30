import React, { useState } from 'react';
import { imageService } from '../services/api';
import ImageModal from '../components/ImageModal';

const Home = () => {
    const [prompt, setPrompt] = useState('');
    const [provider, setProvider] = useState('pollinations');
    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setGeneratedImage(null);

        try {
            const data = await imageService.generate(prompt, provider);
            setGeneratedImage(data);
        } catch (err) {
            setError('Failed to generate image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-content">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                    Design Your <span className="logo">Dream Home</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                    Turn your ideas into reality with AI. Describe your perfect space and watch it come to life.
                </p>
            </div>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Describe your design</label>
                        <textarea
                            className="form-input"
                            rows="4"
                            placeholder="A modern minimalist living room with large windows overlooking a forest, warm lighting, beige sofa..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            required
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">AI Model</label>
                        <select
                            className="form-select"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                        >
                            <option value="pollinations">Pollinations AI (Fast & Free)</option>
                            <option value="gemini">Gemini Enhanced (Creative)</option>
                            <option value="openai">DALL-E 3 (Premium)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <span className="loading-spinner"></span> Generating Magic...
                            </span>
                        ) : (
                            'Generate Design'
                        )}
                    </button>
                </form>
            </div>

            {error && (
                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    color: 'var(--error-color)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    padding: '1rem',
                    borderRadius: 'var(--radius)'
                }}>
                    {error}
                </div>
            )}

            {loading && (
                <div style={{ marginTop: '3rem', maxWidth: '800px', margin: '3rem auto 0' }}>
                    <div className="card" style={{ padding: '1rem' }}>
                        <div className="skeleton skeleton-image"></div>
                        <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                        <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                    </div>
                </div>
            )}

            {generatedImage && !loading && (
                <div style={{ marginTop: '3rem', scrollMarginTop: '2rem', maxWidth: '800px', margin: '3rem auto 0' }} id="result">
                    <div
                        className="card image-card"
                        style={{ padding: '1rem' }}
                        onClick={() => setSelectedImage(generatedImage)}
                    >
                        <img
                            src={generatedImage.image_url}
                            alt={generatedImage.prompt}
                            style={{ width: '100%', borderRadius: 'var(--radius)', display: 'block' }}
                        />
                        <div style={{ padding: '1.5rem 0.5rem 0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <span className="badge">{generatedImage.provider}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    {new Date(generatedImage.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-color)' }}>{generatedImage.prompt}</p>
                        </div>
                    </div>
                </div>
            )}

            {selectedImage && (
                <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
            )}
        </div>
    );
};

export default Home;
