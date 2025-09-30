import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterChurchDto {
  @IsString()
  tenantName: string;

  @IsString()
  tenantSlug: string;

  @IsString()
  adminName: string;

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(6)
  adminPassword: string;
}
