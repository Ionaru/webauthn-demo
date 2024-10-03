import { ApiProperty } from '@nestjs/swagger';
import type {
  AuthenticationJSON,
  AuthenticatorAssertionResponseJSON,
  AuthenticatorAttestationResponseJSON,
  ExtendedAuthenticatorTransport,
  RegistrationJSON,
  User,
} from '@passwordless-id/webauthn/dist/esm/types.js';

import { descriptions } from './dto.common';

export class SessionDTO {
  @ApiProperty({ nullable: true, description: descriptions.user.id })
  userId?: string;

  @ApiProperty({ nullable: true, description: descriptions.user.name })
  user?: string;
}

export class AuthenticatorAssertionResponseDTO
  implements AuthenticatorAssertionResponseJSON
{
  @ApiProperty({ description: descriptions.response.clientDataJSON })
  clientDataJSON!: string;

  @ApiProperty({ description: descriptions.response.authenticatorData })
  authenticatorData!: string;

  @ApiProperty({ description: descriptions.response.signature })
  signature!: string;

  @ApiProperty({
    nullable: true,
    description: descriptions.response.userHandle,
  })
  userHandle?: string;
}

export class AuthenticationDTO implements AuthenticationJSON {
  @ApiProperty({ description: descriptions.id })
  id!: string;

  @ApiProperty({ description: descriptions.rawId })
  rawId!: string;

  @ApiProperty()
  response!: AuthenticatorAssertionResponseDTO;

  clientExtensionResults = {};

  @ApiProperty({ description: descriptions.type })
  type!: PublicKeyCredentialType;
}

export class UserDTO implements User {
  @ApiProperty({ description: descriptions.user.id })
  id!: string;

  @ApiProperty({ description: descriptions.user.name })
  name!: string;

  @ApiProperty({ nullable: true, description: descriptions.user.displayName })
  displayName?: string;
}

export class AuthenticatorAttestationResponseDTO
  implements AuthenticatorAttestationResponseJSON
{
  @ApiProperty({ description: descriptions.response.clientDataJSON })
  clientDataJSON!: string;

  @ApiProperty({ description: descriptions.response.authenticatorData })
  authenticatorData!: string;

  @ApiProperty({ description: descriptions.response.attestationObject })
  attestationObject: string;

  @ApiProperty({ description: descriptions.response.publicKey })
  publicKey: string;

  @ApiProperty({ description: descriptions.response.publicKeyAlgorithm })
  publicKeyAlgorithm: number;

  @ApiProperty({ description: descriptions.response.transports[0] })
  transports: ExtendedAuthenticatorTransport[];
}

export class RegistrationDTO implements RegistrationJSON {
  @ApiProperty({ description: descriptions.id })
  id!: string;

  @ApiProperty({ description: descriptions.rawId })
  rawId!: string;

  @ApiProperty()
  response!: AuthenticatorAttestationResponseDTO;

  clientExtensionResults = {};

  @ApiProperty({ description: descriptions.type })
  type!: PublicKeyCredentialType;

  @ApiProperty()
  user!: UserDTO;
}
