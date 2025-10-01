import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

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
