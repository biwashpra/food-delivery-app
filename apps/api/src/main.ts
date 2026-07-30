import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  const PORT = process.env.PORT ?? 5000;
  await app.listen(PORT);

  console.log(`Api running on http://localhost:${PORT}`);
}

void bootstrap();
