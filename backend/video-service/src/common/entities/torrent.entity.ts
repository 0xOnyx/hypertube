 import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Movie } from './movie.entity';

@Entity('torrents')
@Index(['magnetUri'], { unique: true })
export class Torrent {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique torrent ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: 'Torrent magnet URI' })
  magnetUri: string;

  @Column()
  @ApiProperty({ description: 'Torrent hash' })
  hash: string;

  @Column()
  @ApiProperty({ description: 'Torrent name' })
  name: string;

  @Column('bigint')
  @ApiProperty({ description: 'Size in bytes' })
  size: number;

  @Column('int', { default: 0 })
  @ApiProperty({ description: 'Number of seeders' })
  seeders: number;

  @Column('int', { default: 0 })
  @ApiProperty({ description: 'Number of leechers' })
  leechers: number;

  @Column('varchar', { length: 10 })
  @ApiProperty({ description: 'Torrent quality (720p, 1080p, etc.)' })
  quality: string;

  @Column('varchar', { length: 20, default: 'pending' })
  @ApiProperty({ 
    description: 'Download status',
    enum: ['pending', 'downloading', 'completed', 'failed', 'seeding']
  })
  status: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  @ApiProperty({ description: 'Download progress (0-100)' })
  progress: number;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Downloaded file path', required: false })
  filePath?: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Movie, (movie) => movie.torrents, { onDelete: 'CASCADE' })
  movie: Movie;

  @Column()
  movieId: number;
} 