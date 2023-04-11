import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configureSwaggerDocs } from './helpers/configure-swagger-docs.helper';
import { KafkaClient, Consumer } from 'kafka-node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  configureSwaggerDocs(app, configService);

  app.enableCors({
    origin: configService.get<string>('ENDPOINT_CORS'),
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });
  const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:9092' });
  const kafkaConsumer = new Consumer(kafkaClient, [{ topic: 'test-topic' }], {
    autoCommit: false
  });

  kafkaConsumer.on('message', function (message) {
    Logger.log('Received message: ', message);
  });

  const port = configService.get<number>('NODE_API_PORT') || 3000;
  await app.listen(port);
  Logger.log(`Url for OpenApi: ${await app.getUrl()}/docs`, 'Swagger');
}
bootstrap();
