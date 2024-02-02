import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faKeySkeleton,
  faRightFromBracket,
} from '@fortawesome/sharp-solid-svg-icons';
import { firstValueFrom } from 'rxjs';

import { BannerComponent } from '../../components/banner/banner.component';
import { ButtonComponent } from '../../components/button/button.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { LoginBoxComponent } from '../../components/login-box/login-box.component';
import { PageComponent } from '../../components/page/page.component';
import { AuthService } from '../../services/auth.service';
import { buildCredential, encodeCredential } from '../../utils/webauthn';

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

  readonly passKeyIcon = faKeySkeleton;
  readonly logoutIcon = faRightFromBracket;

  readonly isLoading = signal(false);
  readonly user = toSignal(this.#authService.user$);

  logout() {
    this.#authService.logout$().subscribe();
  }

  async addPasskey() {
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
        buildCredential(challenge, username),
      )) as PublicKeyCredential | null;
      if (!credential) {
        return;
      }

      const credentialId = credential.id;
      const response = credential.response as AuthenticatorAttestationResponse;

      this.#authService
        .addPasskey$(encodeCredential(credentialId, username, response))
        .subscribe();
    } finally {
      this.isLoading.set(false);
    }
  }
}
