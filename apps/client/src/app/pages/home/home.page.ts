import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';

import { BannerComponent } from '../../components/banner/banner.component';
import { ButtonComponent } from '../../components/button/button.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { LoginBoxComponent } from '../../components/login-box/login-box.component';
import { PageComponent } from '../../components/page/page.component';
import { AuthService } from '../../services/auth.service';
import { buildGetCredential, encodeGetCredential } from '../../utils/webauthn';

@Component({
  templateUrl: './home.page.html',
  standalone: true,
  imports: [
    PageComponent,
    ButtonComponent,
    BannerComponent,
    LoginBoxComponent,
    RouterLink,
    FaIconComponent,
    LoaderComponent,
  ],
})
export class HomePage {
  readonly #authService = inject(AuthService);

  loginIcon = faKey;

  isLoading = signal(false);

  async login() {
    this.isLoading.set(true);
    try {
      const challenge = await firstValueFrom(this.#authService.getChallenge$());
      if (!challenge) {
        return;
      }

      const credential = (await navigator.credentials.get(
        buildGetCredential(challenge),
      )) as PublicKeyCredential | null;
      if (!credential) {
        return;
      }

      const credentialId = credential.id;
      const response = credential.response as AuthenticatorAssertionResponse;

      this.#authService
        .login$(encodeGetCredential(credentialId, response))
        .subscribe();
    } finally {
      this.isLoading.set(false);
    }
  }
}
