import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://localhost:8443',
      'https://hypertube.com',
      'https://hypertube.com:8443',
    ],
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Hypertube Video Service API')
    .setDescription('API for video management and streaming')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Global route prefix
  app.setGlobalPrefix('');

  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  console.log(`🚀 Video Service started on port ${port}`);
  console.log(`📖 Swagger documentation available at http://localhost:${port}/api-docs`);
}

bootstrap(); 