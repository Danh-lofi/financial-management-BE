import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CustomResponseInterceptor } from './interceptor/custom-response.interceptor';
import { ErrorInterceptor } from './interceptor/custom-error.interceptor';
import { LoggingInterceptor } from './interceptor/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new CustomResponseInterceptor());
  app.useGlobalInterceptors(new ErrorInterceptor());
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Financial Management API')
    .setDescription(
      'API documentation for the Financial Management application',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = configService.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
