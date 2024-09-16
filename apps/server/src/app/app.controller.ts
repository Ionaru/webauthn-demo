import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Request } from 'express';
import { AuthenticationDTO, RegistrationDTO, SessionDTO } from '../types/dto.openapi';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Authentication')
  @Get('user')
  @ApiResponse({
    status: 200,
    type: SessionDTO,
    description:
      'User session with ID and username, object will be empty if not logged in',
  })
  session(@Session() session: Request['session']) {
    return {
      user: session.user,
      userId: session.userId,
    };
  }

  @ApiTags('Challenge')
  @Post('challenge')
  @ApiResponse({
    status: 200,
    type: String,
    description: 'base64url encoded random string',
  })
  createChallenge() {
    return this.appService.createChallenge();
  }

  @ApiTags('Registration')
  @Post('user')
  registerUser(@Body() data: RegistrationDTO) {
    return this.appService.registerUser(data);
  }

  // @ApiTags('Registration')
  // @Post('user/credential')
  // addUserCredential(@Body() data: RegistrationDTO) {
  //   return this.appService.addPasskey(data);
  // }

  @ApiTags('Authentication')
  @Post('login')
  login(@Body() data: AuthenticationDTO) {
    return this.appService.loginUser(data);
  }

  // @ApiTags('Authentication')
  // @Post('logout')
  // logout(@Body() data: string) {
  //   return this.appService.registerUser(data);
  // }
}
