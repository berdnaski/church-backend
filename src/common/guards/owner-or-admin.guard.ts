import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { OWNER_OR_ADMIN_KEY } from '../decorators/owner-or-admin.decorator';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isOwnerOrAdmin = this.reflector.getAllAndOverride<boolean>(OWNER_OR_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isOwnerOrAdmin) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = request.params.id;

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

    const isAdmin = user.roles.includes('ADMIN');
    const isOwner = user.userId === userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'Acesso negado. Você só pode visualizar ou editar seu próprio perfil, a menos que seja um administrador.',
      );
    }
    return true;
  }
}
