export interface Movie {
  id: number;
  imdbId: string;
  title: string;
  originalTitle?: string;
  year?: number;
  rating?: number;
  runtime?: number;
  synopsis?: string;
  genres?: string[];
  directors?: string[];
  actors?: string[];
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  status?: string;
  videoPath?: string;
  fileSize?: number;
  quality?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Legacy fields for compatibility (will be mapped from new fields)
  imdbRating?: number;
  director?: string;
  plot?: string;
  language?: string;
  country?: string;
  poster?: string;
  imdbID?: string;
  type?: string;
  metascore?: number;
}

export interface MovieSearchResponse {
  data: Movie[];        // Backend returns "data" not "movies"
  total: number;        // Backend returns "total" not "totalResults"
  page: number;
  limit: number;
  totalPages: number;
}

export interface MovieDetails extends Movie {
  comments?: Comment[];
  watched?: boolean;
  watchedAt?: string;
}

export interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
} 