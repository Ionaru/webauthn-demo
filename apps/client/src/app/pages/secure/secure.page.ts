import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faKey, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';

import { BannerComponent } from '../../components/banner/banner.component';
import { ButtonComponent } from '../../components/button/button.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { LoginBoxComponent } from '../../components/login-box/login-box.component';
import { PageComponent } from '../../components/page/page.component';
import { AuthService } from '../../services/auth.service';
import { toBase64 } from '../../utils/encoding';
import { buildCredentialCreationOptions } from '../../utils/webauthn';

@Component({
  templateUrl: './secure.page.html',
  standalone: true,
  imports: [
    PageComponent,
    LoginBoxComponent,
    BannerComponent,
    ButtonComponent,
    FaIconComponent,
    RouterLink,
    LoaderComponent,
  ],
})
export class SecurePage {
  readonly #authService = inject(AuthService);

  readonly passKeyIcon = faKey;
  readonly logoutIcon = faRightFromBracket;

  readonly isLoading = signal(false);
  readonly user = toSignal(this.#authService.user$);
  readonly secret = toSignal(this.#authService.secret$());

  readonly error = signal('');

  logout() {
    this.#authService.logout$().subscribe();
  }

  async addPasskey() {
    this.error.set('');
    this.isLoading.set(true);

    try {
      const challenge = await firstValueFrom(this.#authService.getChallenge$());
      if (!challenge) {
        return;
      }

      const username = this.user();
      if (!username) {
        return;
      }
      const credential = (await navigator.credentials.create(
        buildCredentialCreationOptions(challenge, username),
      )) as PublicKeyCredential | null;
      if (!credential) {
        return;
      }

      const response = credential.response as AuthenticatorAttestationResponse;

      await firstValueFrom(
        this.#authService.addPasskey$({
          id: credential.id,
          rawId: toBase64(credential.rawId),
          type: 'public-key',
          user: {
            id: username,
            name: username,
            displayName: username,
          },
          clientExtensionResults: {},
          response: {
            attestationObject: toBase64(response.attestationObject),
            authenticatorData: toBase64(response.getAuthenticatorData()),
            clientDataJSON: toBase64(response.clientDataJSON),
            transports: response.getTransports() as any,
            publicKey: toBase64(response.getPublicKey()!),
            publicKeyAlgorithm: response.getPublicKeyAlgorithm(),
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
