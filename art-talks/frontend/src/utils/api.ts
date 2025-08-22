// API page for the frontend
import { Artwork, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Get all artworks
export const fetchArtworks = async (): Promise<Artwork[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/artworks`);
    const data: ApiResponse<Artwork[]> = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch artworks');
    }
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};

// Get a single artwork by ID
export const fetchArtworkById = async (id: number): Promise<Artwork> => {
  try {
    const response = await fetch(`${API_BASE_URL}/artworks/${id}`);
    const data: ApiResponse<Artwork> = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message || 'Failed to fetch artwork');
    }
  } catch (error) {
    console.error('Error fetching artwork:', error);
    throw error;
  }
};