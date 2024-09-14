import { Body, Controller, Get, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { Student } from '../student/student.entity';
import { AuthService } from './auth.service';
import { AuthGuardJwt } from './guard/auth-guard-jwt';
import { AuthGuardLocal } from './guard/auth-guard-local ';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: Student) {
    return {
      userId: user.id, 
      token: this.authService.getTokenForUser(user)
    }
  }

  @Post('/login/sendCode')
  @UseGuards(AuthGuardLocal) 
  async sendCode(@Body() { phoneNumber }, @CurrentUser() user: Student) {
    if(phoneNumber !== user.phoneNumber) throw new NotFoundException('Phone Number Not Found!')
    await this.authService.sendCode(phoneNumber);
    return 'code was sended to your phoneNumber'
  }

  @Post('/login/verifyCode')
  async verifyCode(@Body() input: {code: string, phoneNumber: string}){
    return await this.authService.verifyCode(input.phoneNumber, input.code)
  }

  @Get('profile')
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user: Student) {
    return user;
  }
}
 