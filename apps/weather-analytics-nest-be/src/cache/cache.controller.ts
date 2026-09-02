import { Controller, Get } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get('status')
  getStatus() {
    return {
      entries: this.cacheService.getStatus(),
    };
  }

  @Get('clear')
  clearCache() {
    this.cacheService.clear();
    return {
      message: 'In-Memory Cache got cleared',
    };
  }
}
