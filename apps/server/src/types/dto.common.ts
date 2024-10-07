import { UnauthorizedException } from '@nestjs/common';
import type {
  AuthenticationJSON,
  RegistrationJSON,
} from '@passwordless-id/webauthn/dist/esm/types.js';

type RecursiveStringify<T> = {
  [K in keyof T]: T[K] extends object ? RecursiveStringify<T[K]> : string;
};

export const descriptions: Readonly<
  RecursiveStringify<RegistrationJSON & AuthenticationJSON>
> = {
  id: 'ID of the credential, this should be created by the authenticator',
  rawId: 'base64 encoded version of the credential ID',
  response: {
    attestationObject:
      'base64 encoded AuthenticatorAttestationResponse.attestationObject',
    authenticatorData:
      'base64 encoded AuthenticatorAttestationResponse.authenticatorData',
    clientDataJSON:
      'base64 encoded AuthenticatorAttestationResponse.clientDataJSON',
    transports: ['AuthenticatorAttestationResponse.transports'],
    publicKey: 'base64 encoded AuthenticatorAttestationResponse.getPublicKey',
    publicKeyAlgorithm:
      'The public key algorithm of the credential in COSEAlgorithmIdentifier format, usually a negative number. This server only supports -7 (ES256) and -257 (RS256).',
    signature: 'base64 encoded AuthenticatorAttestationResponse.signature',
    userHandle: 'base64 encoded AuthenticatorAssertionResponse.userHandle',
  },
  clientExtensionResults: {},
  user: {
    id: 'ID of the user',
    name: 'Name of the user',
    displayName: 'Display name of the user',
  },
  type: 'The credential type, should always be "public-key"',
};

export const notLoggedInError = new UnauthorizedException(
  'User not logged in or invalid API Key given',
);
