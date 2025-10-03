import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async findAllByTenant(tenantId: string): Promise<UserEntity[]> {
    return this.userRepository.findAllByTenant(tenantId);
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto, isAdmin = false): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!isAdmin && dto.roles) {
      delete dto.roles;
    }

    return this.userRepository.update(id, dto);
  }

  async updateUserRole(
    userId: string, 
    tenantId: string, 
    updateUserRoleDto: UpdateUserRoleDto,
    updatedByUserId: string
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
      include: { roles: true }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (updateUserRoleDto.departmentId) {
      const department = await this.prisma.department.findFirst({
        where: { id: updateUserRoleDto.departmentId, tenantId }
      });

      if (!department) {
        throw new NotFoundException('Departamento não encontrado');
      }
    }
    const existingRole = user.roles.find(role => 
      role.departmentId === updateUserRoleDto.departmentId
    );

    let updatedRole;

    if (existingRole) {
      updatedRole = await this.prisma.userRole.update({
        where: { id: existingRole.id },
        data: { role: updateUserRoleDto.role },
        include: {
          user: { select: { id: true, name: true } },
          department: { select: { id: true, name: true } }
        }
      });
    } else {
      updatedRole = await this.prisma.userRole.create({
        data: {
          userId,
          role: updateUserRoleDto.role,
          departmentId: updateUserRoleDto.departmentId,
        },
        include: {
          user: { select: { id: true, name: true } },
          department: { select: { id: true, name: true } }
        }
      });
    }
    const departmentName = updatedRole.department?.name || 'Geral';
    await this.notificationService.create(tenantId, updatedByUserId, {
      title: 'Alteração de Função',
      message: `Sua função foi alterada para ${updateUserRoleDto.role} no departamento ${departmentName}`,
      type: 'ROLE_CHANGE',
      data: { 
        newRole: updateUserRoleDto.role,
        departmentId: updateUserRoleDto.departmentId,
        departmentName 
      },
      userIds: [userId]
    });

    return updatedRole;
  }

  async getUserRoles(userId: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
      include: {
        roles: {
          include: {
            department: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user.roles;
  }

  async activate(id: string): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.userRepository.activate(id);
  }

  async deactivate(id: string): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.userRepository.deactivate(id);
  }
}
