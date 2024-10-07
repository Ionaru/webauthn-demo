import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { server } from '@passwordless-id/webauthn';
import {
  AuthenticationJSON,
  RegistrationJSON,
} from '@passwordless-id/webauthn/dist/esm/types.js';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';

import { Credential } from '../models/credential';
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
      'credentials.id': authentication.id,
    });
    if (!matchingUser) {
      throw new NotFoundException('User not found');
    }

    const matchingCredential = matchingUser.credentials.find(
      (credential) => credential.id === authentication.id,
    );
    if (!matchingCredential) {
      throw new NotFoundException('Credential not found');
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
      throw new UnauthorizedException('Incorrect credential');
    }

    return matchingUser;
  }

  async registerUser(registration: RegistrationJSON): Promise<boolean> {
    try {
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
      user.credentials = [credential];
      await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return true;
  }

  async addPasskey(
    user: string,
    registration: RegistrationJSON,
  ): Promise<boolean> {
    try {
      const registrationParsed = await server.verifyRegistration(registration, {
        challenge: (challenge: string) =>
          this.challengeService.check(fromBase64(challenge)),
        origin: () => true,
      });

      const existingUser = await this.userRepository.findOneBy({
        _id: ObjectId.createFromHexString(user),
      });
      if (!existingUser) {
        throw new Error('User does not exist');
      }

      const credential = new Credential();
      credential.id = registrationParsed.credential.id;
      credential.publicKey = registrationParsed.credential.publicKey;
      credential.algorithm = registrationParsed.credential.algorithm;
      existingUser.credentials.push(credential);
      await this.userRepository.save(existingUser);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return true;
  }

  checkApiKey(apiKey: string) {
    try {
      const userId = Buffer.from(apiKey, 'base64').toString('utf8');
      return this.userRepository.findOneBy({
        _id: ObjectId.createFromHexString(userId),
      });
    } catch {
      return null;
    }
  }

  getApiKey(userId: string) {
    return Buffer.from(userId, 'utf8').toString('base64');
  }

  /**
   * Generates a secret string based on the user ID
   */
  getSecret(userId: string) {
    const characters = [...userId];
    const sum = characters.reduce(
      (a, b) => a + (Number.parseInt(b, 10) || 0),
      0,
    );
    const numberAmount =
      characters.filter((c) => Boolean(Number(c))).length || 1;
    const letterAmount = characters.length - numberAmount || 1;
    return sum * letterAmount * numberAmount;
  }
}
