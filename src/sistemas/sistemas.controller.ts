import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SistemasService } from './sistemas.service';
import { CreateSistemaDto } from './dto/create-sistema.dto';
import { UpdateSistemaDto } from './dto/update-sistema.dto';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Usuario } from '@prisma/client';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';

@Controller('sistemas')
export class SistemasController {
  constructor(private readonly sistemasService: SistemasService) {}

  @Permissoes('ADM')
  @Post('criar')
  criar(
    @UsuarioAtual() usuario: Usuario,
    @Body() createSistemaDto: CreateSistemaDto
  ) {
    return this.sistemasService.criar(createSistemaDto, usuario);
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
  atualizar(@Param('id') id: string, @Body() updateSistemaDto: UpdateSistemaDto) {
    return this.sistemasService.atualizar(id, updateSistemaDto);
  }

  @Delete('desativar/:id')
  desativar(@Param('id') id: string) {
    return this.sistemasService.desativar(id);
  }
}
