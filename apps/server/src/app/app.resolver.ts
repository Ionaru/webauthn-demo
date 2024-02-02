import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { bindCallback, map } from 'rxjs';

import { AuthArguments as AuthArguments, SessionDTO } from '../types/dto';

import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => SessionDTO)
  session(@Context() { req: { session } }: { req: Request }) {
    return session;
  }

  @Mutation(() => String)
  createChallenge() {
    return this.appService.createChallenge();
  }

  @Mutation(() => Boolean)
  async loginUser(
    @Args() queryArguments: AuthArguments,
    @Context() { req: { session } }: { req: Request },
  ) {
    const result = await this.appService.loginUser(queryArguments.data);
    if (result) {
      session.userId = result.id;
      session.user = result.username;
    }
    return Boolean(result);
  }

  @Mutation(() => Boolean)
  addPasskey(
    @Args() queryArguments: AuthArguments,
    @Context() { req: { session } }: { req: Request },
  ) {
    if (!session.userId) {
      throw new Error('User not logged in');
    }

    return this.appService.addPasskey(session.userId, queryArguments.data);
  }

  @Mutation(() => Boolean)
  registerUser(@Args() queryArguments: AuthArguments) {
    return this.appService.registerUser(queryArguments.data);
  }

  @Mutation(() => Boolean)
  logoutUser(@Context() { req: { session } }: { req: Request }) {
    return bindCallback(session.destroy.bind(session))().pipe(map(() => true));
  }
}
