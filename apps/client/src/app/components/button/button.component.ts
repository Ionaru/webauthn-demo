import { Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[app-button]',
  standalone: true,
  template: '<ng-content></ng-content>',
  host: {
    type: 'button',
    class: `
      w-full
      text-white
      bg-primary-500
      hover:bg-primary-600
      focus:ring-4
      focus:outline-none
      focus:ring-primary-300
      font-medium
      text-sm
      px-5
      py-2.5
      text-center
    `,
  },
})
export class ButtonComponent {}
