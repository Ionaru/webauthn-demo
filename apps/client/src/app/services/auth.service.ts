import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import type {
  AuthenticationJSON,
  RegistrationJSON,
} from '@passwordless-id/webauthn/dist/esm/types.js';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';

import {
  addPasskeyMutation,
  createChallengeMutation,
  loginMutation,
  logoutMutation,
  registerMutation,
  secretQuery,
  sessionQuery,
} from '../utils/graphql';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #apollo = inject(Apollo);
  readonly #router = inject(Router);

  readonly #userSubject = new BehaviorSubject<string | null | undefined>(null);
  user$ = this.#userSubject.asObservable();

  init$() {
    console.log('Start handshake!');
    return this.#apollo
      .query({
        fetchPolicy: 'no-cache',
        query: sessionQuery,
      })
      .pipe(
        tap((result) => {
          console.log('handshake user:', result.data.session?.user);
          this.#userSubject.next(result.data.session?.user);
        }),
        tap(() => console.log('End handshake!', this.#userSubject.value)),
      );
  }

  getChallenge$() {
    console.log('Start getChallenge!');
    return this.#apollo
      .mutate({
        fetchPolicy: 'no-cache',
        useMutationLoading: false,
        mutation: createChallengeMutation,
      })
      .pipe(
        tap((result) => console.log('getChallenge result:', result)),
        map((result) => result.data?.createChallenge),
        tap(() => console.log('End getChallenge!')),
      );
  }

  login$(credential: AuthenticationJSON) {
    console.log('Start login!');
    return this.#apollo
      .mutate({
        fetchPolicy: 'no-cache',
        useMutationLoading: false,
        mutation: loginMutation,
        variables: {
          id: credential.id,
          rawId: credential.rawId,
          type: credential.type,

          authenticatorData: credential.response.authenticatorData,
          clientDataJSON: credential.response.clientDataJSON,
          signature: credential.response.signature,
          userHandle: credential.response.userHandle ?? '',
        },
      })
      .pipe(
        tap((result) => console.log('Login result:', result)),
        map((result) => result.data?.loginUser),
        switchMap((result) => this.init$().pipe(map(() => result))),
        tap((result) => {
          if (result) {
            this.#router.navigate(['/secure']);
          }
        }),
        tap(() => console.log('End login!')),
      );
  }

  register$(credential: RegistrationJSON) {
    console.log('Start register!');
    return this.#apollo
      .mutate({
        fetchPolicy: 'no-cache',
        useMutationLoading: false,
        mutation: registerMutation,
        variables: {
          id: credential.id,
          rawId: credential.rawId,
          type: credential.type,

          attestationObject: credential.response.attestationObject,
          authenticatorData: credential.response.authenticatorData,
          clientDataJSON: credential.response.clientDataJSON,
          transports: credential.response.transports,
          publicKey: credential.response.publicKey,
          publicKeyAlgorithm: credential.response.publicKeyAlgorithm,

          userId: credential.user.id ?? crypto.randomUUID(),
          userName: credential.user.name,
          userDisplayName: credential.user.displayName,
        },
      })
      .pipe(
        tap((result) => console.log('Register result:', result)),
        map((result) => result.data?.registerUser),
        tap((result) => {
          if (result) {
            this.#router.navigate(['/']);
          }
        }),
        tap(() => console.log('End register!')),
      );
  }

  addPasskey$(credential: RegistrationJSON) {
    console.log('Start add passkey!');
    return this.#apollo
      .mutate({
        fetchPolicy: 'no-cache',
        useMutationLoading: false,
        mutation: addPasskeyMutation,
        variables: {
          id: credential.id,
          rawId: credential.rawId,
          type: credential.type,

          attestationObject: credential.response.attestationObject,
          authenticatorData: credential.response.authenticatorData,
          clientDataJSON: credential.response.clientDataJSON,
          transports: credential.response.transports,
          publicKey: credential.response.publicKey,
          publicKeyAlgorithm: credential.response.publicKeyAlgorithm,

          userId: credential.user.id ?? crypto.randomUUID(),
          userName: credential.user.name,
          userDisplayName: credential.user.displayName,
        },
      })
      .pipe(
        tap((result) => console.log('Add result:', result)),
        map((result) => result.data?.addUserCredential),
        tap(() => console.log('End add passkey!')),
      );
  }

  logout$() {
    console.log('Start logout!');
    return this.#apollo
      .mutate({
        mutation: logoutMutation,
      })
      .pipe(
        tap(() => this.#userSubject.next(null)),
        switchMap(() => this.#router.navigate(['/'])),
        tap(() => console.log('Logout done!')),
      );
  }

  secret$() {
    console.log('Start getSecret!');
    return this.#apollo
      .watchQuery({
        fetchPolicy: 'no-cache',
        useInitialLoading: false,
        query: secretQuery,
      })
      .valueChanges.pipe(
        tap((result) => console.log('getSecret result:', result)),
        map((result) => result.data?.secret),
        tap(() => console.log('End getSecret!')),
      );
  }
}
