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
import { toBase64 } from '../../utils/encoding';
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
    this.error.set('');
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
          rawId: toBase64(credential.rawId),
          type: 'public-key',
          clientExtensionResults: {},
          response: {
            authenticatorData: toBase64(response.authenticatorData),
            clientDataJSON: toBase64(response.clientDataJSON),
            signature: toBase64(response.signature),
            userHandle: response.userHandle
              ? toBase64(response.userHandle)
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
