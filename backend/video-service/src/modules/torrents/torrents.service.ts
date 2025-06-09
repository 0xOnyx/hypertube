import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Torrent } from '../../common/entities/torrent.entity';

@Injectable()
export class TorrentsService {
  constructor(
    @InjectRepository(Torrent)
    private torrentRepository: Repository<Torrent>,
  ) {}

  async findByMovieId(movieId: number): Promise<Torrent[]> {
    return this.torrentRepository.find({
      where: { movieId },
      order: { seeders: 'DESC' },
    });
  }

  async startDownload(id: number): Promise<{ message: string }> {
    const torrent = await this.torrentRepository.findOne({ where: { id } });
    if (!torrent) {
      throw new Error('Torrent not found');
    }

    // Here you could start the download with a queue system
    torrent.status = 'downloading';
    await this.torrentRepository.save(torrent);

    return { message: 'Download started' };
  }
} 