import { TorrentsService } from './torrents.service';
export declare class TorrentsController {
    private readonly torrentsService;
    constructor(torrentsService: TorrentsService);
    getTorrentsByMovie(movieId: number): Promise<import("../../common/entities/torrent.entity").Torrent[]>;
    startDownload(id: number): Promise<{
        message: string;
    }>;
}
