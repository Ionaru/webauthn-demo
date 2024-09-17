import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import type {
  AuthenticationJSON,
  AuthenticatorAssertionResponseJSON,
  AuthenticatorAttestationResponseJSON,
  ExtendedAuthenticatorTransport,
  RegistrationJSON,
  User,
} from '@passwordless-id/webauthn/dist/esm/types';

import { descriptions } from './dto.common';

@ObjectType()
export class SessionDTO {
  @Field(() => String, {
    nullable: true,
    description: 'User ID in UUID format',
  })
  userId?: string;

  @Field(() => String, { nullable: true, description: 'The chosen username' })
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

  @Field(() => String, {
    nullable: true,
    description: descriptions.response.userHandle,
  })
  userHandle?: string;
}

@ArgsType()
export class AuthenticationDTO implements AuthenticationJSON {
  @Field(() => String, { description: descriptions.id })
  id!: string;

  @Field(() => String, { description: descriptions.rawId })
  rawId!: string;

  @Field(() => AuthenticatorAssertionResponseDTO)
  response!: AuthenticatorAssertionResponseDTO;

  clientExtensionResults = {};

  @Field(() => String, { description: descriptions.type })
  type!: PublicKeyCredentialType;
}

@InputType()
export class UserDTO implements User {
  @Field(() => String, { description: descriptions.user.id })
  id!: string;

  @Field(() => String, { description: descriptions.user.name })
  name!: string;

  @Field(() => String, {
    nullable: true,
    description: descriptions.user.displayName,
  })
  displayName?: string;
}

@InputType()
export class AuthenticatorAttestationResponseDTO
  implements AuthenticatorAttestationResponseJSON
{
  @Field(() => String, { description: descriptions.response.clientDataJSON })
  clientDataJSON!: string;

  @Field(() => String, { description: descriptions.response.authenticatorData })
  authenticatorData!: string;

  @Field(() => String, { description: descriptions.response.attestationObject })
  attestationObject: string;

  @Field(() => String, { description: descriptions.response.publicKey })
  publicKey: string;

  @Field(() => Number, {
    description: descriptions.response.publicKeyAlgorithm,
  })
  publicKeyAlgorithm: number;

  @Field(() => [String], { description: descriptions.response.transports[0] })
  transports: ExtendedAuthenticatorTransport[];
}

@ArgsType()
export class RegistrationDTO implements RegistrationJSON {
  @Field(() => String, { description: descriptions.id })
  id!: string;

  @Field(() => String, { description: descriptions.rawId })
  rawId!: string;

  @Field(() => AuthenticatorAttestationResponseDTO)
  response!: AuthenticatorAttestationResponseDTO;

  clientExtensionResults = {};

  @Field(() => String, { description: descriptions.type })
  type!: PublicKeyCredentialType;

  @Field(() => UserDTO)
  user!: UserDTO;
}
