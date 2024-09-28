import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface User {
  credential: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  readonly #http = inject(HttpClient);

  readonly #users = new BehaviorSubject<User[]>([]);
  readonly users$ = this.#users.asObservable();

  getUsers() {
    this.#http
      .get<User[]>('/admin/users')
      .subscribe((users) => this.#users.next(users));
  }

  deleteCredential(credentialId: string) {
    this.#http
      .delete(`/admin/users/${credentialId}`)
      .subscribe(() => this.getUsers());
  }
}
