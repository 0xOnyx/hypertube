import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, MovieDetails, MovieSearchResponse, Comment } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  searchMovies(query: string, page = 1): Observable<MovieSearchResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString());
    
    return this.http.get<MovieSearchResponse>(`${this.apiUrl}/movies/search`, { params });
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