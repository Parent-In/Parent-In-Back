import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

let cachedServer: express.Express;

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Parent-in API')
    .setDescription('API para la aplicación Parent-in')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', description: 'Ingresa el token JWT', in: 'header' }, 'JWT-auth')
    .addTag('app', 'Endpoints generales')
    .addTag('auth', 'Endpoints de autenticación')
    .addTag('users', 'Endpoints de usuarios')
    .addTag('onboarding', 'Endpoints de onboarding')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'Parent-in API Documentation',
      customCss: '.swagger-ui .topbar { display: none }',
    });
  }

  await app.init();
  cachedServer = server;
}

module.exports = async (req: any, res: any) => {
  if (!cachedServer) {
    await bootstrap();
  }
  cachedServer(req, res);
};
