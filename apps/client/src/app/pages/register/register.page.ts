import { Component, inject, signal } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { LoginBoxComponent } from '../../components/login-box/login-box.component';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { faKeySkeleton } from '@fortawesome/sharp-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { LoaderComponent } from '../../components/loader/loader.component';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { buildCredential, encodeCredential } from '../../utils/webauthn';
import { firstValueFrom } from 'rxjs';

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
