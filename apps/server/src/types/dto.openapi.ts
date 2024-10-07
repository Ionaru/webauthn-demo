import { ApiProperty } from '@nestjs/swagger';
import type {
  AuthenticatorAssertionResponseJSON,
  User,
} from '@passwordless-id/webauthn/dist/esm/types.js';
import { Type } from 'class-transformer';
import {
  IsBase64,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

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
}

export class AuthenticationDTO {
  @ApiProperty({ description: descriptions.id })
  id!: string;

  @ValidateNested()
  @Type(() => AuthenticatorAssertionResponseDTO)
  @ApiProperty()
  response!: AuthenticatorAssertionResponseDTO;
}

export class UserDTO implements User {
  @IsString()
  @ApiProperty({ description: descriptions.user.name })
  name!: string;
}

export class AuthenticatorAttestationResponseDTO {
  @IsString()
  @IsNotEmpty()
  @IsBase64()
  @ApiProperty({ description: descriptions.response.clientDataJSON })
  clientDataJSON!: string;

  @IsString()
  @IsNotEmpty()
  @IsBase64()
  @ApiProperty({ description: descriptions.response.authenticatorData })
  authenticatorData!: string;

  @IsString()
  @IsNotEmpty()
  @IsBase64()
  @ApiProperty({ description: descriptions.response.publicKey })
  publicKey: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: descriptions.response.publicKeyAlgorithm })
  publicKeyAlgorithm: number;
}

export class RegistrationDTO {
  @IsString()
  @ApiProperty({ description: descriptions.id })
  id!: string;

  @ValidateNested()
  @Type(() => AuthenticatorAttestationResponseDTO)
  @ApiProperty()
  response!: AuthenticatorAttestationResponseDTO;

  @ValidateNested()
  @Type(() => UserDTO)
  @ApiProperty()
  user!: UserDTO;
}
