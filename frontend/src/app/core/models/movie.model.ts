export interface Movie {
  id: number;
  imdbId: string;
  title: string;
  originalTitle?: string;
  year?: number;
  rating?: string;
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
  createdAt?: string;
  updatedAt?: string;
  
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

export interface Torrent {
  id: number;
  magnetUri: string;
  hash: string;
  name: string;
  size: string;
  seeders: number;
  leechers: number;
  quality: string;
  status: string;
  progress: string;
  filePath?: string;
  createdAt: string;
  updatedAt: string;
  movieId: number;
}

export interface WatchHistory {
  id: number;
  userId: number;
  watchPosition: number;
  totalWatchTime: number;
  completed: boolean;
  progressPercentage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  movieId: number;
}

export interface Comment {
  id: number;
  userId: number;
  content: string;
  rating?: string;
  isModerated: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  movieId: number;
  // Optional user info that might be populated by joins
  user?: {
    id: number;
    username: string;
    profilePicture?: string;
  };
}

export interface MovieDetails extends Movie {
  torrents?: Torrent[];
  comments?: Comment[];
  watchHistory?: WatchHistory[];
  watched?: boolean;
  watchedAt?: string;
} 