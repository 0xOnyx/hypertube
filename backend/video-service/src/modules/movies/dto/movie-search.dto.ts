import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class MovieSearchDto {
  @ApiProperty({ description: 'Search term', required: false })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ description: 'Genres to filter', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @ApiProperty({ description: 'Minimum year', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yearMin?: number;

  @ApiProperty({ description: 'Maximum year', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yearMax?: number;

  @ApiProperty({ description: 'Minimum rating', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ratingMin?: number;

  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @ApiProperty({ description: 'Sort by', required: false, default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ description: 'Sort order', required: false, default: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
} 