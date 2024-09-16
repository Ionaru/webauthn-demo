import { ApiProperty } from '@nestjs/swagger';
import type {
  AuthenticationJSON,
  AuthenticatorAssertionResponseJSON, AuthenticatorAttestationResponseJSON, ExtendedAuthenticatorTransport,
  RegistrationJSON, User
} from '@passwordless-id/webauthn/dist/esm/types';

export class SessionDTO {
  @ApiProperty({ required: false, description: 'User ID' })
  userId?: string;

  @ApiProperty({ required: false, description: 'Username' })
  user?: string;
}

export class AuthenticatorAssertionResponseDTO implements AuthenticatorAssertionResponseJSON {
  @ApiProperty()
  clientDataJSON!: string;

  @ApiProperty()
  authenticatorData!: string;

  @ApiProperty()
  signature!: string;

  @ApiProperty()
  userHandle?: string;
}

export class AuthenticationDTO implements AuthenticationJSON {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  rawId!: string;

  @ApiProperty()
  response!: AuthenticatorAssertionResponseDTO;

  clientExtensionResults = {};

  @ApiProperty()
  type!: PublicKeyCredentialType;
}

export class AuthenticatorAttestationResponseDTO implements AuthenticatorAttestationResponseJSON {
  @ApiProperty()
  clientDataJSON!: string;

  @ApiProperty()
  authenticatorData!: string;

  @ApiProperty()
  signature!: string;

  @ApiProperty()
  userHandle?: string;

  @ApiProperty()
  attestationObject: string;

  @ApiProperty()
  publicKey: string;

  @ApiProperty()
  publicKeyAlgorithm: number;

  @ApiProperty()
  transports: ExtendedAuthenticatorTransport[];
}

export class RegistrationDTO implements RegistrationJSON {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  rawId!: string;

  @ApiProperty()
  response!: AuthenticatorAttestationResponseDTO;

  clientExtensionResults = {};

  @ApiProperty()
  type!: PublicKeyCredentialType;

  @ApiProperty()
  user!: User;
}
