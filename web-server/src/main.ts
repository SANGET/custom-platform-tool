import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 3000;

export function logger(req, res, next) {
  console.log(`Request...`);
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  app.enableCors();
  await app.listen(port);
}

bootstrap();
