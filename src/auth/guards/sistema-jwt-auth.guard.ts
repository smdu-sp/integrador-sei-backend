// NestJS
import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SistemaJwtAuthGuard extends AuthGuard('sistema-jwt') {
  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const canActivate = super.canActivate(context);
    if (typeof canActivate === 'boolean') return canActivate;
    const canActivatePromise = canActivate as Promise<boolean>;
    return canActivatePromise.catch((error) => {
      console.log(error);
      if (error instanceof UnauthorizedException)
        throw new UnauthorizedException(error.message);
      throw new UnauthorizedException();
    });
  }
}
  