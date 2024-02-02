import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Server is running on: http://localhost:${port}/graphql`);
};

bootstrap().catch((error) => {
  throw error;
});
