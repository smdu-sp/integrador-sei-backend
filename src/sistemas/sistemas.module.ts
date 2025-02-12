import { Global, Module } from '@nestjs/common';
import { SistemasService } from './sistemas.service';
import { SistemasController } from './sistemas.controller';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  controllers: [SistemasController],
  providers: [SistemasService],
  exports: [SistemasService],
  imports: [
    JwtModule.register({
      secret: process.env.SISTEMA_JWT_SECRET,
    })
  ]
})
export class SistemasModule {}
