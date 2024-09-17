import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { bindCallback, map } from 'rxjs';

import {
  AuthenticationDTO,
  RegistrationDTO,
  SessionDTO,
} from '../types/dto.graphql';

import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

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
    return this.appService.createChallenge();
  }

  @Mutation(() => Boolean)
  async loginUser(
    @Args() queryArguments: AuthenticationDTO,
    @Context() { req: { session } }: { req: Request },
  ) {
    const result = await this.appService.loginUser(queryArguments);
    if (result) {
      session.userId = result.id;
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
      throw new Error('User not logged in');
    }

    return this.appService.addPasskey(session.userId, queryArguments);
  }

  @Mutation(() => Boolean)
  registerUser(@Args() queryArguments: RegistrationDTO) {
    return this.appService.registerUser(queryArguments);
  }

  @Mutation(() => Boolean)
  logoutUser(@Context() { req: { session } }: { req: Request }) {
    return bindCallback(session.destroy.bind(session))().pipe(map(() => true));
  }
}
