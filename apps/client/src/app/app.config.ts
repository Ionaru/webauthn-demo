import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { InMemoryCache } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { environment } from '../environment/environment';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(appRoutes),
    provideApollo(
      () => {
        const httpLink = inject(HttpLink);
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({ uri: `${environment.baseUrl}/graphql` }),
        };
      },
      {
        useInitialLoading: true,
        useMutationLoading: true,
      },
    ),
  ],
};
