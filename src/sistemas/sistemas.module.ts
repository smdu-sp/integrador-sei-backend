import { Module } from '@nestjs/common';
import { SistemasService } from './sistemas.service';
import { SistemasController } from './sistemas.controller';

@Module({
  controllers: [SistemasController],
  providers: [SistemasService],
})
export class SistemasModule {}
