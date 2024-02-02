import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import {
  APOLLO_FLAGS,
  APOLLO_OPTIONS,
  ApolloModule,
  Flags,
} from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(appRoutes),
    importProvidersFrom(ApolloModule),
    {
      provide: APOLLO_FLAGS,
      useFactory: (): Flags => ({
        useInitialLoading: true,
        useMutationLoading: true,
      }),
    },
    {
      deps: [HttpLink],
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink): ApolloClientOptions<unknown> => ({
        cache: new InMemoryCache(),
        connectToDevTools: false,
        link: httpLink.create({ uri: '/graphql' }),
      }),
    },
  ],
};
