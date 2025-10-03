import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';

@Injectable()
export class NotificationRepository {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createdById: string, createNotificationDto: CreateNotificationDto) {
    const { userIds, ...notificationData } = createNotificationDto;

    return this.prisma.notification.create({
      data: {
        ...notificationData,
        tenant: { connect: { id: tenantId } },
        createdBy: { connect: { id: createdById } },
        users: {
          create: userIds.map(userId => ({
            user: { connect: { id: userId } }
          }))
        }
      },
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        data: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            isRead: true,
            user: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });
  }

  async findUserNotifications(userId: string, isRead?: boolean) {
    return this.prisma.userNotification.findMany({
      where: {
        userId,
        ...(isRead !== undefined && { isRead })
      },
      select: {
        id: true,
        isRead: true,
        readAt: true,
        createdAt: true,
        notification: {
          select: {
            id: true,
            title: true,
            message: true,
            type: true,
            data: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async markAsRead(userNotificationId: string, userId: string) {
    return this.prisma.userNotification.update({
      where: {
        id: userNotificationId,
        userId
      },
      data: {
        isRead: true,
        readAt: new Date()
      },
      select: {
        id: true,
        isRead: true,
        readAt: true,
      }
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.userNotification.count({
      where: {
        userId,
        isRead: false
      }
    });
  }

  async updatePushToken(userId: string, updatePushTokenDto: UpdatePushTokenDto) {
    await this.prisma.pushToken.updateMany({
      where: {
        userId,
        platform: updatePushTokenDto.platform
      },
      data: {
        isActive: false
      }
    });

    return this.prisma.pushToken.upsert({
      where: {
        token: updatePushTokenDto.token
      },
      update: {
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        user: { connect: { id: userId } },
        token: updatePushTokenDto.token,
        platform: updatePushTokenDto.platform,
        isActive: true
      },
      select: {
        id: true,
        token: true,
        platform: true,
        isActive: true,
      }
    });
  }

  async getUserPushTokens(userIds: string[]) {
    return this.prisma.pushToken.findMany({
      where: {
        userId: { in: userIds },
        isActive: true
      },
      select: {
        token: true,
        platform: true,
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
  }
}