import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { useContainer } from "class-validator";

import { AppModule } from "@/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3001);
}
bootstrap();
