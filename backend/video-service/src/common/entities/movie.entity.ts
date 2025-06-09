import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Torrent } from './torrent.entity';
import { WatchHistory } from './watch-history.entity';
import { Comment } from './comment.entity';

@Entity('movies')
@Index(['imdbId'], { unique: true })
@Index(['title', 'year'])
export class Movie {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique movie ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: 'IMDB ID of the movie' })
  imdbId: string;

  @Column()
  @ApiProperty({ description: 'Movie title' })
  title: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Original movie title', required: false })
  originalTitle?: string;

  @Column('int', { nullable: true })
  @ApiProperty({ description: 'Release year', required: false })
  year?: number;

  @Column('decimal', { precision: 3, scale: 1, nullable: true })
  @ApiProperty({ description: 'IMDB rating', required: false })
  rating?: number;

  @Column('int', { nullable: true })
  @ApiProperty({ description: 'Runtime in minutes', required: false })
  runtime?: number;

  @Column('text', { nullable: true })
  @ApiProperty({ description: 'Movie synopsis', required: false })
  synopsis?: string;

  @Column('simple-array', { nullable: true })
  @ApiProperty({ description: 'Movie genres', type: [String], required: false })
  genres?: string[];

  @Column('simple-array', { nullable: true })
  @ApiProperty({ description: 'Directors', type: [String], required: false })
  directors?: string[];

  @Column('simple-array', { nullable: true })
  @ApiProperty({ description: 'Main actors', type: [String], required: false })
  actors?: string[];

  @Column({ nullable: true })
  @ApiProperty({ description: 'Poster URL', required: false })
  posterUrl?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Backdrop URL', required: false })
  backdropUrl?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Trailer URL', required: false })
  trailerUrl?: string;

  @Column('varchar', { length: 20, default: 'available' })
  @ApiProperty({ 
    description: 'Movie status',
    enum: ['available', 'downloading', 'processing', 'unavailable']
  })
  status: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Video file path', required: false })
  videoPath?: string;

  @Column('bigint', { nullable: true })
  @ApiProperty({ description: 'File size in bytes', required: false })
  fileSize?: number;

  @Column('varchar', { length: 10, nullable: true })
  @ApiProperty({ description: 'Video quality', required: false })
  quality?: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Torrent, (torrent) => torrent.movie)
  torrents: Torrent[];

  @OneToMany(() => WatchHistory, (history) => history.movie)
  watchHistory: WatchHistory[];

  @OneToMany(() => Comment, (comment) => comment.movie)
  comments: Comment[];
} 