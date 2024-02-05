import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [RouterLink, FaIconComponent],
  templateUrl: './banner.component.html',
})
export class BannerComponent {
  user = toSignal(inject(AuthService).user$);
  bannerIcon = computed(() => (this.user() ? faLockOpen : faLock));
}
