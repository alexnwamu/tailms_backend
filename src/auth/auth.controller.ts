import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: { example: { accessToken: 'jwt_token_here' } },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or account not active',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
