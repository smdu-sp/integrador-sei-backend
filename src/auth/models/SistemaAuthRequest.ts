import { Sistema } from '@prisma/client';
import { Request } from 'express';

export interface SistemaAuthRequest extends Request {
  user: Sistema;
}
