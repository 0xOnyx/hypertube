import { Repository } from 'typeorm';
import { Movie } from '../../common/entities/movie.entity';
import { Comment } from '../../common/entities/comment.entity';
import { WatchHistory } from '../../common/entities/watch-history.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateWatchHistoryDto } from './dto/update-watch-history.dto';
import { MovieSearchDto } from './dto/movie-search.dto';
export declare class MoviesService {
    private movieRepository;
    private commentRepository;
    private watchHistoryRepository;
    constructor(movieRepository: Repository<Movie>, commentRepository: Repository<Comment>, watchHistoryRepository: Repository<WatchHistory>);
    findAll(searchDto: MovieSearchDto): Promise<{
        data: Movie[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    search(searchDto: MovieSearchDto): Promise<{
        data: Movie[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPopular(page?: number, limit?: number): Promise<{
        data: Movie[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Movie>;
    create(createMovieDto: CreateMovieDto): Promise<Movie>;
    update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie>;
    remove(id: number): Promise<void>;
    getComments(movieId: number): Promise<Comment[]>;
    addComment(movieId: number, createCommentDto: CreateCommentDto): Promise<Comment>;
    getWatchHistory(movieId: number, userId: number): Promise<WatchHistory | null>;
    updateWatchHistory(movieId: number, updateWatchHistoryDto: UpdateWatchHistoryDto): Promise<WatchHistory>;
    getStreamingUrl(movieId: number): Promise<{
        url: string;
    }>;
    getUserHistory(userId: number, page?: number, limit?: number): Promise<{
        data: Movie[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
