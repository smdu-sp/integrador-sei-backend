import { BadRequestException, Global, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSistemaDto } from './dto/create-sistema.dto';
import { UpdateSistemaDto } from './dto/update-sistema.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { Usuario, $Enums } from '@prisma/client';
import { SistemaPayload } from 'src/auth/models/SistemaPayload';
import { JwtService } from '@nestjs/jwt';

@Global()
@Injectable()
export class SistemasService {
  constructor(
    private prisma: PrismaService,
    private app: AppService,
    private readonly jwtService: JwtService,
  ) {}

  async gerarTokenSistema(sistema_id: string) {
    const sistema = await this.prisma.sistema.findUnique({ where: { id: sistema_id } });
    if (!sistema) throw new BadRequestException('Sistema não encontrado.');
    const { id, nome, sigla, identificacao } = sistema;
    const payload: SistemaPayload = {
      sub: id,
      nome,
      sigla,
      identificacao
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.SISTEMA_JWT_SECRET,
    });
    await this.prisma.token.create({ data: { sistema_id, token } });
    return { token_sistema: token };
  }

  async criar(createSistemaDto: CreateSistemaDto, usuario: Usuario) {
    const { nome, sigla, identificacao } = createSistemaDto;
    if (!nome || !sigla || !identificacao || nome === '' || sigla === '' || identificacao === ''){
      const faltantes = [];
      if (!nome || nome === '') faltantes.push('Nome');
      if (!sigla || sigla === '') faltantes.push('Sigla');
      if (!identificacao || identificacao === '') faltantes.push('Identificação');
      throw new BadRequestException(`Por favor, preencha todos os campos obrigatórios: ${faltantes.join(', ')}`);
    }
    const usuarioVerificado = await this.prisma.usuario.findUnique({ where: { id: usuario.id } });
    if (!usuarioVerificado) throw new BadRequestException('Usuário não encontrado.');
    if (usuarioVerificado.status !== 1) throw new BadRequestException('Usuário inativo.');
    if (usuarioVerificado.permissao === 'USR') throw new BadRequestException('Usuário sem permissão.');
    const verificaNome = await this.prisma.sistema.findUnique({ where: { nome } });
    if (verificaNome) throw new BadRequestException('Sistema com esse nome já cadastrado.');
    const verificaSigla = await this.prisma.sistema.findUnique({ where: { sigla } });
    if (verificaSigla) throw new BadRequestException('Sistema com essa sigla já cadastrada.');
    const verificaIdentificacao = await this.prisma.sistema.findUnique({ where: { identificacao } });
    if (verificaIdentificacao) throw new BadRequestException('Não foi possivel cadastrar o sistema, procure a equipe de desenvolvimento.');
    const sistema = await this.prisma.sistema.create({ data: { ...createSistemaDto, usuario_id: usuario.id } });
    if (!sistema) throw new InternalServerErrorException('Não foi possivel cadastrar o sistema. Tente novamente.');
    const { token_sistema } = await this.gerarTokenSistema(sistema.id);
    return { sistema, token_sistema };
  }

  async buscarTudo(
    pagina: number = 1,
    limite: number = 10,
    busca?: string
  ) {
    [pagina, limite] = this.app.verificaPagina(pagina, limite);
    const searchParams = {
      ...(busca && {
        OR: [
          { nome: { contains: busca } },
        ],
      }),
    };
    const total = await this.prisma.sistema.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, users: [] };
    [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
    const sistemas = await this.prisma.sistema.findMany({
      where: searchParams,
      orderBy: { nome: 'asc' },
      skip: (pagina - 1) * limite,
      take: limite,
      select: {
        id: true,
        nome: true,
        sigla: true,
        criado_em: true,
        alterado_em: true,
      }
    });
    return {
      total: +total,
      pagina: +pagina,
      limite: +limite,
      data: sistemas,
    };
  }

  async buscarPorId(id: string) {
    if (!id || id === '') throw new BadRequestException('Por favor, informe o id do sistema que deseja buscar.');
    const sistema = await this.prisma.sistema.findUnique({ 
      where: { id },
      include: {
        token: true
      }
    });
    if (!sistema) throw new BadRequestException('Sistema não encontrado.');
    return sistema;
  }

  async atualizar(id: string, updateSistemaDto: UpdateSistemaDto, usuario: Usuario) {
    if (!id || id === '') throw new BadRequestException('Por favor, informe o id do sistema que deseja atualizar.');
    const { nome, sigla, identificacao } = updateSistemaDto;
    if ((nome && nome === '') || (sigla && sigla === '') || (identificacao && identificacao === '')){
      const faltantes = [];
      if (nome && nome === '') faltantes.push('Nome');
      if (sigla && sigla === '') faltantes.push('Sigla');
      if (identificacao && identificacao === '') faltantes.push('Identificação');
      throw new BadRequestException(`Por favor, não deixe nenhum campo enviado vazio: ${faltantes.join(', ')}`);
    }
    const usuarioVerificado = await this.prisma.usuario.findUnique({ where: { id: usuario.id } });
    if (!usuarioVerificado) throw new BadRequestException('Usuário não encontrado.');
    if (usuarioVerificado.status !== 1) throw new BadRequestException('Usuário inativo.');
    if (usuarioVerificado.permissao === 'USR') throw new BadRequestException('Usuário sem permissão.');
    if (nome) {
      const verificaNome = await this.prisma.sistema.findUnique({ where: { nome } });
      if (verificaNome && verificaNome.id !== id) throw new BadRequestException('Sistema com esse nome já cadastrado.');
    }
    if (sigla) {
      const verificaSigla = await this.prisma.sistema.findUnique({ where: { sigla } });
      if (verificaSigla && verificaSigla.id !== id) throw new BadRequestException('Sistema com essa sigla já cadastrada.');
    }
    if (identificacao) {
      const verificaIdentificacao = await this.prisma.sistema.findUnique({ where: { identificacao } });
      if (verificaIdentificacao && verificaIdentificacao.id !== id) throw new BadRequestException('Não foi possivel cadastrar o sistema, procure a equipe de desenvolvimento.');
    }
    const sistema = await this.prisma.sistema.update({
      data: updateSistemaDto,
      where: { id },
    });
    if (!sistema) throw new InternalServerErrorException('Não foi possivel cadastrar o sistema. Tente novamente.');
  }

  async desativar(id: string) {
    if (!id || id === '') throw new BadRequestException('Por favor, informe o id do sistema que deseja desativar.');
    const sistema = await this.prisma.sistema.update({
      data: { status: false },
      where: { id },
    });
    if (!sistema) throw new InternalServerErrorException('Não foi possivel desativar o sistema. Tente novamente.');
  }
}
