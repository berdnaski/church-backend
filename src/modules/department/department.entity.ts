import { Department as PrismaDepartment } from '@prisma/client';

import { FeatureDto } from './dto/create-department.dto';

export class DepartmentEntity implements PrismaDepartment {
  id: string;
  name: string;
  tenantId: string;
  features: any;
  createdAt: Date;
  updatedAt: Date;

  getFeaturesAsArray(): FeatureDto[] {
    try {
      if (typeof this.features === 'string') {
        return JSON.parse(this.features);
      }
      return this.features;
    } catch (error) {
      return [];
    }
  }

  static fromPrisma(prisma: PrismaDepartment): DepartmentEntity {
    const department = new DepartmentEntity();
    department.id = prisma.id;
    department.name = prisma.name;
    department.tenantId = prisma.tenantId;
    department.features = prisma.features;
    department.createdAt = prisma.createdAt;
    department.updatedAt = prisma.updatedAt;
    return department;
  }
}
