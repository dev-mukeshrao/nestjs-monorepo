import { NestFactory } from '@nestjs/core';
import { UserApiModule } from './user-api.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(UserApiModule);

  const SwaggerConfig = new DocumentBuilder()
  .setTitle('User API')
  .setDescription('User Service API Description')
  .setVersion('1.0')
  .addTag('users')
  .build();

  const document = SwaggerModule.createDocument(app,SwaggerConfig)
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.port ?? 3001);
}
bootstrap();
