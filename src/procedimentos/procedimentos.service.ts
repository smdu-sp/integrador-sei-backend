import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { xml2js } from 'xml-js';

@Injectable()
export class ProcedimentosService {
  constructor(
    private prisma: PrismaService,
    private app: AppService
  ) {}

  async consultarProcedimento(
    protocolo_procedimento: string,
    id_unidade: string = '',
    retornar_assuntos: string = 'S',
    retornar_interessados: string = 'S',
    retornar_observacoes: string = 'S',
    retornar_andamento_geracao: string = 'S',
    retornar_andamento_conclusao: string = 'S',
    retornar_ultimo_andamento: string = 'S',
    retornar_unidades_procedimento_aberto: string = 'S',
    retornar_procedimentos_relacionados: string = 'S',
    retornar_procedimentos_anexados: string = 'S'
  ) {
    if (!protocolo_procedimento || protocolo_procedimento.length < 16)
      throw new BadRequestException('Número do processo inválido!');
    const protocolo_procedimento_formatado = protocolo_procedimento.replace(/(\d{0,4})(\d{0,4})(\d{0,7})(\d{0,1})/, '$1.$2/$3-$4');
    const url = process.env.SEI_URL;
    const options = {
      method: 'POST',
      headers: {'content-type': 'application/xml'},
      body: `<?xml version="1.0" encoding="UTF-8"?>\n
      <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope" xmlns:sei="http://sei.prefeitura.sp.gov.br/">\n
        <soapenv:Header/>\n
        <soapenv:Body>\n
          <sei:consultarProcedimento>\n
            <SiglaSistema>${process.env.SEI_SIGLA_SISTEMA}</SiglaSistema>\n
            <IdentificacaoServico>${process.env.SEI_IDENTIFICACAO_SERVICO}</IdentificacaoServico>\n
            <ProtocoloProcedimento>${protocolo_procedimento_formatado}</ProtocoloProcedimento>\n
            ${id_unidade && id_unidade !== '' ? `<IdUnidade>${id_unidade}</IdUnidade>\n` : ''}
            <SinRetornarAssuntos>${retornar_assuntos}</SinRetornarAssuntos>\n
            <SinRetornarInteressados>${retornar_interessados}</SinRetornarInteressados>\n
            <SinRetornarObservacoes>${retornar_observacoes}</SinRetornarObservacoes>\n
            <SinRetornarAndamentoGeracao>${retornar_andamento_geracao}</SinRetornarAndamentoGeracao>\n
            <SinRetornarAndamentoConclusao>${retornar_andamento_conclusao}</SinRetornarAndamentoConclusao>\n
            <SinRetornarUltimoAndamento>${retornar_ultimo_andamento}</SinRetornarUltimoAndamento>\n
            <SinRetornarUnidadesProcedimentoAberto>${retornar_unidades_procedimento_aberto}</SinRetornarUnidadesProcedimentoAberto>\n
            <SinRetornarProcedimentosRelacionados>${retornar_procedimentos_relacionados}</SinRetornarProcedimentosRelacionados>\n
            <SinRetornarProcedimentosAnexados>${retornar_procedimentos_anexados}</SinRetornarProcedimentosAnexados>\n
          </sei:consultarProcedimento>\n
        </soapenv:Body>\n
      </soapenv:Envelope>`
    };

    try {
      const response = await fetch(url, options);
      const xml = await response.text();
      const data = xml2js(xml, { compact: true });
      if (data['env:Envelope']['env:Body']['ns1:consultarProcedimentoResponse']){
        const objetoXml = data['env:Envelope']['env:Body']['ns1:consultarProcedimentoResponse']['parametros'];
        const resultado = this.app.simplificaObjeto(objetoXml);
        return resultado;
      }
      throw new BadRequestException('Processo não encontrado!');
    } catch (error) {
      if (error instanceof BadRequestException)
        throw error;
      throw new InternalServerErrorException('Erro ao consultar processo!');
    }
  }
}
