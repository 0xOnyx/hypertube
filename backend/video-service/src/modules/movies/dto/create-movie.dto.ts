import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, IsUrl } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ description: 'IMDB ID of the movie' })
  @IsString()
  imdbId: string;

  @ApiProperty({ description: 'Movie title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Original movie title', required: false })
  @IsOptional()
  @IsString()
  originalTitle?: string;

  @ApiProperty({ description: 'Release year', required: false })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiProperty({ description: 'IMDB rating', required: false })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({ description: 'Runtime in minutes', required: false })
  @IsOptional()
  @IsNumber()
  runtime?: number;

  @ApiProperty({ description: 'Movie synopsis', required: false })
  @IsOptional()
  @IsString()
  synopsis?: string;

  @ApiProperty({ description: 'Movie genres', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @ApiProperty({ description: 'Directors', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  directors?: string[];

  @ApiProperty({ description: 'Main actors', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  actors?: string[];

  @ApiProperty({ description: 'Poster URL', required: false })
  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @ApiProperty({ description: 'Backdrop URL', required: false })
  @IsOptional()
  @IsUrl()
  backdropUrl?: string;

  @ApiProperty({ description: 'Trailer URL', required: false })
  @IsOptional()
  @IsUrl()
  trailerUrl?: string;
} 