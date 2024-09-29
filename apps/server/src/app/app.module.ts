import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import mongo from 'connect-mongo';
import { NestSessionOptions, SessionModule } from 'nestjs-session';

import { Challenge } from '../models/challenge';
import { User } from '../models/user';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { ChallengeService } from './challenge.service';
import { UserService } from './user.service';

let sessionStore: mongo | undefined;

@Module({
  imports: [
    SessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
      ): Promise<NestSessionOptions> => {
        sessionStore = mongo.create({
          dbName: config.getOrThrow('WD_DB_NAME'),
          mongoUrl: config.getOrThrow('WD_DB_URL'),
          collectionName: 'session',
        });
        return {
          session: {
            name: config.getOrThrow('WD_SESSION_NAME'),
            resave: false,
            saveUninitialized: false,
            secret: config.getOrThrow('WD_SESSION_SECRET'),
            store: sessionStore,
          },
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: { path: 'schema.graphql' },
      context: ({ req }) => ({ req }),
      driver: ApolloDriver,
      introspection: true,
      sortSchema: true,
      playground: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const database = configService.getOrThrow('WD_DB_NAME');
        Logger.log(`Using database: ${database}`, AppModule.name);
        return {
          database,
          entities: [Challenge, User],
          extra: {
            authSource: 'admin',
          },
          type: 'mongodb',
          url: configService.getOrThrow('WD_DB_URL'),
        };
      },
    }),
    TypeOrmModule.forFeature([Challenge, User]),
  ],
  controllers: [AppController, AdminController],
  providers: [ChallengeService, UserService, AppResolver, AdminService],
})
export class AppModule {}
