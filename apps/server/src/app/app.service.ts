import { HttpException, Injectable } from '@nestjs/common';
import { server } from '@passwordless-id/webauthn';
import {
  AuthenticationJSON,
  RegistrationJSON,
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

  async loginUser(authentication: AuthenticationJSON): Promise<User | null> {
    const matchingUser = userStore.getUser(authentication.id);
    if (!matchingUser) {
      return;
    }

    const matchingCredential = matchingUser.credentials.find(
      (credential) => credential.id === authentication.id,
    );
    if (!matchingCredential) {
      throw new HttpException('Credential not found', 404);
    }

    try {
      await server.verifyAuthentication(authentication, matchingCredential, {
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

  async registerUser(registration: RegistrationJSON): Promise<boolean> {
    const registrationParsed = await server.verifyRegistration(registration, {
      challenge: (challenge: string) =>
        this.checkChallenge(fromBase64(challenge)),
      origin: () => true,
    });

    userStore.createUser(
      registrationParsed.user.name,
      registrationParsed.credential,
    );

    return true;
  }

  async addPasskey(
    user: string,
    registration: RegistrationJSON,
  ): Promise<boolean> {
    const registrationParsed = await server.verifyRegistration(registration, {
      challenge: (challenge: string) =>
        this.checkChallenge(fromBase64(challenge)),
      origin: () => true,
    });

    userStore.addCredential(user, registrationParsed.credential);

    return true;
  }
}
