import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { User } from '../models/user';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async getUsers() {
    const users = await this.userRepository.find();
    return users.flatMap((user) =>
      user.credentials.map((credential) => ({
        credential: credential.id,
        username: user.username,
      })),
    );
  }

  async deleteUser(credentialId: string) {
    const user = await this.userRepository.findOneBy({
      'credentials.id': credentialId,
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    user.credentials = user.credentials.filter(
      (credential) => credential.id !== credentialId,
    );
    await (user.credentials.length === 0
      ? this.userRepository.delete(user.id)
      : this.userRepository.save(user));
  }
}
