import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSistemaDto } from './dto/create-sistema.dto';
import { UpdateSistemaDto } from './dto/update-sistema.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class SistemasService {
  constructor(
    private prisma: PrismaService,
    private app: AppService,
  ) {}

  async criar(createSistemaDto: CreateSistemaDto, usuario: Usuario) {
    const { nome, sigla, identificacao } = createSistemaDto;
    if (!nome || !sigla || !identificacao || nome === '' || sigla === '' || identificacao === ''){
      const faltantes = [];
      if (!nome || nome === '') faltantes.push('Nome');
      if (!sigla || sigla === '') faltantes.push('Sigla');
      if (!identificacao || identificacao === '') faltantes.push('Identificação');
      throw new BadRequestException(
        `Por favor, preencha todos os campos obrigatórios: ${faltantes.join(', ')}`,
      );
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
    return sistema;
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
    return `This action returns a #${id} sistema`;
  }

  async atualizar(id: string, updateSistemaDto: UpdateSistemaDto) {
    return `This action updates a #${id} sistema`;
  }

  async desativar(id: string) {
    return `This action removes a #${id} sistema`;
  }
}
