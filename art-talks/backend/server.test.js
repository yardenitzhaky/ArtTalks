const request = require('supertest');
const express = require('express');
const cors = require('cors');
const artworks = require('./data');

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get('/api/artworks', (req, res) => {
    res.json({
      success: true,
      data: artworks
    });
  });

  app.get('/api/artworks/:id', (req, res) => {
    const artworkId = parseInt(req.params.id);
    const artwork = artworks.find(art => art.id === artworkId);
    
    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }
    
    res.json({
      success: true,
      data: artwork
    });
  });

  return app;
};

describe('Art Talks API', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /api/artworks', () => {
    it('should return all artworks', async () => {
      const response = await request(app)
        .get('/api/artworks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check first artwork structure
      const firstArtwork = response.body.data[0];
      expect(firstArtwork).toHaveProperty('id');
      expect(firstArtwork).toHaveProperty('title');
      expect(firstArtwork).toHaveProperty('artist');
      expect(firstArtwork).toHaveProperty('description');
      expect(firstArtwork).toHaveProperty('imageUrl');
      expect(firstArtwork).toHaveProperty('metadata');
    });

    it('should return artworks with correct structure', async () => {
      const response = await request(app)
        .get('/api/artworks')
        .expect(200);

      const artworks = response.body.data;
      artworks.forEach(artwork => {
        expect(typeof artwork.id).toBe('number');
        expect(typeof artwork.title).toBe('string');
        expect(typeof artwork.artist).toBe('string');
        expect(typeof artwork.description).toBe('string');
        expect(typeof artwork.imageUrl).toBe('string');
        expect(artwork.metadata).toHaveProperty('resolution');
        expect(artwork.metadata).toHaveProperty('fileSize');
        expect(artwork.metadata).toHaveProperty('format');
        expect(artwork.metadata).toHaveProperty('dateCreated');
      });
    });
  });

  describe('GET /api/artworks/:id', () => {
    it('should return specific artwork by ID', async () => {
      const response = await request(app)
        .get('/api/artworks/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('artist');
    });

    it('should return 404 for non-existent artwork', async () => {
      const response = await request(app)
        .get('/api/artworks/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Artwork not found');
    });

    it('should handle invalid ID format', async () => {
      const response = await request(app)
        .get('/api/artworks/invalid')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/artworks')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});