import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class AuthArguments {
  @Field(() => String)
  data!: string;
}

@ObjectType()
export class SessionDTO {
  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String, { nullable: true })
  user?: string;
}
