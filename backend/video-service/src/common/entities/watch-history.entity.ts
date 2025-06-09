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

@Entity('watch_history')
@Index(['userId', 'movieId'], { unique: true })
export class WatchHistory {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique history ID' })
  id: number;

  @Column()
  @ApiProperty({ description: 'User ID' })
  userId: number;

  @Column('int', { default: 0 })
  @ApiProperty({ description: 'Watch position in seconds' })
  watchPosition: number;

  @Column('int', { nullable: true })
  @ApiProperty({ description: 'Total watched time in seconds', required: false })
  totalWatchTime?: number;

  @Column({ default: false })
  @ApiProperty({ description: 'Movie completed' })
  completed: boolean;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  @ApiProperty({ description: 'Watched percentage (0-100)' })
  progressPercentage: number;

  @Column('varchar', { length: 20, default: 'watching' })
  @ApiProperty({ 
    description: 'Watch status',
    enum: ['watching', 'paused', 'completed', 'abandoned']
  })
  status: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'First watch date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Movie, (movie) => movie.watchHistory, { onDelete: 'CASCADE' })
  movie: Movie;

  @Column()
  movieId: number;
} 