import { CredentialInfo, ExtendedAuthenticatorTransport, NamedAlgo } from '@passwordless-id/webauthn/dist/esm/types.js';
import { Column } from 'typeorm';

export class Credential implements CredentialInfo {
  @Column({ type: "string" })
  id!: string;

  @Column({ type: "string" })
  publicKey!: string;

  @Column({ type: "string" })
  algorithm!: NamedAlgo;

  @Column({ type: "string" })
  transports!: ExtendedAuthenticatorTransport[];
}
