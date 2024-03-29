import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';

import { typedGql } from '../zeus/typedDocumentNode';

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
        query: typedGql('query')({
          session: {
            user: true,
          },
        }),
      })
      .pipe(
        tap((result) => {
          console.log('handshake user:', result.data.session.user);
          this.#userSubject.next(result.data.session.user);
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
        mutation: typedGql('mutation')({
          createChallenge: true,
        }),
      })
      .pipe(
        tap((result) => console.log('getChallenge result:', result)),
        map((result) => result.data?.createChallenge),
        tap(() => console.log('End getChallenge!')),
      );
  }

  login$(credential: string) {
    console.log('Start login!');
    return this.#apollo
      .mutate({
        fetchPolicy: 'no-cache',
        useMutationLoading: false,
        mutation: typedGql('mutation')({
          loginUser: [
            {
              data: credential,
            },
            true,
          ],
        }),
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

  register$(credential: string) {
    console.log('Start register!');
    return this.#apollo
      .mutate({
        fetchPolicy: 'no-cache',
        useMutationLoading: false,
        mutation: typedGql('mutation')({
          registerUser: [
            {
              data: credential,
            },
            true,
          ],
        }),
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

  addPasskey$(credential: string) {
    console.log('Start add passkey!');
    return this.#apollo
      .mutate({
        fetchPolicy: 'no-cache',
        useMutationLoading: false,
        mutation: typedGql('mutation')({
          addPasskey: [
            {
              data: credential,
            },
            true,
          ],
        }),
      })
      .pipe(
        tap((result) => console.log('Add result:', result)),
        map((result) => result.data?.addPasskey),
        tap(() => console.log('End add passkey!')),
      );
  }

  logout$() {
    console.log('Start logout!');
    return this.#apollo
      .mutate({
        mutation: typedGql('mutation')({
          logoutUser: true,
        }),
      })
      .pipe(
        tap(() => this.#userSubject.next(null)),
        switchMap(() => this.#router.navigate(['/'])),
        tap(() => console.log('Logout done!')),
      );
  }
}
