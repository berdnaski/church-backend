import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth-guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CategoryDepartmentService } from './category-department.service';
import { CreateCategoryDepartmentDto } from './dto/create-category-department.dto';

@ApiTags('Categorias de Departamentos')
@ApiBearerAuth()
@Controller('category-department')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryDepartmentController {
  constructor(private readonly categoryDepartmentService: CategoryDepartmentService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atribuir uma categoria a um departamento' })
  @ApiResponse({ status: 201, description: 'Categoria atribuída com sucesso ao departamento' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Categoria ou departamento não encontrado' })
  create(@Request() req, @Body() createCategoryDepartmentDto: CreateCategoryDepartmentDto) {
    return this.categoryDepartmentService.create(req.user.tenantId, createCategoryDepartmentDto);
  }

  @Get('department/:departmentId')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Listar todas as categorias de um departamento' })
  @ApiResponse({ status: 200, description: 'Lista de categorias retornada com sucesso' })
  findAll(@Request() req, @Param('departmentId') departmentId: string) {
    return this.categoryDepartmentService.findAll(departmentId, req.user.tenantId);
  }

  @Get('category/:categoryId')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Listar todos os departamentos de uma categoria' })
  @ApiResponse({ status: 200, description: 'Lista de departamentos retornada com sucesso' })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.categoryDepartmentService.findByCategory(categoryId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Buscar uma associação categoria-departamento pelo ID' })
  @ApiResponse({ status: 200, description: 'Associação encontrada' })
  @ApiResponse({ status: 404, description: 'Associação não encontrada' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.categoryDepartmentService.findOne(id, req.user.tenantId);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover uma associação categoria-departamento' })
  @ApiResponse({ status: 200, description: 'Associação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Associação não encontrada' })
  remove(@Request() req, @Param('id') id: string) {
    return this.categoryDepartmentService.remove(id, req.user.tenantId);
  }
}
