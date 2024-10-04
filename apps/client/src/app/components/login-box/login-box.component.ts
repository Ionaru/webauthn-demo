import { Component } from '@angular/core';

@Component({
  selector: 'app-login-box',
  standalone: true,
  templateUrl: './login-box.component.html',
  host: {
    class: 'min-w-96 bg-white shadow',
  },
})
export class LoginBoxComponent {}
