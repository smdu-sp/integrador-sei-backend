import { Module } from '@nestjs/common';
import { ProcedimentosService } from './procedimentos.service';
import { ProcedimentosController } from './procedimentos.controller';

@Module({
  controllers: [ProcedimentosController],
  providers: [ProcedimentosService],
})
export class ProcedimentosModule {}
