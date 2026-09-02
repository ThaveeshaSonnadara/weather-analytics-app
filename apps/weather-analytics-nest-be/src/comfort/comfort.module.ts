import { Module } from '@nestjs/common';
import { ComfortService } from './comfort.service';

@Module({
  providers: [ComfortService],
  exports: [ComfortService],
})
export class ComfortModule {}
