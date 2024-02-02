import { Component, inject } from '@angular/core';
import { PageComponent } from '../../components/page/page.component';
import { LoginBoxComponent } from '../../components/login-box/login-box.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from '../../components/button/button.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/sharp-solid-svg-icons';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  templateUrl: './secure.page.html',
  standalone: true,
  imports: [
    PageComponent,
    LoginBoxComponent,
    BannerComponent,
    ButtonComponent,
    FaIconComponent,
  ],
})
export class SecurePage {
  readonly #authService = inject(AuthService);
  readonly logoutIcon = faRightFromBracket;

  readonly user = toSignal(this.#authService.user$);

  logout() {
    this.#authService.logout$().subscribe();
  }
}
