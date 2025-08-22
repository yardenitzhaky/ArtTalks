export interface Artwork {
  id: number;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  metadata: {
    resolution: string;
    fileSize: string;
    format: string;
    dateCreated: string;
  };
}

export interface ChatMessage {
  id: number;
  message: string;
  username: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}