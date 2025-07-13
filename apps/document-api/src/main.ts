import { NestFactory } from '@nestjs/core';
import { DocumentApiModule } from './document-api.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(DocumentApiModule);
  
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
  prefix: '/uploads/',
});

  const SwaggerConfig = new DocumentBuilder()
  .setTitle('Document API')
  .setDescription('Document service API description')
  .setVersion('1.0')
  .addTag('documents')
  .build()

  const document = SwaggerModule.createDocument(app, SwaggerConfig)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.port ?? 3002);
}
bootstrap();
