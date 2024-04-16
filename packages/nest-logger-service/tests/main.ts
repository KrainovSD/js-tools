import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';
import { AppModule } from './app.module';

async function start() {
  const PORT = process.env.PORT || 3001;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`],
      },
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Krainov Nest logger service')
    .setDescription('Документация по API')
    .setVersion('0.0.1')
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/docs`, app, document, {
    customSiteTitle: 'Krainov Nest logger service',
  });

  await app.startAllMicroservices();
  await app.listen(PORT);
}
start();
