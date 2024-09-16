import { Component } from '@angular/core';

@Component({
  selector: 'app-login-box',
  standalone: true,
  templateUrl: './login-box.component.html',
  host: {
    class: 'w-full bg-white shadow max-w-md',
  },
})
export class LoginBoxComponent {}
