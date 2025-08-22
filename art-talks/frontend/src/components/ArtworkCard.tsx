// Summary card for an artwork
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Artwork } from '../types';
import './ArtworkCard.css';

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const navigate = useNavigate();

  // Tooltip visibility and cursor position 
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Open artwork details page
  const handleCardClick = () => {
    navigate(`/artwork/${artwork.id}`);
  };

  // Show tooltip and capture starting position
  const handleMouseEnter = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  // Keep tooltip near the cursor as it moves
  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  // Hide tooltip on leave
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div 
        className="artwork-card" 
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="artwork-image-container">
          <img src={artwork.imageUrl} alt={artwork.title} className="artwork-image" />
        </div>
        <div className="artwork-details">
          <h3 className="artwork-title">{artwork.title}</h3>
          <p className="artwork-artist">{artwork.artist}</p>
          <p className="artwork-description">{artwork.description}</p>
        </div>
      </div>
      
      {/* Cursor-anchored metadata tooltip */}
      {showTooltip && (
        <div 
          className="image-tooltip" 
          style={{ 
            left: tooltipPosition.x + 10, 
            top: tooltipPosition.y - 100 
          }}
        >
          <div className="tooltip-content">
            <div><strong>Resolution:</strong> {artwork.metadata.resolution}</div>
            <div><strong>File Size:</strong> {artwork.metadata.fileSize}</div>
            <div><strong>Format:</strong> {artwork.metadata.format}</div>
            <div><strong>Year:</strong> {artwork.metadata.dateCreated}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtworkCard;