import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import type {
  AuthenticatorAssertionResponseJSON,
  User,
} from '@passwordless-id/webauthn/dist/esm/types.js';

import { descriptions } from './dto.common';

@ObjectType()
export class SessionDTO {
  @Field(() => String, {
    nullable: true,
    description: descriptions.user.id,
  })
  userId?: string;

  @Field(() => String, { nullable: true, description: descriptions.user.name })
  user?: string;
}

@InputType()
export class AuthenticatorAssertionResponseDTO
  implements AuthenticatorAssertionResponseJSON
{
  @Field(() => String, { description: descriptions.response.clientDataJSON })
  clientDataJSON!: string;

  @Field(() => String, { description: descriptions.response.authenticatorData })
  authenticatorData!: string;

  @Field(() => String, { description: descriptions.response.signature })
  signature!: string;
}

@ArgsType()
export class AuthenticationDTO {
  @Field(() => String, { description: descriptions.id })
  id!: string;

  @Field(() => AuthenticatorAssertionResponseDTO)
  response!: AuthenticatorAssertionResponseDTO;
}

@InputType()
export class UserDTO implements User {
  @Field(() => String, { description: descriptions.user.name })
  name!: string;
}

@InputType()
export class AuthenticatorAttestationResponseDTO {
  @Field(() => String, { description: descriptions.response.clientDataJSON })
  clientDataJSON!: string;

  @Field(() => String, { description: descriptions.response.authenticatorData })
  authenticatorData!: string;

  @Field(() => String, { description: descriptions.response.publicKey })
  publicKey: string;

  @Field(() => Number, {
    description: descriptions.response.publicKeyAlgorithm,
  })
  publicKeyAlgorithm: number;
}

@ArgsType()
export class RegistrationDTO {
  @Field(() => String, { description: descriptions.id })
  id!: string;

  @Field(() => AuthenticatorAttestationResponseDTO)
  response!: AuthenticatorAttestationResponseDTO;

  @Field(() => UserDTO)
  user!: UserDTO;
}
