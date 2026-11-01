import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Validaciones globales: rechaza campos desconocidos y convierte tipos.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger: http://localhost:3000/api
  const config = new DocumentBuilder()
    .setTitle('API Librería SIS257')
    .setDescription('Sistema de gestión y ventas para librería')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend listo en http://localhost:${port}  |  Swagger: http://localhost:${port}/api`);
}
bootstrap();
