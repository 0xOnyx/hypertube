import { Movie } from './movie.entity';
export declare class WatchHistory {
    id: number;
    userId: number;
    watchPosition: number;
    totalWatchTime?: number;
    completed: boolean;
    progressPercentage: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    movie: Movie;
    movieId: number;
}
