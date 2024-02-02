import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { SessionModule } from 'nestjs-session';

import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    SessionModule.forRoot({
      session: {
        name: 'DEMO_SESSION_ID',
        resave: false,
        saveUninitialized: false,
        secret: 'D3M0_S3CR3T',
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: { path: 'schema.graphql' },
      context: ({ res }) => ({ res }),
      driver: ApolloDriver,
      introspection: true,
      sortSchema: true,
    }),
  ],
  controllers: [],
  providers: [AppService, AppResolver],
})
export class AppModule {}
