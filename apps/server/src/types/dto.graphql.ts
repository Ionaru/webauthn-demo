import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import type {
  AuthenticationJSON,
  AuthenticatorAssertionResponseJSON,
  AuthenticatorAttestationResponseJSON, ExtendedAuthenticatorTransport, RegistrationJSON, User
} from '@passwordless-id/webauthn/dist/esm/types';

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

@InputType()
export class AuthenticatorAssertionResponseDTO implements AuthenticatorAssertionResponseJSON {
  @Field(() => String)
  clientDataJSON!: string;

  @Field(() => String)
  authenticatorData!: string;

  @Field(() => String)
  signature!: string;

  @Field(() => String, { nullable: true })
  userHandle?: string;
}

@ArgsType()
export class AuthenticationDTO implements AuthenticationJSON {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  rawId!: string;

  @Field(() => AuthenticatorAssertionResponseDTO)
  response!: AuthenticatorAssertionResponseDTO;

  clientExtensionResults = {};

  @Field(() => String)
  type!: PublicKeyCredentialType;
}

@InputType()
export class AuthenticatorAttestationResponseDTO implements AuthenticatorAttestationResponseJSON {
  @Field(() => String)
  clientDataJSON!: string;

  @Field(() => String)
  authenticatorData!: string;

  @Field(() => String)
  attestationObject: string;

  @Field(() => String)
  publicKey: string;

  @Field(() => Number)
  publicKeyAlgorithm: number;

  @Field(() => [String])
  transports: ExtendedAuthenticatorTransport[];
}

@ArgsType()
export class RegistrationDTO implements RegistrationJSON {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  rawId!: string;

  @Field(() => AuthenticatorAttestationResponseDTO)
  response!: AuthenticatorAttestationResponseDTO;

  clientExtensionResults = {};

  @Field(() => String)
  type!: PublicKeyCredentialType;

  @Field(() => String)
  user!: User;
}
