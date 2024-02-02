import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-login-box',
  standalone: true,
  templateUrl: './login-box.component.html',
})
export class LoginBoxComponent {
  @HostBinding('class')
  classes = ['w-full', 'bg-white', 'shadow', 'max-w-md'];
}
