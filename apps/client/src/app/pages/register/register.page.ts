import { Component, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faKeySkeleton } from '@fortawesome/sharp-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

import { BannerComponent } from '../../components/banner/banner.component';
import { ButtonComponent } from '../../components/button/button.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { LoginBoxComponent } from '../../components/login-box/login-box.component';
import { PageComponent } from '../../components/page/page.component';
import { AuthService } from '../../services/auth.service';
import { buildCredential, encodeCredential } from '../../utils/webauthn';

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

  readonly registerIcon = faKeySkeleton;

  readonly isLoading = signal(false);

  async register() {
    this.isLoading.set(true);

    try {
      const challenge = await firstValueFrom(this.#authService.getChallenge$());
      if (!challenge) {
        return;
      }

      const username = this.displayNameControl.value || this.placeholderName;
      const credential = (await navigator.credentials.create(
        buildCredential(challenge, username)
      )) as PublicKeyCredential | null;
      if (!credential) {
        return;
      }

      const credentialId = credential.id;
      const response = credential.response as AuthenticatorAttestationResponse;

      this.#authService
        .register$(encodeCredential(credentialId, username, response))
        .subscribe();
    } finally {
      this.isLoading.set(false);
    }
  }
}
