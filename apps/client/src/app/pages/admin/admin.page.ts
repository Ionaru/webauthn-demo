import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { BannerComponent } from '../../components/banner/banner.component';
import { ButtonComponent } from '../../components/button/button.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { LoginBoxComponent } from '../../components/login-box/login-box.component';
import { PageComponent } from '../../components/page/page.component';
import { UsersService } from '../../services/users.service';

@Component({
  templateUrl: './admin.page.html',
  standalone: true,
  imports: [
    BannerComponent,
    ButtonComponent,
    FaIconComponent,
    LoaderComponent,
    LoginBoxComponent,
    PageComponent,
    RouterLink,
  ],
})
export class AdminPage implements OnInit {
  readonly #usersService = inject(UsersService);
  readonly users = toSignal(this.#usersService.users$);

  ngOnInit() {
    this.#usersService.getUsers();
  }

  deleteCredential(username: string, credentialId: string) {
    const result = confirm(
      `Are you sure you want to delete a credential for ${username}?`,
    );
    if (!result) {
      return;
    }

    this.#usersService.deleteCredential(credentialId);
  }
}
