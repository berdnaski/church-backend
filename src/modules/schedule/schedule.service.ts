import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { ScheduleRepository } from './schedule.repository';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateScheduleMemberDto } from './dto/create-schedule-member.dto';
import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';
import { DepartmentService } from '../department/department.service';
import { PrismaService } from 'src/database/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ScheduleService {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private departmentService: DepartmentService,
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(tenantId: string, createScheduleDto: CreateScheduleDto) {
    await this.departmentService.findOne(createScheduleDto.departmentId, tenantId);

    const scheduleDate = new Date(createScheduleDto.date);
    const now = new Date();
    
    if (scheduleDate < now) {
      throw new BadRequestException('Não é possível criar escalas para datas passadas');
    }

    if (createScheduleDto.endDate) {
      const endDate = new Date(createScheduleDto.endDate);
      if (endDate <= scheduleDate) {
        throw new BadRequestException('A data de fim deve ser posterior à data de início');
      }
    }

    return this.scheduleRepository.create(tenantId, createScheduleDto);
  }

  async findAll(tenantId: string, departmentId?: string) {
    if (departmentId) {
      await this.departmentService.findOne(departmentId, tenantId);
    }

    return this.scheduleRepository.findAll(tenantId, departmentId);
  }

  async findOne(id: string, tenantId: string) {
    const schedule = await this.scheduleRepository.findOne(id, tenantId);
    if (!schedule) {
      throw new NotFoundException(`Escala com ID ${id} não encontrada`);
    }
    return schedule;
  }

  async update(id: string, tenantId: string, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.findOne(id, tenantId);

    if (updateScheduleDto.date) {
      const scheduleDate = new Date(updateScheduleDto.date);
      const now = new Date();
      
      if (scheduleDate < now && schedule.status !== 'COMPLETED') {
        throw new BadRequestException('Não é possível alterar a data para o passado');
      }
    }

    if (updateScheduleDto.endDate && updateScheduleDto.date) {
      const endDate = new Date(updateScheduleDto.endDate);
      const startDate = new Date(updateScheduleDto.date);
      
      if (endDate <= startDate) {
        throw new BadRequestException('A data de fim deve ser posterior à data de início');
      }
    }

    const updatedSchedule = await this.scheduleRepository.update(id, tenantId, updateScheduleDto);
    if (updateScheduleDto.date || updateScheduleDto.title) {
      const scheduleMembers = await this.prisma.scheduleMember.findMany({
        where: { scheduleId: id },
        select: { userId: true }
      });

      if (scheduleMembers.length > 0) {
        await this.notificationService.create(tenantId, 'system', {
          title: 'Alteração na Escala',
          message: `A escala "${schedule.title}" foi alterada. Verifique os detalhes.`,
          type: 'SCHEDULE_CHANGE',
          data: { scheduleId: id },
          userIds: scheduleMembers.map(sm => sm.userId)
        });
      }
    }

    return updatedSchedule;
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.scheduleRepository.remove(id, tenantId);
  }

  async addMember(scheduleId: string, tenantId: string, createScheduleMemberDto: CreateScheduleMemberDto, assignedByUserId: string) {
    const schedule = await this.findOne(scheduleId, tenantId);
    const user = await this.prisma.user.findFirst({
      where: { 
        id: createScheduleMemberDto.userId, 
        tenantId 
      },
      include: {
        roles: {
          include: {
            department: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const belongsToDepartment = user.roles.some(role => 
      role.departmentId === schedule.department.id
    );

    if (!belongsToDepartment) {
      throw new ConflictException('O usuário não pertence ao departamento desta escala');
    }
    if (createScheduleMemberDto.subcategoryId) {
      const subcategoryExists = await this.prisma.categoryDepartment.findFirst({
        where: {
          departmentId: schedule.department.id,
          category: {
            subcategories: {
              some: {
                id: createScheduleMemberDto.subcategoryId
              }
            }
          }
        }
      });

      if (!subcategoryExists) {
        throw new ConflictException('A função selecionada não está disponível neste departamento');
      }
    }
    await this.checkScheduleConflicts(
    createScheduleMemberDto.userId,
    schedule.date,
    schedule.endDate ?? undefined
    );

    try {
      const result = await this.scheduleRepository.addMember(scheduleId, createScheduleMemberDto);

      await this.notificationService.createScheduleAssignment(
        tenantId,
        scheduleId,
        createScheduleMemberDto.userId,
        assignedByUserId
      );

      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Este usuário já está escalado nesta função para esta escala');
      }
      throw error;
    }
  }

  async updateMember(memberId: string, tenantId: string, updateScheduleMemberDto: UpdateScheduleMemberDto) {
    const member = await this.prisma.scheduleMember.findFirst({
      where: { 
        id: memberId,
        schedule: { tenantId }
      },
      include: {
        schedule: true
      }
    });

    if (!member) {
      throw new NotFoundException('Membro da escala não encontrado');
    }

    if (updateScheduleMemberDto.subcategoryId) {
      const subcategoryExists = await this.prisma.categoryDepartment.findFirst({
        where: {
          departmentId: member.schedule.departmentId,
          category: {
            subcategories: {
              some: {
                id: updateScheduleMemberDto.subcategoryId
              }
            }
          }
        }
      });

      if (!subcategoryExists) {
        throw new ConflictException('A função selecionada não está disponível neste departamento');
      }
    }

    return this.scheduleRepository.updateMember(memberId, updateScheduleMemberDto);
  }

  async removeMember(memberId: string, tenantId: string) {
    const member = await this.prisma.scheduleMember.findFirst({
      where: { 
        id: memberId,
        schedule: { tenantId }
      }
    });

    if (!member) {
      throw new NotFoundException('Membro da escala não encontrado');
    }

    return this.scheduleRepository.removeMember(memberId);
  }

  async getUserSchedules(userId: string, tenantId: string, startDate?: string, endDate?: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return this.scheduleRepository.findMemberSchedules(userId, start, end);
  }

  private async checkScheduleConflicts(userId: string, scheduleDate: Date, scheduleEndDate?: Date) {
    const startOfDay = new Date(scheduleDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(scheduleDate);
    endOfDay.setHours(23, 59, 59, 999);
    const searchStart = scheduleDate;
    const searchEnd = scheduleEndDate || endOfDay;

    const conflictingSchedules = await this.prisma.scheduleMember.findMany({
      where: {
        userId,
        status: {
          in: ['CONFIRMED', 'PENDING']
        },
        schedule: {
          isActive: true,
          OR: [
            {
              date: {
                gte: searchStart,
                lt: searchEnd,
              }
            },
            {
              endDate: {
                gt: searchStart,
                lte: searchEnd,
              }
            },
            {
              date: {
                lte: searchStart,
              },
              endDate: {
                gte: searchEnd,
              }
            }
          ]
        }
      },
      include: {
        schedule: {
          select: {
            id: true,
            title: true,
            date: true,
            endDate: true,
            department: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (conflictingSchedules.length > 0) {
      const conflictInfo = conflictingSchedules.map(cs => 
        `${cs.schedule.title} (${cs.schedule.department.name}) - ${cs.schedule.date.toLocaleString('pt-BR')}`
      ).join(', ');
      
      throw new ConflictException(
        `O usuário já está escalado em outro(s) evento(s) no mesmo período: ${conflictInfo}`
      );
    }
  }

  async validateScheduleConflicts(userId: string, scheduleDate: Date, scheduleEndDate?: Date) {
    return this.checkScheduleConflicts(userId, scheduleDate, scheduleEndDate);
  }
}