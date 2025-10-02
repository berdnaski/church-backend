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

import { JwtAuthGuard } from '../../common/guards/jwt-auth-guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { CreateSubcategoriesBatchDto } from './dto/create-subcategories-batch.dto';

@ApiTags('Subcategorias')
@ApiBearerAuth()
@Controller('subcategories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar uma nova subcategoria' })
  @ApiResponse({ status: 201, description: 'Subcategoria criada com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  create(@Request() req, @Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.create(req.user.tenantId, createSubcategoryDto);
  }

  @Post('batch')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar múltiplas subcategorias de uma vez' })
  @ApiResponse({ status: 201, description: 'Subcategorias criadas com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  createBatch(@Request() req, @Body() createBatchDto: CreateSubcategoriesBatchDto) {
    return this.subcategoryService.createBatch(req.user.tenantId, createBatchDto);
  }

  @Get('category/:categoryId')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Listar todas as subcategorias de uma categoria' })
  @ApiResponse({ status: 200, description: 'Lista de subcategorias retornada com sucesso' })
  findAll(@Request() req, @Param('categoryId') categoryId: string) {
    return this.subcategoryService.findAll(categoryId, req.user.tenantId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Buscar uma subcategoria pelo ID' })
  @ApiResponse({ status: 200, description: 'Subcategoria encontrada' })
  @ApiResponse({ status: 404, description: 'Subcategoria não encontrada' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.subcategoryService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar uma subcategoria' })
  @ApiResponse({ status: 200, description: 'Subcategoria atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Subcategoria não encontrada' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoryService.update(id, req.user.tenantId, updateSubcategoryDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover uma subcategoria' })
  @ApiResponse({ status: 200, description: 'Subcategoria removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Subcategoria não encontrada' })
  remove(@Request() req, @Param('id') id: string) {
    return this.subcategoryService.remove(id, req.user.tenantId);
  }
}
