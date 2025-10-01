import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

import { InviteCodeService } from './invite-code.service';
import { InviteCodeController } from './invite-code.controller';
import { InviteCodeRepository } from './invite-code.repository';

@Module({
  imports: [PrismaModule],
  providers: [InviteCodeService, InviteCodeRepository],
  controllers: [InviteCodeController],
  exports: [InviteCodeService],
})
export class InviteCodeModule {}
