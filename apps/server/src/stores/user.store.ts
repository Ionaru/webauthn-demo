import { randomUUID } from 'node:crypto';

import {
  ExtendedAuthenticatorTransport,
  NamedAlgo,
} from '@passwordless-id/webauthn/dist/esm/types.js';

interface Credential {
  id: string;
  publicKey: string;
  algorithm: NamedAlgo;
  transports: ExtendedAuthenticatorTransport[];
}

export interface User {
  id: string;
  username: string;
  credentials: Credential[];
}

class UserStore {
  #users: User[] = [];

  createUser(username: string, credential: Credential) {
    this.#users.push({
      id: randomUUID(),
      username,
      credentials: [credential],
    });
  }

  getUser(credentialId: string): User | undefined {
    return this.#users.find((user) =>
      user.credentials.some((credential) => credential.id === credentialId),
    );
  }

  addCredential(userId: string, credential: Credential) {
    const user = this.#users.find((user) => user.id === userId);
    if (user) {
      user.credentials.push(credential);
    }
  }
}

export const userStore = new UserStore();
