import { Controller, Get, Param, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { OwnerOrAdmin } from 'src/common/decorators/owner-or-admin.decorator';
import { OwnerOrAdminGuard } from 'src/common/guards/owner-or-admin.guard';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('tenant/:tenantId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar todos os usuários de um tenant' })
  async listByTenant(@Param('tenantId') tenantId: string): Promise<UserEntity[]> {
    return this.userService.findAllByTenant(tenantId);
  }

  @Get(':id')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerOrAdmin()
  @ApiOperation({ summary: 'Obter um usuário pelo ID' })
  async get(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerOrAdmin()
  @ApiOperation({ summary: 'Atualizar dados de um usuário' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req,
  ): Promise<UserEntity> {
    const isAdmin = req.user.roles.includes('ADMIN');
    return this.userService.update(id, dto, isAdmin);
  }

  @Patch(':id/activate')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Ativar um usuário' })
  async activate(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.activate(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Desativar um usuário' })
  async deactivate(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.deactivate(id);
  }
}
