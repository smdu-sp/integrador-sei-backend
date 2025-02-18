import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
  });// The timeout value for sockets
  
  const server = app.getHttpServer()
  server.setTimeout(2 * 60 * 1000)
  // The number of milliseconds of inactivity a server needs to wait for additional incoming data
  server.keepAliveTimeout = 30000
  // Limit the amount of time the parser will wait to receive the complete HTTP headers
  server.headersTimeout = 31000

  const options = new DocumentBuilder()
    .setTitle('Integrador SEI')
    .setDescription(
      'API de integração com o SEI',
    )
    .setVersion('versão 1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
