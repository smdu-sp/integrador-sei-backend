import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Sistema } from '@prisma/client';
import { SistemaAuthRequest } from '../models/SistemaAuthRequest';

export const SistemaAtual = createParamDecorator(
  (data: unknown, context: ExecutionContext): Sistema => {
    const request = context.switchToHttp().getRequest<SistemaAuthRequest>();
    return request.user;
  },
);
