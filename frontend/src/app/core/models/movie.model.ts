export interface Movie {
  id: number;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
  director: string;
  actors: string;
  plot: string;
  language: string;
  country: string;
  poster: string;
  imdbRating: number;
  imdbID: string;
  type: string;
  metascore?: number;
}

export interface MovieSearchResponse {
  movies: Movie[];
  totalResults: number;
  page: number;
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