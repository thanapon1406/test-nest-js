import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configureSwaggerDocs } from './helpers/configure-swagger-docs.helper';
// import { KafkaClient, Consumer } from 'kafka-node';
import { Kafka } from 'kafkajs';

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

  // Subscribe to the Kafka topic here
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
  });
  const consumer = kafka.consumer({ groupId: 'test-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      Logger.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });

  const port = configService.get<number>('NODE_API_PORT') || 3000;
  await app.listen(port);
  Logger.log(`Url for OpenApi: ${await app.getUrl()}/docs`, 'Swagger');
}
bootstrap();
