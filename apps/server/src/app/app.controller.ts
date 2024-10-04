/* eslint-disable sonarjs/no-duplicate-string */
import { Body, Controller, Get, Post, Session, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiProduces,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { bindCallback, map } from 'rxjs';

import { notLoggedInError } from '../types/dto.common';
import {
  AuthenticationDTO,
  RegistrationDTO,
  SessionDTO,
} from '../types/dto.openapi';

import { ChallengeService } from './challenge.service';
import { UserService } from './user.service';

@Controller('/api')
export class AppController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly userService: UserService,
  ) {}

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
  @ApiProduces('text/plain')
  @ApiResponse({
    status: 201,
    type: String,
    description: 'base64url encoded random string',
  })
  createChallenge() {
    return this.challengeService.create();
  }

  @ApiTags('Authentication')
  @Post('login')
  @ApiProduces('text/plain')
  @ApiResponse({
    status: 201,
    type: String,
    description: 'The API key for the user',
  })
  async loginUser(
    @Body() data: AuthenticationDTO,
    @Session() session: Request['session'],
  ) {
    const result = await this.userService.loginUser(data);
    if (result) {
      session.userId = result.id.toHexString();
      session.user = result.username;
    }
    return bindCallback(session.save.bind(session))().pipe(
      map(() => (result ? this.userService.getApiKey(session.userId) : '')),
    );
  }

  @ApiTags('Registration')
  @Post('user/credential')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    type: Boolean,
    description: 'Whether the credential was added',
  })
  async addUserCredential(
    @Body() data: RegistrationDTO,
    @Req() request: Request,
    @Session() session: Request['session'],
  ) {
    const authorization = request.headers.authorization?.replace('Bearer ', '');
    if (!authorization && !session.userId) {
      throw notLoggedInError;
    }

    if (authorization) {
      const user = await this.userService.checkApiKey(authorization);
      if (!user) {
        throw notLoggedInError;
      }

      return this.userService.addPasskey(user.id.toHexString(), data);
    }

    return this.userService.addPasskey(session.userId, data);
  }

  @ApiTags('Registration')
  @Post('user')
  @ApiResponse({
    status: 201,
    type: Boolean,
    description: 'Whether the user was registered',
  })
  registerUser(@Body() data: RegistrationDTO) {
    return this.userService.registerUser(data);
  }

  @ApiTags('Authentication')
  @Post('logout')
  logoutUser(@Session() session: Request['session']) {
    return bindCallback(session.destroy.bind(session))().pipe(map(() => true));
  }

  @ApiTags('Secure')
  @Get('secret')
  @ApiProduces('text/plain')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: notLoggedInError.message })
  @ApiResponse({
    status: 200,
    type: String,
    description: 'Your personal secret',
  })
  async getSecret(
    @Req() request: Request,
    @Session() session: Request['session'],
  ) {
    const authorization = request.headers.authorization?.replace('Bearer ', '');
    if (!authorization && !session.userId) {
      throw notLoggedInError;
    }

    if (authorization) {
      const user = await this.userService.checkApiKey(authorization);
      if (!user) {
        throw notLoggedInError;
      }

      return this.userService.getSecret(user.id.toHexString());
    }

    return this.userService.getSecret(session.userId);
  }
}
