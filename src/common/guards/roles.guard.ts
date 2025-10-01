import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'Sua sessão expirou ou é inválida. Por favor, faça login novamente.',
      );
    }

    if (!user.roles) {
      throw new ForbiddenException(
        'Seu perfil de usuário está incompleto. Permissões não encontradas.',
      );
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado. Esta operação requer uma das seguintes permissões: ${requiredRoles.join(', ')}. Seu perfil atual não possui as permissões necessárias.`,
      );
    }

    return true;
  }
}
