import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'Register new user succesfully',
  })
  @Post('signup')
  signUp(@Body() signUpDto: CreateUserDto) {
    return this._authService.signUp(signUpDto);
  }

  @ApiCreatedResponse({
    description: 'Log in succesfully',
  })
  @Post('login-with-password')
  login(@Body() logInDto: LogInDto) {
    return this._authService.loginWithPassword(logInDto);
  }

  //   @ApiCreatedResponse({
  //     description: 'Log in not-otp',
  //   })
  //   @Post('login-otp')
  //   loginNotOTP(@Body() logInDto: LogInNOTPDto) {
  //     return this._authService.loginNotOTP(logInDto.phone);
  //   }
}
