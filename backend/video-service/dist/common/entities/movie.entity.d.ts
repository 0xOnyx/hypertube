import { Torrent } from './torrent.entity';
import { WatchHistory } from './watch-history.entity';
import { Comment } from './comment.entity';
export declare class Movie {
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
    status: string;
    videoPath?: string;
    fileSize?: number;
    quality?: string;
    createdAt: Date;
    updatedAt: Date;
    torrents: Torrent[];
    watchHistory: WatchHistory[];
    comments: Comment[];
}
