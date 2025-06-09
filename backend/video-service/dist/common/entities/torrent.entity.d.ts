import { Movie } from './movie.entity';
export declare class Torrent {
    id: number;
    magnetUri: string;
    hash: string;
    name: string;
    size: number;
    seeders: number;
    leechers: number;
    quality: string;
    status: string;
    progress: number;
    filePath?: string;
    createdAt: Date;
    updatedAt: Date;
    movie: Movie;
    movieId: number;
}
