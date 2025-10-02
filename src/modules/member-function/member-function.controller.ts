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
import { MemberFunctionService } from './member-function.service';
import { CreateMemberFunctionDto } from './dto/create-member-function.dto';
import { UpdateMemberFunctionDto } from './dto/update-member-function.dto';

@ApiTags('Funções de Membros')
@ApiBearerAuth()
@Controller('member-functions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MemberFunctionController {
  constructor(private readonly memberFunctionService: MemberFunctionService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atribuir uma função a um membro' })
  @ApiResponse({ status: 201, description: 'Função atribuída com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 409, description: 'Membro já possui esta função' })
  create(@Request() req, @Body() createMemberFunctionDto: CreateMemberFunctionDto) {
    return this.memberFunctionService.create(req.user.tenantId, createMemberFunctionDto);
  }

  @Get('user/:userId')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Listar todas as funções de um membro' })
  @ApiResponse({ status: 200, description: 'Lista de funções retornada com sucesso' })
  findAll(@Param('userId') userId: string) {
    return this.memberFunctionService.findAll(userId);
  }

  @Get('category/:categoryId')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Listar todos os membros de uma categoria' })
  @ApiResponse({ status: 200, description: 'Lista de membros retornada com sucesso' })
  findByCategory(@Request() req, @Param('categoryId') categoryId: string) {
    return this.memberFunctionService.findByCategory(categoryId, req.user.tenantId);
  }

  @Get('subcategory/:subcategoryId')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Listar todos os membros de uma subcategoria' })
  @ApiResponse({ status: 200, description: 'Lista de membros retornada com sucesso' })
  findBySubcategory(@Param('subcategoryId') subcategoryId: string) {
    return this.memberFunctionService.findBySubcategory(subcategoryId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Buscar uma função de membro pelo ID' })
  @ApiResponse({ status: 200, description: 'Função encontrada' })
  @ApiResponse({ status: 404, description: 'Função não encontrada' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.memberFunctionService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar uma função de membro' })
  @ApiResponse({ status: 200, description: 'Função atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Função não encontrada' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateMemberFunctionDto: UpdateMemberFunctionDto,
  ) {
    return this.memberFunctionService.update(id, req.user.tenantId, updateMemberFunctionDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover uma função de membro' })
  @ApiResponse({ status: 200, description: 'Função removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Função não encontrada' })
  remove(@Request() req, @Param('id') id: string) {
    return this.memberFunctionService.remove(id, req.user.tenantId);
  }
}
