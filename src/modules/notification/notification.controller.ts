import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Roles('ADMIN', 'LEADER')
  @ApiOperation({ summary: 'Criar nova notificação' })
  @ApiResponse({ status: 201, description: 'Notificação criada com sucesso' })
  create(@Request() req, @Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(
      req.user.tenantId,
      req.user.sub,
      createNotificationDto
    );
  }

  @Get('user/:userId')
  @Roles('ADMIN', 'LEADER', 'COORDINATOR', 'MEMBER', 'VOLUNTEER')
  @ApiOperation({ summary: 'Listar notificações do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de notificações do usuário' })
  findUserNotifications(
    @Request() req,
    @Param('userId') userId: string,
    @Query('isRead') isRead?: string
  ) {
    const isReadBoolean = isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.notificationService.findUserNotifications(
      userId,
      req.user.tenantId,
      isReadBoolean
    );
  }

  @Get('user/:userId/unread-count')
  @Roles('ADMIN', 'LEADER', 'COORDINATOR', 'MEMBER', 'VOLUNTEER')
  @ApiOperation({ summary: 'Contar notificações não lidas do usuário' })
  @ApiResponse({ status: 200, description: 'Número de notificações não lidas' })
  getUnreadCount(@Request() req, @Param('userId') userId: string) {
    return this.notificationService.getUnreadCount(userId, req.user.tenantId);
  }

  @Patch(':id/read')
  @Roles('ADMIN', 'LEADER', 'COORDINATOR', 'MEMBER', 'VOLUNTEER')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  @ApiResponse({ status: 200, description: 'Notificação marcada como lida' })
  markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationService.markAsRead(id, req.user.sub, req.user.tenantId);
  }

  @Post('push-token')
  @Roles('ADMIN', 'LEADER', 'COORDINATOR', 'MEMBER', 'VOLUNTEER')
  @ApiOperation({ summary: 'Atualizar token de push notification' })
  @ApiResponse({ status: 200, description: 'Token atualizado com sucesso' })
  updatePushToken(@Request() req, @Body() updatePushTokenDto: UpdatePushTokenDto) {
    return this.notificationService.updatePushToken(
      req.user.sub,
      req.user.tenantId,
      updatePushTokenDto
    );
  }
}