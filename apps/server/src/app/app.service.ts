import { Injectable } from '@nestjs/common';
import {
  verifyAuthentication,
  verifyRegistration,
} from '@passwordless-id/webauthn/dist/esm/server.js';
import {
  AuthenticationEncoded,
  RegistrationEncoded,
} from '@passwordless-id/webauthn/dist/esm/types';

import { challengeStore } from '../stores/challenge.store';
import { User, userStore } from '../stores/user.store';

const fromBase64 = (data: string) => Buffer.from(data, 'base64').toString();

@Injectable()
export class AppService {
  createChallenge(): string {
    return challengeStore.create();
  }

  checkChallenge(challenge: string): boolean {
    const result = challengeStore.verify(challenge);
    challengeStore.remove(challenge);
    return result;
  }

  async loginUser(data: string): Promise<User | null> {
    const authentication = JSON.parse(data) as AuthenticationEncoded;

    const matchingUser = userStore.getUser(authentication.credentialId);
    if (!matchingUser) {
      return;
    }

    const matchingCredential = matchingUser.credentials.find(
      (credential) => credential.id === authentication.credentialId
    );
    if (!matchingCredential) {
      return;
    }

    try {
      await verifyAuthentication(authentication, matchingCredential, {
        challenge: (challenge: string) =>
          this.checkChallenge(fromBase64(challenge)),
        counter: -1,
        origin: () => true,
        userVerified: true,
      });
    } catch {
      return;
    }

    return matchingUser;
  }

  async registerUser(data: string): Promise<boolean> {
    const registration = JSON.parse(data) as RegistrationEncoded;

    const registrationParsed = await verifyRegistration(registration, {
      challenge: (challenge: string) =>
        this.checkChallenge(fromBase64(challenge)),
      origin: () => true,
    });

    userStore.createUser(
      registrationParsed.username,
      registrationParsed.credential
    );

    return true;
  }

  async addPasskey(user: string, data: string): Promise<boolean> {
    const registration = JSON.parse(data) as RegistrationEncoded;

    const registrationParsed = await verifyRegistration(registration, {
      challenge: (challenge: string) =>
        this.checkChallenge(fromBase64(challenge)),
      origin: () => true,
    });

    userStore.addCredential(user, registrationParsed.credential);

    return true;
  }
}
