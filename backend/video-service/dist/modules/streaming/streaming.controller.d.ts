import { Response } from 'express';
import { StreamingService } from './streaming.service';
export declare class StreamingController {
    private readonly streamingService;
    constructor(streamingService: StreamingService);
    streamMovie(id: number, res: Response): Promise<void>;
}
