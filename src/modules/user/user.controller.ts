import { Controller, Get, Patch, Param, Body, Request, UseGuards, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { OwnerOrAdmin } from 'src/common/decorators/owner-or-admin.decorator';
import { OwnerOrAdminGuard } from 'src/common/guards/owner-or-admin.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'LEADER')
  @ApiOperation({ summary: 'Listar todos os usuários do tenant' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  findAll(@Request() req) {
    return this.userService.findAllByTenant(req.user.tenantId);
  }

  @Get(':id')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerOrAdmin()
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({ status: 200, description: 'Dados do usuário' })
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @UseGuards(OwnerOrAdminGuard)
  @OwnerOrAdmin()
  @ApiOperation({ summary: 'Atualizar dados do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    const isAdmin = req.user.roles.includes('ADMIN') || req.user.roles.includes('LEADER');
    return this.userService.update(id, dto, isAdmin);
  }

  @Post(':id/role')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'LEADER')
  @ApiOperation({ summary: 'Atualizar role do usuário' })
  @ApiResponse({ status: 200, description: 'Role atualizada com sucesso' })
  updateRole(
    @Request() req,
    @Param('id') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto
  ) {
    return this.userService.updateUserRole(
      userId,
      req.user.tenantId,
      updateUserRoleDto,
      req.user.sub
    );
  }

  @Get(':id/roles')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'LEADER', 'COORDINATOR', 'MEMBER', 'VOLUNTEER')
  @ApiOperation({ summary: 'Listar roles do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de roles do usuário' })
  getUserRoles(@Request() req, @Param('id') userId: string) {
    return this.userService.getUserRoles(userId, req.user.tenantId);
  }

  @Patch(':id/activate')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'LEADER')
  @ApiOperation({ summary: 'Ativar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário ativado com sucesso' })
  activate(@Param('id') id: string) {
    return this.userService.activate(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'LEADER')
  @ApiOperation({ summary: 'Desativar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário desativado com sucesso' })
  deactivate(@Param('id') id: string) {
    return this.userService.deactivate(id);
  }
}
