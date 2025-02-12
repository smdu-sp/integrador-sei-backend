import { Module } from '@nestjs/common';
import { ProcedimentosService } from './procedimentos.service';
import { ProcedimentosController } from './procedimentos.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProcedimentosController],
  imports: [AuthModule],
  providers: [ProcedimentosService],
})
export class ProcedimentosModule {}
