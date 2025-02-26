import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  //NODE_ENV
  //PORT=3005 npm run start:dev
  //for production use npm run-script build and npm start:prod npm run prebuild && npm run build npm run prestart:prod
  const serverConfig = config.get('server');

  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  if(process.env.NODE_ENV === 'development') {
    logger.warn(`development mode - cors enabled`)
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin })
    logger.log(`Accepting requests from origin "${serverConfig.origin}"`);
  }

  const port = process.env.PORT || serverConfig.port;

  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}
bootstrap();
