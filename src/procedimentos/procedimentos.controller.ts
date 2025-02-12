import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProcedimentosService } from './procedimentos.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('procedimentos')
export class ProcedimentosController {
  constructor(private readonly procedimentosService: ProcedimentosService) {}

  @IsPublic()
  @Get('consultar-procedimento/:protocolo_procedimento')
  consultarProcedimento(
    @Param('protocolo_procedimento') protocolo_procedimento: string,
    @Query('id_unidade') id_unidade: string,
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
      protocolo_procedimento,
      id_unidade,
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
}
