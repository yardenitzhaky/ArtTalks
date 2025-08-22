// Artwork discussion page
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Artwork } from '../types';
import { fetchArtworkById } from '../utils/api';
import ChatInterface from '../components/ChatInterface';
import './DiscussionPage.css';

const DiscussionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch artwork on mount or when id changes
  useEffect(() => {
    const loadArtwork = async () => {
      if (!id) {
        setError('No artwork ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchArtworkById(parseInt(id));
        setArtwork(data);
      } catch (err) {
        setError('Failed to load artwork');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadArtwork();
  }, [id]);

  // Navigate back to the gallery
  const handleGoBack = () => {
    navigate('/');
  };

  // Loading state
  if (loading) {
    return (
      <div className="discussion-page">
        <div className="loading">Loading artwork...</div>
      </div>
    );
  }

  // Error or missing artwork state
  if (error || !artwork) {
    return (
      <div className="discussion-page">
        <div className="error">Error: {error}</div>
        <button onClick={handleGoBack} className="back-button">
          Go Back to Gallery
        </button>
      </div>
    );
  }

  // Main content
  return (
    <div className="discussion-page">
      <header className="discussion-header">
        <button onClick={handleGoBack} className="back-button">
          ← Back to Gallery
        </button>
        <h1>{artwork.title}</h1>
        <p className="artist-name">by {artwork.artist}</p>
      </header>

      <div className="discussion-content">
        <div className="artwork-section">
          {/* Left: artwork image */}
          <div className="artwork-display">
            <img
              loading="lazy"
              src={artwork.imageUrl} 
              alt={artwork.title} 
              className="artwork-image-large"
            />
          </div>
          {/* Right: info and metadata */}
          <div className="artwork-info">
            <h2>{artwork.title}</h2>
            <p className="artist">by {artwork.artist}</p>
            <p className="description">{artwork.description}</p>
            
            <div className="metadata">
              <h3>Artwork Details</h3>
              <div className="metadata-grid">
                <div className="metadata-item">
                  <span className="label">Resolution:</span>
                  <span className="value">{artwork.metadata.resolution}</span>
                </div>
                <div className="metadata-item">
                  <span className="label">File Size:</span>
                  <span className="value">{artwork.metadata.fileSize}</span>
                </div>
                <div className="metadata-item">
                  <span className="label">Format:</span>
                  <span className="value">{artwork.metadata.format}</span>
                </div>
                <div className="metadata-item">
                  <span className="label">Year:</span>
                  <span className="value">{artwork.metadata.dateCreated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Realtime chat for this artwork */}
        <div className="chat-section">
          <ChatInterface artworkId={artwork.id} />
        </div>
      </div>
    </div>
  );
};

export default DiscussionPage;