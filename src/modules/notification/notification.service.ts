import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';
import { PrismaService } from 'src/database/prisma.service';
import { PushNotificationService } from './push-notification.service';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private pushNotificationService: PushNotificationService,
    private prisma: PrismaService,
  ) {}

  async create(tenantId: string, createdById: string, createNotificationDto: CreateNotificationDto) {
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: createNotificationDto.userIds },
        tenantId
      }
    });

    if (users.length !== createNotificationDto.userIds.length) {
      throw new BadRequestException('Alguns usuários não foram encontrados ou não pertencem a esta organização');
    }

    const notification = await this.notificationRepository.create(tenantId, createdById, createNotificationDto);

    await this.pushNotificationService.sendToUsers(
      createNotificationDto.userIds,
      {
        title: createNotificationDto.title,
        body: createNotificationDto.message,
        data: {
          notificationId: notification.id,
          type: createNotificationDto.type,
          ...createNotificationDto.data
        }
      }
    );

    return notification;
  }

  async findUserNotifications(userId: string, tenantId: string, isRead?: boolean) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.notificationRepository.findUserNotifications(userId, isRead);
  }

  async markAsRead(userNotificationId: string, userId: string, tenantId: string) {
    const userNotification = await this.prisma.userNotification.findFirst({
      where: {
        id: userNotificationId,
        userId,
        notification: { tenantId }
      }
    });

    if (!userNotification) {
      throw new NotFoundException('Notificação não encontrada');
    }

    return this.notificationRepository.markAsRead(userNotificationId, userId);
  }

  async getUnreadCount(userId: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.notificationRepository.getUnreadCount(userId);
  }

  async updatePushToken(userId: string, tenantId: string, updatePushTokenDto: UpdatePushTokenDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.notificationRepository.updatePushToken(userId, updatePushTokenDto);
  }

  async createScheduleReminder(tenantId: string, scheduleId: string, userIds: string[]) {
    const schedule = await this.prisma.schedule.findFirst({
      where: { id: scheduleId, tenantId },
      include: { department: true }
    });

    if (!schedule) {
      throw new NotFoundException('Escala não encontrada');
    }

    return this.create(tenantId, 'system', {
      title: 'Lembrete de Escala',
      message: `Você tem uma escala hoje: ${schedule.title} - ${schedule.department.name}`,
      type: 'SCHEDULE_REMINDER',
      data: { scheduleId, departmentId: schedule.departmentId },
      userIds
    });
  }

  async createScheduleAssignment(tenantId: string, scheduleId: string, assignedUserId: string, assignedByUserId: string) {
    const schedule = await this.prisma.schedule.findFirst({
      where: { id: scheduleId, tenantId },
      include: { department: true }
    });

    if (!schedule) {
      throw new NotFoundException('Escala não encontrada');
    }

    return this.create(tenantId, assignedByUserId, {
      title: 'Nova Escala Atribuída',
      message: `Você foi escalado para: ${schedule.title} - ${schedule.department.name}`,
      type: 'SCHEDULE_ASSIGNMENT',
      data: { scheduleId, departmentId: schedule.departmentId },
      userIds: [assignedUserId]
    });
  }
}