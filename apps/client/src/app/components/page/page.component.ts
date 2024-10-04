import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page',
  standalone: true,
  template: `
    <section class="bg-gray-300">
      <div
        class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen"
      >
        @if (error(); as error) {
          <div class="text-center py-4 lg:px-4">
            <div
              class="p-2 bg-red-800 items-center text-red-100 leading-none lg:rounded-full flex lg:inline-flex"
              role="alert"
            >
              <span
                class="flex rounded-full bg-red-500 uppercase px-2 py-1 text-xs font-bold mr-3"
                >Error</span
              >
              <span class="mr-2 text-left flex-auto">{{ error }}</span>
            </div>
          </div>
        }
        <ng-content />
        <a [routerLink]="link()" class="text-sm font-light text-gray-500 mt-4">
          Go to {{ link() }}
        </a>
      </div>
    </section>
  `,
  imports: [RouterLink],
})
export class PageComponent {
  readonly link = input('/users');
  readonly error = input<string>();
}
