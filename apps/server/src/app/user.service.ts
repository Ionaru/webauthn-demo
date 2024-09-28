import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { server } from '@passwordless-id/webauthn';
import {
  AuthenticationJSON,
  RegistrationJSON,
} from '@passwordless-id/webauthn/dist/esm/types.js';
import { MongoRepository, ObjectId } from 'typeorm';

import { Credential } from "../models/credential";
import { User } from '../models/user';

import { ChallengeService } from './challenge.service';

const fromBase64 = (data: string) => Buffer.from(data, 'base64').toString();

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly challengeService: ChallengeService,
  ) {}

  async loginUser(authentication: AuthenticationJSON): Promise<User | null> {
    const matchingUser = await this.userRepository.findOneBy({
      "credentials.id": authentication.id,
    });
    if (!matchingUser) {
      throw new HttpException('User not found', 404);
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
          this.challengeService.check(fromBase64(challenge)),
        counter: -1,
        origin: () => true,
        userVerified: true,
      });
    } catch {
      throw new HttpException('Incorrect credential', 401);
    }

    return matchingUser;
  }

  async registerUser(registration: RegistrationJSON): Promise<boolean> {
    const registrationParsed = await server.verifyRegistration(registration, {
      challenge: (challenge: string) =>
        this.challengeService.check(fromBase64(challenge)),
      origin: () => true,
    });

    const user = new User();
    user.username = registrationParsed.user.name;
    const credential = new Credential();
    credential.id = registrationParsed.credential.id;
    credential.publicKey = registrationParsed.credential.publicKey;
    credential.algorithm = registrationParsed.credential.algorithm;
    credential.transports = registrationParsed.credential.transports;
    user.credentials = [credential];
    await this.userRepository.save(user);

    return true;
  }

  async addPasskey(
    user: string,
    registration: RegistrationJSON,
  ): Promise<boolean> {
    const registrationParsed = await server.verifyRegistration(registration, {
      challenge: (challenge: string) =>
        this.challengeService.check(fromBase64(challenge)),
      origin: () => true,
    });

    const existingUser = await this.userRepository.findOneBy({
      _id: ObjectId.createFromHexString(user),
    });
    if (!existingUser) {
      throw new Error("User does not exist");
    }

    const credential = new Credential();
    credential.id = registrationParsed.credential.id;
    credential.publicKey = registrationParsed.credential.publicKey;
    credential.algorithm = registrationParsed.credential.algorithm;
    credential.transports = registrationParsed.credential.transports;
    existingUser.credentials.push(credential);
    await this.userRepository.save(existingUser);

    return true;
  }
}
