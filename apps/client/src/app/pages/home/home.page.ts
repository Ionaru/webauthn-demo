import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { utils } from '@passwordless-id/webauthn';
import { firstValueFrom } from 'rxjs';

import { BannerComponent } from '../../components/banner/banner.component';
import { ButtonComponent } from '../../components/button/button.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { LoginBoxComponent } from '../../components/login-box/login-box.component';
import { PageComponent } from '../../components/page/page.component';
import { AuthService } from '../../services/auth.service';
import { buildCredentialRequestOptions } from '../../utils/webauthn';

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

  readonly error = signal('');

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

      const response = credential.response as AuthenticatorAssertionResponse;

      await firstValueFrom(
        this.#authService.login$({
          id: credential.id,
          rawId: utils.toBase64url(credential.rawId),
          type: 'public-key',
          clientExtensionResults: {},
          response: {
            authenticatorData: utils.toBase64url(response.authenticatorData),
            clientDataJSON: utils.toBase64url(response.clientDataJSON),
            signature: utils.toBase64url(response.signature),
            userHandle: response.userHandle
              ? utils.toBase64url(response.userHandle)
              : undefined,
          },
        }),
      );
    } catch (error: any) {
      this.error.set(error.message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }
}
