import { Component } from '@angular/core';

@Component({
  selector: 'app-page',
  standalone: true,
  template: `
    <section class="bg-gray-300">
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen"
      >
        <ng-content></ng-content>
      </div>
    </section>
  `,
})
export class PageComponent {}
