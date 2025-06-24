import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie, MovieDetails, MovieSearchResponse, Comment, WatchHistory } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMovies(page: number = 1, limit: number = 20): Observable<MovieSearchResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<MovieSearchResponse>(`${this.apiUrl}/movies`, { params });
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${id}`);
  }

  searchMovies(query: string, page: number = 1, limit: number = 20): Observable<MovieSearchResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<MovieSearchResponse>(`${this.apiUrl}/movies/search`, { params });
  }

  getWatchHistory(page: number = 1, limit: number = 20): Observable<MovieSearchResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<MovieSearchResponse>(`${this.apiUrl}/movies/history`, { params });
  }

  updateWatchHistory(movieId: number, data: Partial<WatchHistory>): Observable<WatchHistory> {
    return this.http.put<WatchHistory>(`${this.apiUrl}/movies/${movieId}/history`, data);
  }

  getWatchlist(page: number = 1, limit: number = 20): Observable<MovieSearchResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<MovieSearchResponse>(`${this.apiUrl}/movies/watchlist`, { params });
  }

  addToWatchlist(movieId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/movies/${movieId}/watchlist`, {});
  }

  removeFromWatchlist(movieId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/movies/${movieId}/watchlist`);
  }

  getMovieDetails(id: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.apiUrl}/movies/${id}`);
  }

  getPopularMovies(page = 1): Observable<MovieSearchResponse> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<MovieSearchResponse>(`${this.apiUrl}/movies/popular`, { params });
  }

  getMoviesByGenre(genre: string, page = 1): Observable<MovieSearchResponse> {
    const params = new HttpParams()
      .set('genre', genre)
      .set('page', page.toString());
    
    return this.http.get<MovieSearchResponse>(`${this.apiUrl}/movies/genre`, { params });
  }

  watchMovie(movieId: number): Observable<{success: boolean, message?: string}> {
    return this.http.post<{success: boolean, message?: string}>(`${this.apiUrl}/movies/${movieId}/watch`, {});
  }

  getWatchedMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies/watched`);
  }

  addComment(movieId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/movies/${movieId}/comments`, { content });
  }

  getComments(movieId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/movies/${movieId}/comments`);
  }

  getStreamingUrl(movieId: number): Observable<{url: string}> {
    return this.http.get<{url: string}>(`${this.apiUrl}/movies/${movieId}/stream`);
  }
} 