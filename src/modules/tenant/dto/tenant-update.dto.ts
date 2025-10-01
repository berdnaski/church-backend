import { IsBoolean, IsOptional } from 'class-validator';

export class TenantUpdateDto {
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
