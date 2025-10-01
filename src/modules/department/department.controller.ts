import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';

import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AddUserToDepartmentDto } from './dto/add-user-to-department.dto';

@ApiTags('Departamentos')
@ApiBearerAuth()
@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar um novo departamento' })
  @ApiResponse({ status: 201, description: 'Departamento criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  create(@Request() req, @Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(req.user.tenantId, createDepartmentDto);
  }

  @Get()
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Listar todos os departamentos' })
  @ApiResponse({ status: 200, description: 'Lista de departamentos retornada com sucesso' })
  findAll(@Request() req) {
    return this.departmentService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Buscar um departamento pelo ID' })
  @ApiResponse({ status: 200, description: 'Departamento encontrado' })
  @ApiResponse({ status: 404, description: 'Departamento não encontrado' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.departmentService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar um departamento' })
  @ApiResponse({ status: 200, description: 'Departamento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Departamento não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, req.user.tenantId, updateDepartmentDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover um departamento' })
  @ApiResponse({ status: 200, description: 'Departamento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Departamento não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  remove(@Request() req, @Param('id') id: string) {
    return this.departmentService.remove(id, req.user.tenantId);
  }

  @Post(':id/users')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Adicionar um usuário ao departamento' })
  @ApiResponse({ status: 201, description: 'Usuário adicionado com sucesso' })
  @ApiResponse({ status: 404, description: 'Departamento não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  addUser(@Request() req, @Param('id') id: string, @Body() addUserDto: AddUserToDepartmentDto) {
    return this.departmentService.addUserToDepartment(id, req.user.tenantId, addUserDto);
  }

  @Delete(':id/users/:userId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover um usuário do departamento' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Departamento não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  removeUser(@Request() req, @Param('id') id: string, @Param('userId') userId: string) {
    return this.departmentService.removeUserFromDepartment(id, req.user.tenantId, userId);
  }

  @Get(':id/users')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar usuários de um departamento' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Departamento não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  getDepartmentUsers(@Request() req, @Param('id') id: string) {
    return this.departmentService.getDepartmentUsers(id, req.user.tenantId);
  }
}
