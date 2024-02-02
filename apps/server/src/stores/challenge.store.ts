import { randomBytes } from 'node:crypto';

class ChallengeStore {
  #challenges = new Set<string>();

  create(): string {
    const challenge = randomBytes(64).toString('base64url');
    this.#challenges.add(challenge);
    return challenge;
  }

  remove(challenge: string): void {
    this.#challenges.delete(challenge);
  }

  verify(challenge: string): boolean {
    return this.#challenges.has(challenge);
  }
}

export const challengeStore = new ChallengeStore();
