import { UseGuards, Post, Param, Body, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

import { InviteCodeEntity } from './invite-code.entity';
import { InviteCodeService } from './invite-code.service';

@ApiTags('Invite Codes')
@Controller('invite-codes')
@UseGuards(RolesGuard)
export class InviteCodeController {
  constructor(private inviteCodeService: InviteCodeService) {}

  @Post('generate/:tenantId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Gerar um código de convite para um tenant' })
  async generate(
    @Param('tenantId') tenantId: string,
    @Body() body: { ttlHours?: number },
  ): Promise<InviteCodeEntity> {
    return this.inviteCodeService.generateCode(tenantId, body?.ttlHours ?? 0);
  }

  @Post('validate/:code')
  @ApiOperation({ summary: 'Validar um código de convite' })
  async validate(@Param('code') code: string): Promise<InviteCodeEntity> {
    return this.inviteCodeService.validateCode(code);
  }
}
