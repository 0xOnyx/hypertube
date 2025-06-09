import { Movie } from './movie.entity';
export declare class Comment {
    id: number;
    userId: number;
    content: string;
    rating?: number;
    isModerated: boolean;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
    movie: Movie;
    movieId: number;
}
