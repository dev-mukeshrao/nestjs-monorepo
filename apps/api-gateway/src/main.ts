import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { proxyConfig } from './proxy.config';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  proxyConfig.forEach(({ path, proxy}) => {
    app.use(path, proxy);
  })
  
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
