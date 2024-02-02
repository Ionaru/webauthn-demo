import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faLockKeyhole,
  faLockKeyholeOpen,
} from '@fortawesome/sharp-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [RouterLink, FaIconComponent],
  templateUrl: './banner.component.html',
})
export class BannerComponent {
  user = toSignal(inject(AuthService).user$);
  bannerIcon = computed(() =>
    this.user() ? faLockKeyholeOpen : faLockKeyhole
  );
}
