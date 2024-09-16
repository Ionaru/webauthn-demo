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
import {
  buildCredentialRequestOptions,
  encodeGetCredential,
} from '../../utils/webauthn';
import { utils } from '@passwordless-id/webauthn';

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
        buildCredentialRequestOptions(challenge),
      )) as PublicKeyCredential | null;
      if (!credential) {
        return;
      }

      console.log(credential);

      const response = credential.response as AuthenticatorAssertionResponse;

      this.#authService
        .login$({
          id: credential.id,
          rawId: utils.toBase64url(credential.rawId),
          type: 'public-key',
          clientExtensionResults: {},
          response: {
            authenticatorData: utils.toBase64url(response.authenticatorData),
            clientDataJSON: utils.toBase64url(response.clientDataJSON),
            signature: utils.toBase64url(response.signature),
            userHandle: response.userHandle ? utils.toBase64url(response.userHandle) : undefined,
          }
        })
        .subscribe();
    } finally {
      this.isLoading.set(false);
    }
  }
}
