import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProcedimentosService } from './procedimentos.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { SistemaJwtAuthGuard } from 'src/auth/guards/sistema-jwt-auth.guard';
import { SistemaAtual } from 'src/auth/decorators/sistema-atual.decorator';
import { Sistema } from '@prisma/client';

@Controller('procedimentos')
export class ProcedimentosController {
  constructor(private readonly procedimentosService: ProcedimentosService) {}

  @IsPublic()
  @UseGuards(SistemaJwtAuthGuard)
  @Get('consultar-procedimento/:protocolo_procedimento')
  consultarProcedimento(
    @SistemaAtual() sistema: Sistema,
    @Param('protocolo_procedimento') protocolo_procedimento: string,
    @Query('retornar_assuntos') retornar_assuntos: string,
    @Query('retornar_interessados') retornar_interessados: string,
    @Query('retornar_observacoes') retornar_observacoes: string,
    @Query('retornar_andamento_geracao') retornar_andamento_geracao: string,
    @Query('retornar_andamento_conclusao') retornar_andamento_conclusao: string,
    @Query('retornar_ultimo_andamento') retornar_ultimo_andamento: string,
    @Query('retornar_unidades_procedimento_aberto') retornar_unidades_procedimento_aberto: string,
    @Query('retornar_procedimentos_relacionados') retornar_procedimentos_relacionados: string,
    @Query('retornar_procedimentos_anexados') retornar_procedimentos_anexados: string
  ) {
    return this.procedimentosService.consultarProcedimento(
      sistema,
      protocolo_procedimento,
      retornar_assuntos,
      retornar_interessados,
      retornar_observacoes,
      retornar_andamento_geracao,
      retornar_andamento_conclusao,
      retornar_ultimo_andamento,
      retornar_unidades_procedimento_aberto,
      retornar_procedimentos_relacionados,
      retornar_procedimentos_anexados
    );
  }

  @IsPublic()
  @UseGuards(SistemaJwtAuthGuard)
  @Get('listar-unidades')
  listarUnidades(
    @SistemaAtual() sistema: Sistema,
  ) {
    return this.procedimentosService.listarUnidades(sistema);
  }
}
