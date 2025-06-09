import { Repository } from 'typeorm';
import { Torrent } from '../../common/entities/torrent.entity';
export declare class TorrentsService {
    private torrentRepository;
    constructor(torrentRepository: Repository<Torrent>);
    findByMovieId(movieId: number): Promise<Torrent[]>;
    startDownload(id: number): Promise<{
        message: string;
    }>;
}
