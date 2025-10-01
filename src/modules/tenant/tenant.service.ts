import { BadRequestException, Injectable } from '@nestjs/common';

import { TenantRepository } from './tenant.repository';
import { TenantEntity } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(private tenantRepo: TenantRepository) {}

  async listTenants(): Promise<TenantEntity[]> {
    return this.tenantRepo.findAll();
  }

  async getTenant(id: string): Promise<TenantEntity> {
    return this.tenantRepo.findById(id);
  }

  async updateTenant(
    id: string,
    data: Partial<{ name: string; slug: string; isActive: boolean }>,
  ): Promise<TenantEntity> {
    return this.tenantRepo.update(id, data);
  }

  async deactivateTenant(id: string): Promise<TenantEntity> {
    return this.tenantRepo.deactivate(id);
  }

  async activateTenant(id: string): Promise<TenantEntity> {
    return this.tenantRepo.activate(id);
  }

  async updatePublicAccess(id: string, isPublic: boolean) {
    if (typeof isPublic !== 'boolean') {
      throw new BadRequestException('O valor de isPublic deve ser booleano.');
    }
    return this.tenantRepo.updateTenant(id, { isPublic });
  }
}
