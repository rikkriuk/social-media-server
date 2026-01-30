import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  const config = new DocumentBuilder()
    .setTitle('Social Media API')
    .setDescription('API documentation for minimal social media app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customCss: `
      .swagger-ui { background: #1a1a2e; }
      .swagger-ui .topbar { background: #16213e; }
      .swagger-ui .info .title, .swagger-ui .info p, .swagger-ui .info a { color: #eee; }
      .swagger-ui .scheme-container { background: #1a1a2e; box-shadow: none; }
      .swagger-ui .opblock-tag { color: #eee; border-bottom-color: #333; }
      .swagger-ui .opblock { background: #16213e; border-color: #333; }
      .swagger-ui .opblock .opblock-summary { border-color: #333; }
      .swagger-ui .opblock .opblock-summary-description { color: #ccc; }
      .swagger-ui .opblock .opblock-summary-path { color: #fff; }
      .swagger-ui .opblock .opblock-section-header { background: #0f3460; }
      .swagger-ui .opblock .opblock-section-header h4 { color: #eee; }
      .swagger-ui .opblock-body pre { background: #0a0a0a; color: #0f0; }
      .swagger-ui .model-box { background: #16213e; }
      .swagger-ui .model { color: #ccc; }
      .swagger-ui .model-title { color: #eee; }
      .swagger-ui table thead tr th { color: #eee; border-color: #333; }
      .swagger-ui table tbody tr td { color: #ccc; border-color: #333; }
      .swagger-ui .parameter__name, .swagger-ui .parameter__type { color: #ccc; }
      .swagger-ui .btn { background: #0f3460; color: #fff; border-color: #333; }
      .swagger-ui select { background: #16213e; color: #fff; border-color: #333; }
      .swagger-ui input[type=text] { background: #16213e; color: #fff; border-color: #333; }
      .swagger-ui .response-col_status { color: #eee; }
      .swagger-ui .response-col_description { color: #ccc; }
    `,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT || 3001);
  console.log(`Server running on http://localhost:${process.env.PORT || 3001}`);
  console.log(`Swagger docs: http://localhost:${process.env.PORT || 3001}/api-docs`);
}
bootstrap();
