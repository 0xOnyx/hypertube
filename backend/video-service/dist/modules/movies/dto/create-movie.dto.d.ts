export declare class CreateMovieDto {
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
}
