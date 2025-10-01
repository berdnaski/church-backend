import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

import { AuthService } from './auth.service';
import { RegisterChurchDto } from './dto/register-church.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { RegisterMemberDto } from './dto/register-member.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register-member')
  @ApiOperation({ summary: 'Registrar novo membro em uma igreja usando inviteCode ou slug' })
  @ApiResponse({ status: 201, description: 'Membro registrado com sucesso.' })
  async registerMember(@Body() dto: RegisterMemberDto) {
    return this.authService.registerMember(dto);
  }

  @Public()
  @Post('register-church')
  @ApiOperation({ summary: 'Registrar nova igreja e administrador' })
  @ApiResponse({
    status: 201,
    description: 'Igreja registrada com sucesso',
  })
  async registerChurch(@Body() dto: RegisterChurchDto): Promise<AuthResponse> {
    return this.authService.registerChurch(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
  })
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }
}
