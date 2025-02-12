import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SGUService } from './sgu.service';

@Global()
@Module({
  providers: [PrismaService, SGUService],
  exports: [PrismaService, SGUService],
})
export class PrismaModule {}
