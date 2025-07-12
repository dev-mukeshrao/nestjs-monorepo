import { NestFactory } from '@nestjs/core';
import { DocumentApiModule } from './document-api.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(DocumentApiModule);

  const SwaggerConfig = new DocumentBuilder()
  .setTitle('Document API')
  .setDescription('Document service API description')
  .setVersion('1.0')
  .addTag('documents')
  .build()

  const document = SwaggerModule.createDocument(app, SwaggerConfig)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
