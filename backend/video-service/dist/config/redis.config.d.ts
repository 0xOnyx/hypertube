import { ConfigService } from '@nestjs/config';
import { BullModuleOptions } from '@nestjs/bull';
export declare const redisConfig: (configService: ConfigService) => BullModuleOptions;
