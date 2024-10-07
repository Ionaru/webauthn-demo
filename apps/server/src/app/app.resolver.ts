import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  AuthenticationJSON,
  RegistrationJSON,
} from '@passwordless-id/webauthn/dist/esm/types';
import { Request } from 'express';
import { bindCallback, map } from 'rxjs';

import { notLoggedInError } from '../types/dto.common';
import {
  AuthenticationDTO,
  RegistrationDTO,
  SessionDTO,
} from '../types/dto.graphql';

import { ChallengeService } from './challenge.service';
import { UserService } from './user.service';

@Resolver()
export class AppResolver {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly userService: UserService,
  ) {}

  @Query(() => SessionDTO, {
    nullable: true,
    description:
      'User session with ID and username, will return null if not logged in',
  })
  session(@Context() { req: { session } }: { req: Request }) {
    return session;
  }

  @Mutation(() => String, { description: 'base64 encoded random string' })
  createChallenge() {
    return this.challengeService.create();
  }

  @Mutation(() => String)
  async loginUser(
    @Args() data: AuthenticationDTO,
    @Context() { req: { session } }: { req: Request },
  ) {
    const result = await this.userService.loginUser(
      data as unknown as AuthenticationJSON,
    );
    if (result) {
      session.userId = result.id.toHexString();
      session.user = result.username;
    }
    return bindCallback(session.save.bind(session))().pipe(
      map(() => (result ? this.userService.getApiKey(session.userId) : '')),
    );
  }

  @Mutation(() => Boolean)
  async addUserCredential(
    @Args() data: RegistrationDTO,
    @Context() { req: { headers, session } }: { req: Request },
  ) {
    const authorization = headers.authorization?.replace('Bearer ', '');
    if (!authorization && !session.userId) {
      throw notLoggedInError;
    }

    if (authorization) {
      const user = await this.userService.checkApiKey(authorization);
      if (!user) {
        throw notLoggedInError;
      }

      return this.userService.addPasskey(
        user.id.toHexString(),
        data as unknown as RegistrationJSON,
      );
    }

    return this.userService.addPasskey(
      session.userId,
      data as unknown as RegistrationJSON,
    );
  }

  @Mutation(() => Boolean)
  registerUser(@Args() data: RegistrationDTO) {
    return this.userService.registerUser(data as unknown as RegistrationJSON);
  }

  @Mutation(() => Boolean)
  logoutUser(@Context() { req: { session } }: { req: Request }) {
    return bindCallback(session.destroy.bind(session))().pipe(map(() => true));
  }

  @Query(() => String, {
    description: 'Your personal secret',
  })
  async secret(@Context() { req: { headers, session } }: { req: Request }) {
    const authorization = headers.authorization?.replace('Bearer ', '');
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
