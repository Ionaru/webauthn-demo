import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
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

  @Mutation(() => String, { description: 'base64url encoded random string' })
  createChallenge() {
    return this.challengeService.create();
  }

  @Mutation(() => Boolean)
  async loginUser(
    @Args() queryArguments: AuthenticationDTO,
    @Context() { req: { session } }: { req: Request },
  ) {
    const result = await this.userService.loginUser(queryArguments);
    if (result) {
      session.userId = result.id.toHexString();
      session.user = result.username;
    }
    return bindCallback(session.save.bind(session))().pipe(
      map(() => Boolean(result)),
    );
  }

  @Mutation(() => Boolean)
  addUserCredential(
    @Args() queryArguments: RegistrationDTO,
    @Context() { req: { session } }: { req: Request },
  ) {
    if (!session.userId) {
      throw notLoggedInError;
    }

    return this.userService.addPasskey(session.userId, queryArguments);
  }

  @Mutation(() => Boolean)
  registerUser(@Args() queryArguments: RegistrationDTO) {
    return this.userService.registerUser(queryArguments);
  }

  @Mutation(() => Boolean)
  logoutUser(@Context() { req: { session } }: { req: Request }) {
    return bindCallback(session.destroy.bind(session))().pipe(map(() => true));
  }

  @Query(() => String, {
    description: 'Your personal secret',
  })
  secret(@Context() { req: { session } }: { req: Request }) {
    if (!session.userId) {
      throw notLoggedInError;
    }

    return this.userService.getSecret(session.userId);
  }
}
