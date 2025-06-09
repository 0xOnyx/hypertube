import { Response } from 'express';
export declare class StreamingService {
    streamMovie(movieId: number, res: Response): Promise<void>;
}
