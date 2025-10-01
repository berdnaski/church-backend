import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';

import { TenantEntity } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantUpdateDto } from './dto/tenant-update.dto';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os tenants ativos' })
  async list(): Promise<TenantEntity[]> {
    return this.tenantService.listTenants();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um tenant pelo ID' })
  async get(@Param('id') id: string): Promise<TenantEntity> {
    return this.tenantService.getTenant(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar dados de um tenant' })
  async update(
    @Param('id') id: string,
    @Body() body: Partial<{ name: string; slug: string; isActive: boolean }>,
  ): Promise<TenantEntity> {
    return this.tenantService.updateTenant(id, body);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Desativar um tenant' })
  async deactivate(@Param('id') id: string): Promise<TenantEntity> {
    return this.tenantService.deactivateTenant(id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Ativar um tenant' })
  async activate(@Param('id') id: string): Promise<TenantEntity> {
    return this.tenantService.activateTenant(id);
  }

  @Patch(':id/public-access')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Definir se registro de membros é público ou privado' })
  async setPublicAccess(@Param('id') id: string, @Body() body: TenantUpdateDto) {
    return this.tenantService.updatePublicAccess(id, !!body.isPublic);
  }
}
