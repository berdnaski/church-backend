import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateScheduleMemberDto } from './dto/create-schedule-member.dto';
import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ScheduleRepository {
  constructor(private prisma: PrismaService) {}

async create(tenantId: string, createScheduleDto: CreateScheduleDto) {
    const { departmentId, ...scheduleData } = createScheduleDto;
    
    return this.prisma.schedule.create({
      data: {
        ...scheduleData,
        date: new Date(createScheduleDto.date),
        endDate: createScheduleDto.endDate ? new Date(createScheduleDto.endDate) : undefined,
        tenantId,
        departmentId,
      },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      endDate: true,
      status: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}


  async findAll(tenantId: string, departmentId?: string) {
    return this.prisma.schedule.findMany({
      where: {
        tenantId,
        ...(departmentId && { departmentId }),
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        endDate: true,
        status: true,
        department: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            members: true,
          }
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.schedule.findFirst({
      where: { id, tenantId, isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        endDate: true,
        status: true,
        department: {
          select: {
            id: true,
            name: true,
          }
        },
        members: {
          select: {
            id: true,
            notes: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
              }
            },
            subcategory: {
              select: {
                id: true,
                name: true,
              }
            },
          }
        },
      },
    });
  }

  async update(id: string, tenantId: string, updateScheduleDto: UpdateScheduleDto) {
    const updateData: any = { ...updateScheduleDto };
    
    if (updateScheduleDto.date) {
      updateData.date = new Date(updateScheduleDto.date);
    }
    
    if (updateScheduleDto.endDate) {
      updateData.endDate = new Date(updateScheduleDto.endDate);
    }

    return this.prisma.schedule.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        endDate: true,
        status: true,
      },
    });
  }

  async remove(id: string, tenantId: string) {
    return this.prisma.schedule.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
      },
    });
  }

async addMember(scheduleId: string, createScheduleMemberDto: CreateScheduleMemberDto) {
    const { userId, subcategoryId, ...memberData } = createScheduleMemberDto;

    return this.prisma.scheduleMember.create({
      data: {
        ...memberData,
        scheduleId,
        userId,
        subcategoryId: subcategoryId || undefined,
      },
    select: {
      id: true,
      notes: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      subcategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}


  async updateMember(memberId: string, updateScheduleMemberDto: UpdateScheduleMemberDto) {
    return this.prisma.scheduleMember.update({
      where: { id: memberId },
      data: updateScheduleMemberDto,
      select: {
        id: true,
        notes: true,
        status: true,
      },
    });
  }

  async removeMember(memberId: string) {
    return this.prisma.scheduleMember.delete({
      where: { id: memberId },
      select: {
        id: true,
      },
    });
  }

  async findMemberSchedules(userId: string, startDate: Date, endDate: Date) {
    return this.prisma.scheduleMember.findMany({
      where: {
        userId,
        schedule: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          isActive: true,
        },
      },
      select: {
        id: true,
        status: true,
        schedule: {
          select: {
            id: true,
            title: true,
            date: true,
            endDate: true,
            department: {
              select: {
                id: true,
                name: true,
              }
            },
          }
        },
        subcategory: {
          select: {
            id: true,
            name: true,
          }
        },
      },
    });
  }
}