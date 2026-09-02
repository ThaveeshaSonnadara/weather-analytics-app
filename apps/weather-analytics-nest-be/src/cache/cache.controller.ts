import { Controller, Get, UseGuards } from '@nestjs/common';
import { CacheService } from './cache.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cache')
@UseGuards(JwtAuthGuard)
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get('status')
  getStatus() {
    return {
      entries: this.cacheService.getStatus(),
    };
  }
}
