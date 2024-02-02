import { Component, HostBinding } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[app-button]',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class ButtonComponent {
  @HostBinding() role = 'button';

  @HostBinding('class')
  public get buttonClass(): string[] {
    return [
      'w-full',
      'text-white',
      'bg-primary-500',
      'hover:bg-primary-600',
      'focus:ring-4',
      'focus:outline-none',
      'focus:ring-primary-300',
      'font-medium',
      'text-sm',
      'px-5',
      'py-2.5',
      'text-center',
    ];
  }
}
