import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SistemasService } from './sistemas.service';
import { CreateSistemaDto } from './dto/create-sistema.dto';
import { UpdateSistemaDto } from './dto/update-sistema.dto';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Usuario } from '@prisma/client';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('sistemas')
export class SistemasController {
  constructor(private readonly sistemasService: SistemasService) {}

  @Permissoes('ADM')
  @Post('criar')
  criar(
    @Body() createSistemaDto: CreateSistemaDto,
    @UsuarioAtual() usuario: Usuario
  ) {
    return this.sistemasService.criar(createSistemaDto, usuario);
  }

  @IsPublic()
  @Get('gerar-token/:id')
  gerarTokenSistema(
    @Param('id') id: string
  ) {
    return this.sistemasService.gerarTokenSistema(id);
  }

  @Permissoes('ADM')
  @Get('buscar-tudo') //localhost:3000/usuarios/buscar-tudo
  @ApiBearerAuth()
  buscarTudo(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('busca') busca?: string
  ) {
    return this.sistemasService.buscarTudo(
      +pagina,
      +limite,
      busca
    );
  }

  @Get('buscar-por-id/:id')
  buscarPorId(@Param('id') id: string) {
    return this.sistemasService.buscarPorId(id);
  }

  @Patch('atualizar/:id')
  atualizar(
    @Param('id') id: string,
    @Body() updateSistemaDto: UpdateSistemaDto,
    @UsuarioAtual() usuario: Usuario
  ) {
    return this.sistemasService.atualizar(id, updateSistemaDto, usuario);
  }

  @Delete('desativar/:id')
  desativar(@Param('id') id: string) {
    return this.sistemasService.desativar(id);
  }
}
