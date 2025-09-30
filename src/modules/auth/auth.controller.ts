import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterChurchDto } from './dto/register-church.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register-church')
  @ApiOperation({ summary: 'Registrar nova igreja e administrador' })
  @ApiResponse({ 
    status: 201, 
    description: 'Igreja registrada com sucesso',
  })
  async registerChurch(@Body() dto: RegisterChurchDto): Promise<AuthResponse> {
    return this.authService.registerChurch(dto);
  }

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