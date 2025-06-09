import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdateWatchHistoryDto {
  @ApiProperty({ description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Watch position in seconds', required: false })
  @IsOptional()
  @IsNumber()
  watchPosition?: number;

  @ApiProperty({ description: 'Total watched time in seconds', required: false })
  @IsOptional()
  @IsNumber()
  totalWatchTime?: number;

  @ApiProperty({ description: 'Movie completed', required: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({ description: 'Watched percentage (0-100)', required: false })
  @IsOptional()
  @IsNumber()
  progressPercentage?: number;

  @ApiProperty({ 
    description: 'Watch status', 
    enum: ['watching', 'paused', 'completed', 'abandoned'],
    required: false 
  })
  @IsOptional()
  @IsString()
  status?: string;
} 