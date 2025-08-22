// Gallery page (Homepage)
import React, { useState, useEffect } from 'react';
import { Artwork } from '../types';
import { fetchArtworks } from '../utils/api';
import ArtworkCard from '../components/ArtworkCard';
import SearchBar from '../components/SearchBar';
import './GalleryPage.css';

const GalleryPage: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load artworks on mount
  useEffect(() => {
    const loadArtworks = async () => {
      try {
        setLoading(true);
        const data = await fetchArtworks();
        setArtworks(data);
        setFilteredArtworks(data);
      } catch (err) {
        setError('Failed to load artworks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, []);

  // Filter by title/artist when search changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredArtworks(artworks);
    } else {
      const filtered = artworks.filter(artwork =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArtworks(filtered);
    }
  }, [searchTerm, artworks]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="gallery-container">
        <div className="loading">Loading artworks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <h1>Art Talks</h1>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
      </header>
      
      <div className="gallery-grid">
        {filteredArtworks.map(artwork => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
      
      {filteredArtworks.length === 0 && searchTerm && (
        <div className="no-results">
          No artworks found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default GalleryPage;