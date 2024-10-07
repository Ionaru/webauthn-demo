import { Component, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

import { BannerComponent } from '../../components/banner/banner.component';
import { ButtonComponent } from '../../components/button/button.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { LoginBoxComponent } from '../../components/login-box/login-box.component';
import { PageComponent } from '../../components/page/page.component';
import { AuthService } from '../../services/auth.service';
import { toBase64 } from '../../utils/encoding';
import { buildCredentialCreationOptions } from '../../utils/webauthn';

@Component({
  standalone: true,
  templateUrl: './register.page.html',
  imports: [
    PageComponent,
    BannerComponent,
    LoginBoxComponent,
    RouterLink,
    ButtonComponent,
    FaIconComponent,
    LoaderComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class RegisterPage {
  readonly #authService = inject(AuthService);

  readonly displayNameControl = new FormControl('');

  readonly placeholderName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
  })
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

  readonly registerIcon = faKey;

  readonly isLoading = signal(false);

  readonly error = signal('');

  async register() {
    this.error.set('');
    this.isLoading.set(true);

    try {
      const challenge = await firstValueFrom(this.#authService.getChallenge$());
      if (!challenge) {
        return;
      }

      const username = this.displayNameControl.value || this.placeholderName;
      const credential = (await navigator.credentials.create(
        buildCredentialCreationOptions(challenge, username),
      )) as PublicKeyCredential | null;
      if (!credential) {
        return;
      }

      const response = credential.response as AuthenticatorAttestationResponse;

      await firstValueFrom(
        this.#authService.register$({
          id: credential.id,
          rawId: toBase64(credential.rawId),
          // type: 'public-key',
          user: {
            id: credential.id,
            name: username,
            displayName: username,
          },
          response: {
            attestationObject: toBase64(response.attestationObject),
            authenticatorData: toBase64(response.getAuthenticatorData()),
            clientDataJSON: toBase64(response.clientDataJSON),
            transports: response.getTransports() as any,
            publicKey: toBase64(response.getPublicKey()!),
            publicKeyAlgorithm: response.getPublicKeyAlgorithm(),
          },
        } as any),
      );
    } catch (error: any) {
      this.error.set(error.message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }
}
