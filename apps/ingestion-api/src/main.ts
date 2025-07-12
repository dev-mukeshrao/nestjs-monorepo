import { NestFactory } from '@nestjs/core';
import { IngestionApiModule } from './ingestion-api.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(IngestionApiModule);

  const SwaggerConfig = new DocumentBuilder()
  .setTitle('Ingestion API')
  .setDescription('Ingestion service API description')
  .setVersion('1.0')
  .addTag('ingestions')
  .build();

  const document = SwaggerModule.createDocument(app,SwaggerConfig) 
  SwaggerModule.setup('api', app, document)


  await app.listen(process.env.port ?? 3000);
}
bootstrap();
