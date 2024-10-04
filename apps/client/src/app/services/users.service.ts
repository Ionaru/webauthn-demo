import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../environment/environment';

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
      .get<User[]>(`${environment.baseUrl}/admin/users`)
      .subscribe((users) => this.#users.next(users));
  }

  deleteCredential(credentialId: string) {
    this.#http
      .delete(`${environment.baseUrl}/admin/users/${credentialId}`)
      .subscribe(() => this.getUsers());
  }
}
