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

@Entity('comments')
@Index(['movieId', 'userId'])
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique comment ID' })
  id: number;

  @Column()
  @ApiProperty({ description: 'User ID' })
  userId: number;

  @Column('text')
  @ApiProperty({ description: 'Comment content' })
  content: string;

  @Column('decimal', { precision: 2, scale: 1, nullable: true })
  @ApiProperty({ description: 'User rating (1-5)', required: false })
  rating?: number;

  @Column({ default: false })
  @ApiProperty({ description: 'Comment moderated' })
  isModerated: boolean;

  @Column({ default: true })
  @ApiProperty({ description: 'Comment visible' })
  isVisible: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Movie, (movie) => movie.comments, { onDelete: 'CASCADE' })
  movie: Movie;

  @Column()
  movieId: number;
} 