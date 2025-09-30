import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { UserEntity } from "./entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { AuthResponse } from "./interfaces/auth-response.interface";
import { AuthRepository } from "./auth.repository";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RegisterChurchDto } from "./dto/register-church.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async registerChurch(dto: RegisterChurchDto): Promise<AuthResponse> {
    const tenant = await this.authRepository.createTenant(dto.tenantName, dto.tenantSlug);
    const hashedPassword = await this.hashPassword(dto.adminPassword);
    const admin = await this.authRepository.createAdmin({
      adminName: dto.adminName,
      adminEmail: dto.adminEmail,
      password: hashedPassword,
      tenantId: tenant.id,
    });
    const token = this.generateToken({
      sub: admin.id,
      tenantId: tenant.id,
      roles: ['ADMIN'],
      email: admin.email,
    });
    return {
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        roles: ['ADMIN'],
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.authRepository.findUserByEmailAndTenant(
      dto.email, 
      dto.tenantSlug
    );
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    await this.validatePassword(dto.password, user.password);
    
    const userEntity = UserEntity.fromPrisma(user);
    const token = this.generateToken({
      sub: userEntity.id,
      tenantId: userEntity.tenantId,
      roles: userEntity.roles,
      email: userEntity.email,
    });

    return {
      token,
      user: {
        id: userEntity.id,
        email: userEntity.email,
        name: userEntity.name,
        roles: userEntity.roles,
      },
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const rounds = Number(this.configService.get('BCRYPT_ROUNDS')) || 10;
    return bcrypt.hash(password, rounds);
  }

  private async validatePassword(plainPassword: string, hashedPassword: string): Promise<void> {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }

  private generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}