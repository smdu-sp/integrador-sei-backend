import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Sistema } from '@prisma/client';
import { SistemasService } from 'src/sistemas/sistemas.service';
import { SistemaPayload } from '../models/SistemaPayload';

@Injectable()
export class SistemaJwtStrategy extends PassportStrategy(Strategy, 'sistema-jwt') {
  constructor(private sistemasService: SistemasService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SISTEMA_JWT_SECRET,
    });
  }

  async validate(payload: SistemaPayload): Promise<Sistema> {
    const sistema = await this.sistemasService.buscarPorId(payload.sub);
    if (!sistema) throw new Error('Sistema não encontrado');
    return sistema;
  }
}
