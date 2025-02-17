import { Module } from '@nestjs/common';
import { ProcedimentosService } from './procedimentos.service';
import { ProcedimentosController } from './procedimentos.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SistemaJwtAuthGuard } from 'src/auth/guards/sistema-jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [ProcedimentosController],
  imports: [AuthModule],
  providers: [ProcedimentosService],
})
export class ProcedimentosModule {}
