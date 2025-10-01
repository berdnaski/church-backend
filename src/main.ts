import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const appPort = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const mensagens = errors.map((err) => {
          const constraints = Object.values(err.constraints || {});
          return constraints.length > 0 ? constraints[0] : 'Campo inválido';
        });
        return new Error(mensagens.join(', '));
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Church SaaS API')
    .setDescription('API para gerenciamento de igrejas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(appPort);
  logger.log(`🚀 Aplicação rodando em: http://localhost:${appPort}`);
  logger.log(`📚 Documentação Swagger disponível em: http://localhost:${appPort}/docs`);
}
bootstrap();
