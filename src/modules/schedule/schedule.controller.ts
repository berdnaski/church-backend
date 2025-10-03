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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth-guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateScheduleMemberDto } from './dto/create-schedule-member.dto';
import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';

@ApiTags('Escalas')
@ApiBearerAuth()
@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar uma nova escala' })
  @ApiResponse({ status: 201, description: 'Escala criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  create(@Request() req, @Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(req.user.tenantId, createScheduleDto);
  }

  @Get()
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Listar todas as escalas' })
  @ApiQuery({ name: 'departmentId', required: false, description: 'Filtrar por departamento' })
  @ApiResponse({ status: 200, description: 'Lista de escalas retornada com sucesso' })
  findAll(@Request() req, @Query('departmentId') departmentId?: string) {
    return this.scheduleService.findAll(req.user.tenantId, departmentId);
  }

  @Get('user/:userId')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Listar escalas de um usuário' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data de início (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data de fim (ISO string)' })
  @ApiResponse({ status: 200, description: 'Escalas do usuário retornadas com sucesso' })
  getUserSchedules(
    @Request() req,
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.scheduleService.getUserSchedules(userId, req.user.tenantId, startDate, endDate);
  }

  @Get(':id')
  @Roles('ADMIN', 'MEMBER')
  @ApiOperation({ summary: 'Buscar uma escala pelo ID' })
  @ApiResponse({ status: 200, description: 'Escala encontrada' })
  @ApiResponse({ status: 404, description: 'Escala não encontrada' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.scheduleService.findOne(id, req.user.tenantId);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar uma escala' })
  @ApiResponse({ status: 200, description: 'Escala atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Escala não encontrada' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(id, req.user.tenantId, updateScheduleDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover uma escala' })
  @ApiResponse({ status: 200, description: 'Escala removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Escala não encontrada' })
  remove(@Request() req, @Param('id') id: string) {
    return this.scheduleService.remove(id, req.user.tenantId);
  }

  @Post(':id/members')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Adicionar membro à escala' })
  @ApiResponse({ status: 201, description: 'Membro adicionado com sucesso' })
  @ApiResponse({ status: 409, description: 'Conflito de horário ou membro já escalado' })
  addMember(
    @Request() req,
    @Param('id') scheduleId: string,
    @Body() createScheduleMemberDto: CreateScheduleMemberDto,
  ) {
    return this.scheduleService.addMember(scheduleId, req.user.tenantId, createScheduleMemberDto, req.user.id);
  }

  @Patch('members/:memberId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar membro da escala' })
  @ApiResponse({ status: 200, description: 'Membro atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  updateMember(
    @Request() req,
    @Param('memberId') memberId: string,
    @Body() updateScheduleMemberDto: UpdateScheduleMemberDto,
  ) {
    return this.scheduleService.updateMember(memberId, req.user.tenantId, updateScheduleMemberDto);
  }

  @Delete('members/:memberId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover membro da escala' })
  @ApiResponse({ status: 200, description: 'Membro removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  removeMember(@Request() req, @Param('memberId') memberId: string) {
    return this.scheduleService.removeMember(memberId, req.user.tenantId);
  }
}