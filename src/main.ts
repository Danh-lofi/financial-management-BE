import 'module-alias/register';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorInterceptor } from './interceptor/custom-error.interceptor';
import { CustomResponseInterceptor } from './interceptor/custom-response.interceptor';
import { LoggingInterceptor } from './interceptor/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new CustomResponseInterceptor());
  app.useGlobalInterceptors(new ErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các field không có trong DTO
      transform: true, // Tự động chuyển đổi kiểu dữ liệu
    }),
  );
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
